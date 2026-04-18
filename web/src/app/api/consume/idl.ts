export const IDL = {
  "address": "47qsb1iDqWq3zyBNsnFAyNEsFtCJX7EWsrEAy1aaY9jt",
  "metadata": {
    "name": "fluxblink_program",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "FluxBlink: Pay-per-second streaming protocol"
  },
  "instructions": [
    {
      "name": "initializeStream",
      "discriminator": [118, 59, 14, 189, 78, 12, 102, 163],
      "accounts": [
        { "name": "viewer", "writable": true, "signer": true },
        { "name": "creator" },
        { "name": "authority" },
        { "name": "mint" },
        { "name": "viewerTokenAccount", "writable": true },
        { "name": "escrowVault", "writable": true },
        { "name": "streamState", "writable": true },
        { "name": "tokenProgram" },
        { "name": "systemProgram" }
      ],
      "args": [
        { "name": "streamId", "type": "u64" },
        { "name": "depositAmount", "type": "u64" },
        { "name": "ratePerSecond", "type": "u64" },
        { "name": "maxTtl", "type": "i64" }
      ]
    },
    {
      "name": "consumeStream",
      "discriminator": [189, 219, 137, 246, 203, 237, 193, 199],
      "accounts": [
        { "name": "authority", "signer": true },
        { "name": "streamState", "writable": true },
        { "name": "escrowVault", "writable": true },
        { "name": "creatorTokenAccount", "writable": true },
        { "name": "tokenProgram" }
      ],
      "args": [{ "name": "secondsConsumed", "type": "u64" }]
    },
    {
      "name": "closeStream",
      "discriminator": [15, 49, 114, 104, 17, 238, 201, 192],
      "accounts": [
        { "name": "viewer", "writable": true, "signer": true },
        { "name": "streamState", "writable": true },
        { "name": "escrowVault", "writable": true },
        { "name": "viewerTokenAccount", "writable": true },
        { "name": "tokenProgram" }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "streamState",
      "discriminator": [203, 14, 131, 222, 191, 155, 111, 241],
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "viewer", "type": "pubkey" },
          { "name": "creator", "type": "pubkey" },
          { "name": "authority", "type": "pubkey" },
          { "name": "mint", "type": "pubkey" },
          { "name": "escrowVault", "type": "pubkey" },
          { "name": "ratePerSecond", "type": "u64" },
          { "name": "totalDeposited", "type": "u64" },
          { "name": "totalConsumed", "type": "u64" },
          { "name": "lastConsumeTs", "type": "i64" },
          { "name": "createdAt", "type": "i64" },
          { "name": "isActive", "type": "bool" },
          { "name": "maxTtl", "type": "i64" },
          { "name": "streamId", "type": "u64" },
          { "name": "bump", "type": "u8" },
          { "name": "vaultBump", "type": "u8" }
        ]
      }
    }
  ]
};
