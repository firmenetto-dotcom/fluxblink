import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FluxblinkProgram } from "../target/types/fluxblink_program";
import { 
  TOKEN_PROGRAM_ID, 
  AccountLayout,
  MintLayout,
} from "@solana/spl-token";
import { expect } from "chai";
import { startAnchor } from "anchor-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("fluxblink_program (Bankrun)", () => {
  const viewer = Keypair.generate();
  const creator = Keypair.generate();
  const authority = Keypair.generate();
  const mint = Keypair.generate();

  const streamId = new anchor.BN(12345);
  const depositAmount = new anchor.BN(1_000_000); // 1 USDC
  const ratePerSecond = new anchor.BN(100); // 100 microlamports/sec
  const maxTtl = new anchor.BN(30); // 30 seconds max TTL

  it("Ciclo de Vida Completo do Stream (Initialize -> Consume -> Close)", async () => {
    // Inicializa o Bankrun com o programa compilado
    const context = await startAnchor(
        "C:/Users/nazaro/.gemini/antigravity/scratch/fluxblink/fluxblink_program", 
        [], 
        []
    );
    const provider = new BankrunProvider(context);
    anchor.setProvider(provider);

    const program = anchor.workspace.FluxblinkProgram as Program<FluxblinkProgram>;

    // Setup de Contas Token (Mockando no Bankrun)
    // No Bankrun, podemos injetar contas diretamente no ledger
    const viewerTokenAccount = Keypair.generate();
    const creatorTokenAccount = Keypair.generate();

    // Endereços PDA
    const [streamState] = PublicKey.findProgramAddressSync(
      [Buffer.from("stream"), viewer.publicKey.toBuffer(), streamId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [escrowVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), viewer.publicKey.toBuffer(), streamId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // 1. Inicializar Stream
    console.log("Iniciando Stream...");
    await program.methods
      .initializeStream(streamId, depositAmount, ratePerSecond, maxTtl)
      .accounts({
        viewer: viewer.publicKey,
        creator: creator.publicKey,
        authority: authority.publicKey,
        mint: mint.publicKey,
        viewerTokenAccount: viewerTokenAccount.publicKey,
        // @ts-ignore
        escrowVault: escrowVault,
        streamState: streamState,
      })
      .signers([viewer])
      .rpc();

    let state = await program.account.streamState.fetch(streamState);
    expect(state.totalDeposited.toString()).to.equal(depositAmount.toString());
    expect(state.isActive).to.be.true;
    console.log("✅ Stream Inicializado!");

    // 2. Consumir Stream
    console.log("Consumindo 10 segundos...");
    const secondsToConsume = new anchor.BN(10);
    const expectedCost = secondsToConsume.mul(ratePerSecond);

    await program.methods
      .consumeStream(secondsToConsume)
      .accounts({
        authority: authority.publicKey,
        streamState: streamState,
        // @ts-ignore
        escrowVault: escrowVault,
        creatorTokenAccount: creatorTokenAccount.publicKey,
      })
      .signers([authority])
      .rpc();

    state = await program.account.streamState.fetch(streamState);
    expect(state.totalConsumed.toString()).to.equal(expectedCost.toString());
    console.log("✅ Consumo registrado!");

    // 3. Fechar Stream
    console.log("Fechando Stream...");
    await program.methods
      .closeStream()
      .accounts({
        viewer: viewer.publicKey,
        streamState: streamState,
        // @ts-ignore
        escrowVault: escrowVault,
        viewerTokenAccount: viewerTokenAccount.publicKey,
      })
      .signers([viewer])
      .rpc();

    try {
      await program.account.streamState.fetch(streamState);
      expect.fail("A conta deveria ter sido fechada");
    } catch (e) {
      expect(e.message).to.contain("Account does not exist");
    }
    console.log("✅ Stream Encerrado e Contas Deletadas!");
  });
});
