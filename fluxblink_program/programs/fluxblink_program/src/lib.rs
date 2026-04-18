use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("47qsb1iDqWq3zyBNsnFAyNEsFtCJX7EWsrEAy1aaY9jt");

// ============================================================================
// CONSTANTS
// ============================================================================

/// Seed prefix for the stream state PDA.
pub const STREAM_SEED: &[u8] = b"stream";
/// Seed prefix for the escrow vault PDA.
pub const VAULT_SEED: &[u8] = b"vault";

/// Maximum rate per second: 1_000_000 token lamports (= 1 USDC/sec).
/// This prevents absurd rates from being set by mistake.
pub const MAX_RATE_PER_SECOND: u64 = 1_000_000;

// ============================================================================
// PROGRAM
// ============================================================================

#[program]
pub mod fluxblink_program {
    use super::*;

    /// Creates a new payment stream.
    ///
    /// The viewer deposits `deposit_amount` tokens into a program-controlled
    /// escrow vault. The `rate_per_second` defines how many token-lamports
    /// are consumed for each second of content viewed.
    ///
    /// # Arguments
    /// * `stream_id`       – A unique u64 chosen by the frontend for this stream.
    /// * `deposit_amount`  – Amount of tokens (in lamports) the viewer locks up.
    /// * `rate_per_second`  – Cost per second of viewing (in token lamports).
    pub fn initialize_stream(
        ctx: Context<InitializeStream>,
        stream_id: u64,
        deposit_amount: u64,
        rate_per_second: u64,
        max_ttl: i64,
    ) -> Result<()> {
        // --- Guards ---
        require!(deposit_amount > 0, FluxError::ZeroDeposit);
        require!(rate_per_second > 0, FluxError::ZeroRate);
        require!(
            rate_per_second <= MAX_RATE_PER_SECOND,
            FluxError::RateTooHigh
        );

        // --- Transfer tokens from viewer → escrow vault ---
        let cpi_accounts = Transfer {
            from: ctx.accounts.viewer_token_account.to_account_info(),
            to: ctx.accounts.escrow_vault.to_account_info(),
            authority: ctx.accounts.viewer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );
        token::transfer(cpi_ctx, deposit_amount)?;

        // --- Populate the stream state ---
        let stream = &mut ctx.accounts.stream_state;
        let clock = Clock::get()?;

        stream.viewer = ctx.accounts.viewer.key();
        stream.creator = ctx.accounts.creator.key();
        stream.authority = ctx.accounts.authority.key();
        stream.mint = ctx.accounts.mint.key();
        stream.escrow_vault = ctx.accounts.escrow_vault.key();
        stream.rate_per_second = rate_per_second;
        stream.total_deposited = deposit_amount;
        stream.total_consumed = 0;
        stream.last_consume_ts = clock.unix_timestamp;
        stream.created_at = clock.unix_timestamp;
        stream.is_active = true;
        stream.max_ttl = max_ttl;
        stream.stream_id = stream_id;
        stream.bump = ctx.bumps.stream_state;
        stream.vault_bump = ctx.bumps.escrow_vault;

        msg!(
            "FluxBlink: Stream #{} initialized. Viewer={}, Creator={}, Deposit={}, Rate={}/sec",
            stream_id,
            stream.viewer,
            stream.creator,
            deposit_amount,
            rate_per_second,
        );

        Ok(())
    }

    /// Consumes time from the stream.
    ///
    /// Only the designated `authority` (our backend) can call this.
    /// It calculates the cost for `seconds_consumed` and transfers that
    /// amount from the escrow vault to the creator's token account.
    ///
    /// # Arguments
    /// * `seconds_consumed` – Number of seconds the viewer has watched since
    ///                        the last consumption event.
    pub fn consume_stream(
        ctx: Context<ConsumeStream>,
        seconds_consumed: u64,
    ) -> Result<()> {
        let stream = &mut ctx.accounts.stream_state;
        let clock = Clock::get()?;

        // --- Guards ---
        require!(stream.is_active, FluxError::StreamInactive);
        require!(seconds_consumed > 0, FluxError::ZeroSeconds);

        // --- TTL Guard (Heartbeat / Kill-Switch) ---
        // If the time since the last consume exceeds the TTL, the stream is dead.
        require!(
            clock.unix_timestamp <= stream.last_consume_ts + stream.max_ttl,
            FluxError::TtlExpired
        );

        // Calculate cost
        let cost = seconds_consumed
            .checked_mul(stream.rate_per_second)
            .ok_or(FluxError::MathOverflow)?;

        let remaining = stream
            .total_deposited
            .checked_sub(stream.total_consumed)
            .ok_or(FluxError::MathOverflow)?;

        // If not enough balance, consume everything remaining and deactivate
        let actual_cost = if cost > remaining {
            remaining
        } else {
            cost
        };

        // --- Transfer tokens from escrow vault → creator ---
        let viewer_key = stream.viewer.key();
        let stream_id_bytes = stream.stream_id.to_le_bytes();
        let bump = stream.vault_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[
            VAULT_SEED,
            viewer_key.as_ref(),
            &stream_id_bytes,
            &[bump],
        ]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_vault.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
            authority: ctx.accounts.escrow_vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, actual_cost)?;

