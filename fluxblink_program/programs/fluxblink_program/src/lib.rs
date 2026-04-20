use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("47qsb1iDqWq3zyBNsnFAyNEsFtCJX7EWsrEAy1aaY9jt");

// ============================================================================
// CONSTANTS
// ============================================================================

pub const PARKING_SEED: &[u8] = b"parking";
pub const VAULT_SEED: &[u8] = b"vault";
pub const MAX_RATE_PER_SECOND: u64 = 1_000_000;

// ============================================================================
// PROGRAM
// ============================================================================

#[program]
pub mod fluxblink_program {
    use super::*;

    pub fn start_parking(
        ctx: Context<StartParking>,
        parking_id: u64,
        deposit_amount: u64,
        rate_per_second: u64,
        max_ttl: i64,
    ) -> Result<()> {
        require!(deposit_amount > 0, FluxError::ZeroDeposit);
        require!(rate_per_second > 0, FluxError::ZeroRate);
        require!(rate_per_second <= MAX_RATE_PER_SECOND, FluxError::RateTooHigh);

        // --- Transfer tokens from driver → escrow vault ---
        let cpi_accounts = Transfer {
            from: ctx.accounts.driver_token_account.to_account_info(),
            to: ctx.accounts.escrow_vault.to_account_info(),
            authority: ctx.accounts.driver.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );
        token::transfer(cpi_ctx, deposit_amount)?;

        // TODO: Kamino CPI Deposit here
        // The escrow_vault now holds `deposit_amount` USDC. We would CPI to Kamino
        // to mint kUSDC (yield-bearing asset) into a PDA-controlled kToken account.
        msg!("FluxPark: [TODO] Depositing {} USDC into Kamino Finance...", deposit_amount);

        let parking = &mut ctx.accounts.parking_state;
        let clock = Clock::get()?;

        parking.driver = ctx.accounts.driver.key();
        parking.merchant = ctx.accounts.merchant.key();
        parking.authority = ctx.accounts.authority.key();
        parking.mint = ctx.accounts.mint.key();
        parking.escrow_vault = ctx.accounts.escrow_vault.key();
        parking.rate_per_second = rate_per_second;
        parking.total_deposited = deposit_amount;
        parking.total_consumed = 0;
        parking.last_consume_ts = clock.unix_timestamp;
        parking.created_at = clock.unix_timestamp;
        parking.is_active = true;
        parking.max_ttl = max_ttl;
        parking.parking_id = parking_id;
        parking.bump = ctx.bumps.parking_state;
        parking.vault_bump = ctx.bumps.escrow_vault;

        msg!(
            "FluxPark: Parking #{} started. Driver={}, Merchant={}, Deposit={}, Rate={}/sec",
            parking_id, parking.driver, parking.merchant, deposit_amount, rate_per_second,
        );

        Ok(())
    }

    pub fn consume_parking(
        ctx: Context<ConsumeParking>,
        seconds_consumed: u64,
    ) -> Result<()> {
        let parking = &mut ctx.accounts.parking_state;
        let clock = Clock::get()?;

        require!(parking.is_active, FluxError::ParkingInactive);
        require!(seconds_consumed > 0, FluxError::ZeroSeconds);

        // --- TTL Guard (Heartbeat / Kill-Switch) ---
        require!(
            clock.unix_timestamp <= parking.last_consume_ts + parking.max_ttl,
            FluxError::TtlExpired
        );

        let cost = seconds_consumed.checked_mul(parking.rate_per_second).ok_or(FluxError::MathOverflow)?;
        let remaining = parking.total_deposited.checked_sub(parking.total_consumed).ok_or(FluxError::MathOverflow)?;
        let actual_cost = if cost > remaining { remaining } else { cost };

        let driver_key = parking.driver.key();
        let parking_id_bytes = parking.parking_id.to_le_bytes();
        let bump = parking.vault_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[
            VAULT_SEED,
            driver_key.as_ref(),
            &parking_id_bytes,
            &[bump],
        ]];

        // TODO: Kamino CPI Withdraw here
        // We would CPI to Kamino to redeem `actual_cost` worth of kUSDC back to USDC
        // into the escrow_vault before transferring it to the merchant.
        msg!("FluxPark: [TODO] Withdrawing {} USDC from Kamino to pay Merchant...", actual_cost);

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_vault.to_account_info(),
            to: ctx.accounts.merchant_token_account.to_account_info(),
            authority: ctx.accounts.escrow_vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, actual_cost)?;

        parking.total_consumed = parking.total_consumed.checked_add(actual_cost).ok_or(FluxError::MathOverflow)?;
        parking.last_consume_ts = clock.unix_timestamp;

        if parking.total_consumed >= parking.total_deposited {
            parking.is_active = false;
        }

        Ok(())
    }

    pub fn close_parking(ctx: Context<CloseParking>) -> Result<()> {
        let parking = &ctx.accounts.parking_state;
        let remaining = parking.total_deposited.checked_sub(parking.total_consumed).ok_or(FluxError::MathOverflow)?;

        let driver_key = parking.driver.key();
        let parking_id_bytes = parking.parking_id.to_le_bytes();
        let bump = parking.vault_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[
            VAULT_SEED,
            driver_key.as_ref(),
            &parking_id_bytes,
            &[bump],
        ]];

        if remaining > 0 {
            // TODO: Kamino CPI Withdraw remaining here
            // Any remaining yield goes to the Merchant, while the base remaining
            // deposit is refunded to the Driver.
            msg!("FluxPark: [TODO] Withdrawing remaining {} USDC from Kamino for Driver refund...", remaining);

            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_vault.to_account_info(),
                to: ctx.accounts.driver_token_account.to_account_info(),
                authority: ctx.accounts.escrow_vault.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer_seeds,
            );
            token::transfer(cpi_ctx, remaining)?;
        }

        let cpi_accounts = anchor_spl::token::CloseAccount {
            account: ctx.accounts.escrow_vault.to_account_info(),
            destination: ctx.accounts.driver.to_account_info(),
            authority: ctx.accounts.escrow_vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        anchor_spl::token::close_account(cpi_ctx)?;

        Ok(())
    }
}

