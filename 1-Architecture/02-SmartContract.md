# Smart Contract: FluxEscrow

## Visão Geral
O programa `fluxblink_program` gerencia o ciclo de vida completo de um pagamento por segundo. Ele usa 3 instruções:

```
initialize_stream → consume_stream (N vezes) → close_stream
```

## Contas (PDAs)

### `StreamState` (PDA)
- **Seeds:** `["stream", viewer_pubkey, stream_id_bytes]`
- Armazena o estado do stream: viewer, creator, autoridade do backend, mint, vault, taxa por segundo, total depositado, total consumido, timestamps, e se está ativo.

### `EscrowVault` (PDA Token Account)
- **Seeds:** `["vault", viewer_pubkey, stream_id_bytes]`
- Conta de token controlada pelo programa (PDA authority = a si mesma).
- Armazena os tokens do viewer até que sejam consumidos ou devolvidos.

## Instruções

### 1. `initialize_stream(stream_id, deposit_amount, rate_per_second)`
- **Quem chama:** O Viewer (conecta a carteira, assina a TX).
- **O que faz:**
  1. Cria a conta `StreamState` (PDA).
  2. Cria a conta `EscrowVault` (PDA Token Account).
  3. Transfere `deposit_amount` tokens da carteira do viewer para o vault.
- **Validações:** Depósito > 0, Taxa > 0, Taxa <= 1 USDC/seg.

### 2. `consume_stream(seconds_consumed)`
- **Quem chama:** O Backend (nossa API), usando a chave `authority`.
- **O que faz:**
  1. Calcula `custo = seconds_consumed * rate_per_second`.
  2. Transfere o custo do vault para a conta de token do criador.
  3. Se o saldo do vault acabar, o stream é desativado automaticamente.
- **Validações:** Stream ativo, Authority correta, Seconds > 0.

### 3. `close_stream()`
- **Quem chama:** O Viewer.
- **O que faz:**
  1. Transfere o saldo restante do vault de volta para o viewer.
  2. Fecha a conta `EscrowVault` (rent devolvido ao viewer em SOL).
  3. Fecha a conta `StreamState` (rent devolvido ao viewer em SOL).

## Fluxo Completo

```mermaid
sequenceDiagram
    participant V as "Viewer (Wallet)"
    participant API as "Backend (Authority)"
    participant SC as "Smart Contract"
    participant EV as "Escrow Vault (PDA)"
    participant C as Creator

    V->>SC: initialize_stream(id, 1_000_000, 100)
    Note over V, EV: 1 USDC depositado no Vault
    SC->>EV: Transfer 1_000_000 lamports

    loop A cada 5 segundos de vídeo
        API->>SC: consume_stream(5)
        SC->>EV: Debita 500 lamports (5s * 100/s)
        EV->>C: Transfer 500 lamports
    end

    V->>SC: close_stream()
    SC->>EV: Devolve saldo restante
    EV->>V: Transfer restante
    Note over SC: Contas fechadas, rent devolvido
```

## Erros Customizados
| Código | Nome | Descrição |
|---|---|---|
| 6000 | `ZeroDeposit` | Depósito deve ser > 0 |
| 6001 | `ZeroRate` | Taxa por segundo deve ser > 0 |
| 6002 | `RateTooHigh` | Taxa excede o máximo (1 USDC/seg) |
| 6003 | `StreamInactive` | Stream já foi encerrado |
| 6004 | `ZeroSeconds` | Segundos consumidos deve ser > 0 |
| 6005 | `MathOverflow` | Overflow aritmético |
| 6006 | `Unauthorized` | Signer não tem permissão |
| 6007 | `TokenOwnerMismatch` | Dono da token account incorreto |
| 6008 | `MintMismatch` | Mint incorreto |
| 6009 | `VaultMismatch` | Vault não corresponde ao stream |