        // --- Update state ---
        stream.total_consumed = stream
            .total_consumed
            .checked_add(actual_cost)
            .ok_or(FluxError::MathOverflow)?;
        stream.last_consume_ts = clock.unix_timestamp;

        // Auto-close if fully consumed
        if stream.total_consumed >= stream.total_deposited {
            stream.is_active = false;
            msg!(
                "FluxBlink: Stream #{} fully consumed. Total paid to creator: {}",
                stream.stream_id,
                stream.total_consumed,
            );
        } else {
            msg!(
                "FluxBlink: Stream #{} consumed {}s (cost={}). Remaining: {}",
                stream.stream_id,
                seconds_consumed,
                actual_cost,
                stream.total_deposited - stream.total_consumed,
            );
        }

        Ok(())
    }

    /// Closes the stream and refunds the remaining balance to the viewer.
    ///
    /// Can be called by the viewer at any time to stop watching and get
    /// their remaining deposit back. The stream state account rent is
    /// also returned to the viewer.
    pub fn close_stream(ctx: Context<CloseStream>) -> Result<()> {
        let stream = &ctx.accounts.stream_state;

        // Calculate remaining balance
        let remaining = stream
            .total_deposited
            .checked_sub(stream.total_consumed)
            .ok_or(FluxError::MathOverflow)?;

        // --- Transfer remaining tokens from escrow → viewer ---
        if remaining > 0 {
            let viewer_key = stream.viewer.key();
            let stream_id_bytes = stream.stream_id.to_le_bytes();
            let bump = stream.vault_bump;
            let signer_seeds: &[&[&[u8]]] = &[&[
                VAULT_SEED,
                viewer_key.as_ref(),
                &stream_id_bytes,
                &[bump],
            ]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_vault.to_account_info(),
                to: ctx.accounts.viewer_token_account.to_account_info(),
                authority: ctx.accounts.escrow_vault.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer_seeds,
            );
            token::transfer(cpi_ctx, remaining)?;
        }

        msg!(
            "FluxBlink: Stream #{} closed. Refunded {} to viewer. Total paid: {}",
            stream.stream_id,
            remaining,
            stream.total_consumed,
        );

        // The stream_state account is closed via the `close = viewer` constraint,
        // returning the rent-exempt SOL to the viewer.
        // The escrow_vault token account is closed via close_account below.

        // --- Close the escrow vault token account ---
        let viewer_key = stream.viewer.key();
        let stream_id_bytes = stream.stream_id.to_le_bytes();
        let bump = stream.vault_bump;
        let signer_seeds: &[&[&[u8]]] = &[&[
            VAULT_SEED,
            viewer_key.as_ref(),
            &stream_id_bytes,
            &[bump],
        ]];

        let cpi_accounts = anchor_spl::token::CloseAccount {
            account: ctx.accounts.escrow_vault.to_account_info(),
            destination: ctx.accounts.viewer.to_account_info(),
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
#[instruction(stream_id: u64, deposit_amount: u64, rate_per_second: u64, max_ttl: i64)]
pub struct InitializeStream<'info> {
    /// The viewer (payer) who deposits tokens and watches content.
    #[account(mut)]
    pub viewer: Signer<'info>,

    /// The content creator who will receive payments.
    /// CHECK: We only store this pubkey; no data is read or written.
    pub creator: UncheckedAccount<'info>,

    /// The backend authority allowed to call `consume_stream`.
    /// CHECK: We only store this pubkey; no data is read or written.
    pub authority: UncheckedAccount<'info>,

    /// The SPL token mint (e.g. USDC).
    pub mint: Box<Account<'info, Mint>>,

    /// The viewer's token account that tokens will be transferred from.
    #[account(
        mut,
        constraint = viewer_token_account.owner == viewer.key() @ FluxError::TokenOwnerMismatch,
        constraint = viewer_token_account.mint == mint.key() @ FluxError::MintMismatch,
    )]
    pub viewer_token_account: Box<Account<'info, TokenAccount>>,


    /// The program-controlled escrow vault (a PDA-owned token account).
    #[account(
        init,
        payer = viewer,
        seeds = [VAULT_SEED, viewer.key().as_ref(), &stream_id.to_le_bytes()],
        bump,
        token::mint = mint,
        token::authority = escrow_vault,
    )]
    pub escrow_vault: Box<Account<'info, TokenAccount>>,

    /// The stream state PDA that tracks consumption.
    #[account(
        init,
        payer = viewer,
        space = 8 + StreamState::INIT_SPACE,
        seeds = [STREAM_SEED, viewer.key().as_ref(), &stream_id.to_le_bytes()],
        bump,
    )]
    pub stream_state: Box<Account<'info, StreamState>>,


    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ConsumeStream<'info> {
    /// The backend authority that reports viewing time.
    pub authority: Signer<'info>,

    /// The stream state — must match the authority.
    #[account(
        mut,
        constraint = stream_state.authority == authority.key() @ FluxError::Unauthorized,
        constraint = stream_state.is_active @ FluxError::StreamInactive,
    )]
    pub stream_state: Box<Account<'info, StreamState>>,

    /// The escrow vault holding the viewer's deposit.
    #[account(
        mut,
        constraint = escrow_vault.key() == stream_state.escrow_vault @ FluxError::VaultMismatch,
    )]
    pub escrow_vault: Box<Account<'info, TokenAccount>>,


    /// The creator's token account to receive payment.
    #[account(
        mut,
        constraint = creator_token_account.owner == stream_state.creator @ FluxError::TokenOwnerMismatch,
        constraint = creator_token_account.mint == stream_state.mint @ FluxError::MintMismatch,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CloseStream<'info> {
    /// Only the viewer can close (and receive the refund).
    #[account(mut)]
    pub viewer: Signer<'info>,

    /// The stream state — closed and rent returned to viewer.
    #[account(
        mut,
        constraint = stream_state.viewer == viewer.key() @ FluxError::Unauthorized,
        close = viewer,
    )]
    pub stream_state: Box<Account<'info, StreamState>>,

    /// The escrow vault to drain remaining tokens from.
    #[account(
        mut,
        constraint = escrow_vault.key() == stream_state.escrow_vault @ FluxError::VaultMismatch,
    )]
    pub escrow_vault: Box<Account<'info, TokenAccount>>,


    /// The viewer's token account to receive the refund.
    #[account(
        mut,
        constraint = viewer_token_account.owner == viewer.key() @ FluxError::TokenOwnerMismatch,
        constraint = viewer_token_account.mint == stream_state.mint @ FluxError::MintMismatch,
    )]
    pub viewer_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