// ============================================================================
// ACCOUNTS
// ============================================================================

#[derive(Accounts)]
#[instruction(parking_id: u64)]
pub struct StartParking<'info> {
    #[account(mut)]
    pub driver: Signer<'info>,

    /// CHECK: Merchant (parking owner) wallet
    pub merchant: UncheckedAccount<'info>,

    /// CHECK: Backend authority
    pub authority: UncheckedAccount<'info>,
    
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        constraint = driver_token_account.owner == driver.key() @ FluxError::TokenOwnerMismatch,
        constraint = driver_token_account.mint == mint.key() @ FluxError::MintMismatch,
    )]
    pub driver_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = driver,
        seeds = [VAULT_SEED, driver.key().as_ref(), &parking_id.to_le_bytes()],
        bump,
        token::mint = mint,
        token::authority = escrow_vault,
    )]
    pub escrow_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = driver,
        space = 8 + ParkingState::INIT_SPACE,
        seeds = [PARKING_SEED, driver.key().as_ref(), &parking_id.to_le_bytes()],
        bump,
    )]
    pub parking_state: Box<Account<'info, ParkingState>>,

    // --- KAMINO CPI ACCOUNTS (Placeholders for upcoming integration) ---
    // /// CHECK: Kamino Strategy Program
    // pub kamino_program: UncheckedAccount<'info>,
    // /// CHECK: Kamino Global Config
    // pub kamino_global_config: UncheckedAccount<'info>,
    // /// CHECK: Kamino Strategy
    // #[account(mut)]
    // pub kamino_strategy: UncheckedAccount<'info>,
    // /// CHECK: Kamino kToken Mint (Yield Bearing Asset)
    // #[account(mut)]
    // pub ktoken_mint: UncheckedAccount<'info>,
    // #[account(
    //     init_if_needed,
    //     payer = driver,
    //     associated_token::mint = ktoken_mint,
    //     associated_token::authority = escrow_vault
    // )]
    // pub escrow_ktoken_account: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    // pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct ConsumeParking<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = parking_state.authority == authority.key() @ FluxError::Unauthorized,
        constraint = parking_state.is_active @ FluxError::ParkingInactive,
    )]
    pub parking_state: Box<Account<'info, ParkingState>>,

    #[account(
        mut,
        constraint = escrow_vault.key() == parking_state.escrow_vault @ FluxError::VaultMismatch,
    )]
    pub escrow_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = merchant_token_account.owner == parking_state.merchant @ FluxError::TokenOwnerMismatch,
        constraint = merchant_token_account.mint == parking_state.mint @ FluxError::MintMismatch,
    )]
    pub merchant_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CloseParking<'info> {
    #[account(mut)]
    pub driver: Signer<'info>,

    #[account(
        mut,
        constraint = parking_state.driver == driver.key() @ FluxError::Unauthorized,
        close = driver,
    )]
    pub parking_state: Box<Account<'info, ParkingState>>,

    #[account(
        mut,
        constraint = escrow_vault.key() == parking_state.escrow_vault @ FluxError::VaultMismatch,
    )]
    pub escrow_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = driver_token_account.owner == driver.key() @ FluxError::TokenOwnerMismatch,
        constraint = driver_token_account.mint == parking_state.mint @ FluxError::MintMismatch,
    )]
    pub driver_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

// ============================================================================
// STATE
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct ParkingState {
    pub driver: Pubkey,
    pub merchant: Pubkey,
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub escrow_vault: Pubkey,
    pub rate_per_second: u64,
    pub total_deposited: u64,
    pub total_consumed: u64,
    pub last_consume_ts: i64,
    pub created_at: i64,
    pub is_active: bool,
    pub max_ttl: i64,
    pub parking_id: u64,
    pub bump: u8,
    pub vault_bump: u8,
}

// ============================================================================
// ERRORS
// ============================================================================

#[error_code]
pub enum FluxError {
    #[msg("Deposit amount must be greater than zero.")]
    ZeroDeposit,
    #[msg("Rate per second must be greater than zero.")]
    ZeroRate,
    #[msg("Rate per second exceeds the maximum allowed.")]
    RateTooHigh,
    #[msg("The parking session is no longer active.")]
    ParkingInactive,
    #[msg("Seconds consumed must be greater than zero.")]
    ZeroSeconds,
    #[msg("Arithmetic overflow.")]
    MathOverflow,
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Token account owner does not match expected owner.")]
    TokenOwnerMismatch,
    #[msg("Token mint does not match expected mint.")]
    MintMismatch,
    #[msg("Escrow vault does not match the parking state.")]
    VaultMismatch,
    #[msg("Parking TTL expired. Heartbeat timeout reached.")]
    TtlExpired,
}
