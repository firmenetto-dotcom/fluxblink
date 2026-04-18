import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || "47qsb1iDqWq3zyBNsnFAyNEsFtCJX7EWsrEAy1aaY9jt");
const AUTHORITY = new PublicKey("36b7b821b986b5be2b7b370ee9deb091.placeholder"); // Derive from AUTHORITY_KEY at runtime
const USDC_MINT = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

// Anchor discriminator for initialize_stream
const INIT_DISCRIMINATOR = Buffer.from([118, 59, 14, 189, 78, 12, 102, 163]);

// Default stream parameters
const DEFAULT_DEPOSIT = BigInt(1_000_000); // 1 USDC (6 decimals)
const DEFAULT_RATE = BigInt(100);          // 100 microlamports/sec
const DEFAULT_MAX_TTL = BigInt(30);        // 30 seconds max TTL
const DEFAULT_CREATOR = new PublicKey("47qsb1iDqWq3zyBNsnFAyNEsFtCJX7EWsrEAy1aaY9jt");

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "⚡ FluxBlink: Pay-per-Second Streaming",
    icon: "https://ucarecdn.com/7492984a-7164-4bf8-8ec1-a95f00e5726e/fluxblink_logo.png",
    description: "Assista conteúdos premium pagando apenas pelo tempo que você consome. Deposite USDC para abrir um canal de streaming em tempo real na Solana.",
    label: "Depositar 1 USDC",
    links: {
      actions: [
        {
          label: "Depositar 1 USDC",
          href: "/api/actions/flux?amount=1000000",
          type: "transaction",
        },
        {
          label: "Depositar 5 USDC",
          href: "/api/actions/flux?amount=5000000",
          type: "transaction",
        },
      ],
    },
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const amountParam = url.searchParams.get("amount");
    const depositAmount = amountParam ? BigInt(amountParam) : DEFAULT_DEPOSIT;

    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");

    // Gerar um stream ID único baseado no timestamp
    const streamId = BigInt(Date.now());
    const streamIdBuffer = Buffer.alloc(8);
    streamIdBuffer.writeBigUInt64LE(streamId);

    // Derivar a authority key do env
    let authorityPubkey: PublicKey;
    try {
      const authorityKeyStr = process.env.AUTHORITY_KEY;
      if (authorityKeyStr) {
        const { Keypair } = await import("@solana/web3.js");
        const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(authorityKeyStr)));
        authorityPubkey = kp.publicKey;
      } else {
        authorityPubkey = DEFAULT_CREATOR; // fallback
      }
    } catch {
      authorityPubkey = DEFAULT_CREATOR;
    }

    // Encontrar PDAs
    const [streamState] = PublicKey.findProgramAddressSync(
      [Buffer.from("stream"), account.toBuffer(), streamIdBuffer],
      PROGRAM_ID
    );

    const [escrowVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), account.toBuffer(), streamIdBuffer],
      PROGRAM_ID
    );

    // Viewer's ATA for USDC
    const viewerTokenAccount = await getAssociatedTokenAddress(USDC_MINT, account);

    // Construir dados da instrução initialize_stream
    const depositBuffer = Buffer.alloc(8);
    depositBuffer.writeBigUInt64LE(depositAmount);

    const rateBuffer = Buffer.alloc(8);
    rateBuffer.writeBigUInt64LE(DEFAULT_RATE);

    const ttlBuffer = Buffer.alloc(8);
    ttlBuffer.writeBigInt64LE(DEFAULT_MAX_TTL);

    const instructionData = Buffer.concat([
      INIT_DISCRIMINATOR,
      streamIdBuffer,
      depositBuffer,
      rateBuffer,
      ttlBuffer,
    ]);

    // Construir instrução
    const initStreamIx = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: account, isSigner: true, isWritable: true },           // viewer
        { pubkey: DEFAULT_CREATOR, isSigner: false, isWritable: false },  // creator
        { pubkey: authorityPubkey, isSigner: false, isWritable: false },  // authority
        { pubkey: USDC_MINT, isSigner: false, isWritable: false },        // mint
        { pubkey: viewerTokenAccount, isSigner: false, isWritable: true },// viewerTokenAccount
        { pubkey: escrowVault, isSigner: false, isWritable: true },       // escrowVault
        { pubkey: streamState, isSigner: false, isWritable: true },       // streamState
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // tokenProgram
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // systemProgram
      ],
      data: instructionData,
    });

    const transaction = new Transaction().add(initStreamIx);
    transaction.feePayer = account;
    transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Canal FluxBlink Inicializado! Stream #${streamId} — Depósito de ${Number(depositAmount) / 1_000_000} USDC`,
        type: "transaction",
      },
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err: any) {
    console.error("Blinks Action error:", err);
    return Response.json(
      { message: err?.message || "An unknown error occurred" },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};