// ============================================================================
// STATE
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct StreamState {
    /// The wallet of the person watching/paying.
    pub viewer: Pubkey,
    /// The wallet of the content creator receiving payment.
    pub creator: Pubkey,
    /// The backend authority that can call `consume_stream`.
    pub authority: Pubkey,
    /// The SPL token mint used for payment (e.g. USDC).
    pub mint: Pubkey,
    /// The PDA-controlled token account holding escrowed funds.
    pub escrow_vault: Pubkey,
    /// Cost in token-lamports for each second of content viewed.
    pub rate_per_second: u64,
    /// Total tokens deposited into the escrow by the viewer.
    pub total_deposited: u64,
    /// Total tokens consumed (transferred to creator) so far.
    pub total_consumed: u64,
    /// Unix timestamp of the last consumption event.
    pub last_consume_ts: i64,
    /// Unix timestamp when the stream was created.
    pub created_at: i64,
    /// Whether the stream is currently active.
    pub is_active: bool,
    /// Maximum time (seconds) allowed between heartbeats before auto-pause.
    pub max_ttl: i64,
    /// A unique identifier for this stream (set by frontend).
    pub stream_id: u64,
    /// PDA bump for the stream_state account.
    pub bump: u8,
    /// PDA bump for the escrow_vault account.
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
    #[msg("The stream is no longer active.")]
    StreamInactive,
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
    #[msg("Escrow vault does not match the stream state.")]
    VaultMismatch,
    #[msg("Stream TTL expired. Heartbeat timeout reached.")]
    TtlExpired,
}
