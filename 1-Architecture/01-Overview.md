# Arquitetura: FluxBlink

## Conceito
O FluxBlink resolve o problema de monetização contínua usando a velocidade da Solana. Em vez de pagar um "pedágio" fixo para ver um vídeo em um Blink no X/Twitter, o usuário inicia um fluxo de tokens. O pagamento acontece por segundo consumido.

## Componentes

### 1. Smart Contract (Anchor) - `FluxEscrow`
*   **Estado:** Mantém os fundos de "pré-autorização".
*   **Lógica:** Aceita uma assinatura de uma autoridade (backend) atestando quantos segundos foram assistidos.
*   **Liquidação:** Transfere os fundos do escrow para o criador e devolve o troco para o usuário ao finalizar.

### 2. Frontend / Blinks API (Next.js)
*   **API `/api/actions/flux`**: Fornece o GET (metadados do Blink) e POST (construção da transação inicial de abertura do canal).
*   **Blink Custom UI**: Utiliza os componentes `@dialectic/blinks` para renderizar o player de vídeo.
*   **Telemetria:** Abre um WebSocket ou faz polling para um backend informando "O usuário X continua com o player aberto e reproduzindo".

### Fluxograma

```mermaid
sequenceDiagram
    participant User as "Usuário (Blink no Twitter)"
    participant API as "Next.js API (Backend)"
    participant Contract as "Smart Contract (Anchor)"

    User->>API: GET /api/actions/flux (Carrega o Blink)
    API-->>User: Retorna metadados (Imagem, Título, Botão "Assistir")
    User->>API: POST /api/actions/flux (Clica em Assistir)
    API-->>User: Retorna Transação (Travar 1 USDC no Escrow)
    User->>Contract: Assina TX (1 USDC vai para o Escrow)
    Contract-->>User: Escrow aberto
    Note over User, API: O Vídeo começa a tocar
    loop Cada 3 segundos
        User->>API: Ping (WebSocket) "Assistindo segundo 3..."
    end
    Note over User, API: Usuário pausa o vídeo no segundo 15
    API->>Contract: Executa fechamento (15s = 0.0015 USDC)
    Contract-->>User: Devolve 0.9985 USDC
```
