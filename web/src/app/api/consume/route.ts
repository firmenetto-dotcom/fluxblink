import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { IDL } from "./idl";

// Anchor discriminators from the IDL
const CONSUME_DISCRIMINATOR = Buffer.from(IDL.instructions[1].discriminator);

export async function POST(req: NextRequest) {
  try {
    const { streamId, seconds, viewerAddress } = await req.json();

    if (!streamId || !seconds || !viewerAddress) {
      return NextResponse.json({ error: "Missing parameters: streamId, seconds, viewerAddress required" }, { status: 400 });
    }

    if (seconds <= 0 || seconds > 3600) {
      return NextResponse.json({ error: "Invalid seconds value (must be 1-3600)" }, { status: 400 });
    }

    // --- Configuração da Autoridade (Backend) ---
    const authorityKeyStr = process.env.AUTHORITY_KEY;
    if (!authorityKeyStr) {
      return NextResponse.json({ error: "Server misconfigured: missing AUTHORITY_KEY" }, { status: 500 });
    }

    const authorityKey = JSON.parse(authorityKeyStr);
    const authority = Keypair.fromSecretKey(new Uint8Array(authorityKey));

    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC;
    const programIdStr = process.env.NEXT_PUBLIC_PROGRAM_ID;

    if (!rpcUrl || !programIdStr) {
      return NextResponse.json({ error: "Server misconfigured: missing RPC or PROGRAM_ID" }, { status: 500 });
    }

    const connection = new Connection(rpcUrl, "confirmed");
    const programId = new PublicKey(programIdStr);
    const viewerKey = new PublicKey(viewerAddress);

    // --- Converter streamId para buffer (u64 little-endian) ---
    const streamIdBuffer = Buffer.alloc(8);
    streamIdBuffer.writeBigUInt64LE(BigInt(streamId));

    // --- Encontrar PDAs ---
    const [streamState] = PublicKey.findProgramAddressSync(
      [Buffer.from("stream"), viewerKey.toBuffer(), streamIdBuffer],
      programId
    );

    const [escrowVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), viewerKey.toBuffer(), streamIdBuffer],
      programId
    );

    // --- Ler o estado do stream para obter o creatorTokenAccount ---
    const streamAccountInfo = await connection.getAccountInfo(streamState);

    if (!streamAccountInfo) {
      // Stream não existe na blockchain – retorna resposta simulada para MVP/demo
      console.warn(`Stream PDA ${streamState.toBase58()} not found on-chain. Returning simulated response for demo.`);
      return NextResponse.json({
        success: true,
        message: "Consumo registrado (demo mode – stream não encontrado on-chain)",
        signature: `demo_${Date.now()}`,
        mode: "simulated",
        details: {
          streamId,
          seconds,
          viewer: viewerAddress,
          streamPDA: streamState.toBase58(),
          escrowPDA: escrowVault.toBase58(),
        }
      });
    }

    // Parse o StreamState account (skip 8 byte discriminator)
    const data = streamAccountInfo.data;
    // StreamState layout (after 8-byte discriminator):
    // viewer: Pubkey (32)
    // creator: Pubkey (32)
    // authority: Pubkey (32)
    // mint: Pubkey (32)
    // escrow_vault: Pubkey (32)
    // rate_per_second: u64 (8)
    // total_deposited: u64 (8)
    // total_consumed: u64 (8)
    // last_consume_ts: i64 (8)
    // created_at: i64 (8)
    // is_active: bool (1)
    // stream_id: u64 (8)
    // bump: u8 (1)
    // vault_bump: u8 (1)
    
    const creatorPubkey = new PublicKey(data.subarray(8 + 32, 8 + 64)); // creator field
    const mintPubkey = new PublicKey(data.subarray(8 + 96, 8 + 128)); // mint field
    const isActive = data[8 + 32*5 + 8*5] === 1; // is_active offset

    if (!isActive) {
      return NextResponse.json({ error: "Stream is no longer active" }, { status: 400 });
    }

    // --- Encontrar o token account do creator para o mint correto ---
    // Para simplificar, usamos o Associated Token Account
    const { getAssociatedTokenAddress } = await import("@solana/spl-token");
    const creatorTokenAccount = await getAssociatedTokenAddress(mintPubkey, creatorPubkey);

    // --- Construir a instrução consume_stream ---
    const secondsBuffer = Buffer.alloc(8);
    secondsBuffer.writeBigUInt64LE(BigInt(seconds));

    const instructionData = Buffer.concat([
      CONSUME_DISCRIMINATOR,
      secondsBuffer,
    ]);

    const consumeIx = new TransactionInstruction({
      programId,
      keys: [
        { pubkey: authority.publicKey, isSigner: true, isWritable: false },
        { pubkey: streamState, isSigner: false, isWritable: true },
        { pubkey: escrowVault, isSigner: false, isWritable: true },
        { pubkey: creatorTokenAccount, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    // --- Enviar transação ---
    const tx = new Transaction().add(consumeIx);
    tx.feePayer = authority.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
    tx.sign(authority);

    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    // Aguardar confirmação
    await connection.confirmTransaction(signature, "confirmed");

    console.log(`✅ FluxBlink: Consumed ${seconds}s for stream ${streamId}. Tx: ${signature}`);

    return NextResponse.json({
      success: true,
      message: `${seconds} segundos consumidos com sucesso!`,
      signature,
      mode: "on-chain",
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });

  } catch (error: any) {
    console.error("Erro ao consumir stream:", error);

    // Se for um erro de programa Anchor, extrair a mensagem
    const anchorError = error?.logs?.find((log: string) => log.includes("FluxBlink:") || log.includes("Error"));

    return NextResponse.json({
      error: anchorError || error.message || "Unknown error",
      mode: "failed",
    }, { status: 500 });
  }
}
