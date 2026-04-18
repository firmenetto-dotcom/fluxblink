# FluxBlink ⚡

> **A Economia da Atenção, Precificada por Segundo.**

O **FluxBlink** é um protocolo não-custodial no Solana que permite a transferência de valor em tempo real, proporcionalmente ao tempo de consumo de um serviço ou conteúdo. Sem assinaturas mensais tóxicas, sem intermediários prendendo capital.

*Desenvolvido para o Solana Frontier Hackathon.*

---

## 🛑 O Problema (A Fricção Atual)
1. **Ineficiência de Capital:** Modelos de *escrow* tradicionais travam o capital do usuário por períodos longos. 
2. **Assinaturas Tóxicas:** Usuários pagam $15/mês por serviços onde assistem apenas algumas horas de conteúdo.
3. **Barreiras de Entrada:** Forçar usuários a cadastros extensos apenas para acessar micro-conteúdos reduz a conversão em 68%.

## 💡 A Solução (The Wedge)
FluxBlink resolve isso focando em **Pagamentos de Consumo Imediato** através de três pilares:

*   **Blink-Native (Zero-Click Experience):** Não requer frontend próprio. Inicie um stream de pagamento diretamente de um tweet, Discord ou Telegram via *Solana Actions*.
*   **AI Agent Economy Ready:** Agentes de IA preferem pagar por segundo de execução (APIs) do que assinar planos fixos. O FluxBlink é a camada de pagamento B2B do futuro.
*   **Yield-Bearing Escrow (Kamino Finance):** O dinheiro não fica apenas parado esperando o streaming. Enquanto o saldo não consumido está no Escrow do FluxBlink, ele é automaticamente depositado no protocolo Kamino para gerar juros (Yield). Ele flui e rende até o milissegundo final.

---

## 🏗️ Arquitetura & Defesas Técnicas

O protocolo foi "blindado" contra os principais vetores de falha observados no ecossistema:

1. **Smart Contracts (Rust + Anchor):** Lógica de *Escrow* baseada em PDAs. Somente o criador pode sacar o valor proporcional ao tempo já consumido.
2. **TTL Kill-Switch (Proteção de Fundo):** Se a conexão do usuário cair e o *Heartbeat* parar, o Smart Contract bloqueia o fluxo automaticamente após o TTL (Time-To-Live), evitando "drenagem" acidental de fundos.
3. **Optimistic Sync:** Para combater a latência natural de RPCs e WebSockets, a UI simula o consumo de forma otimista, enquanto reconcilia com a rede Solana em lotes.
4. **Zk-Compression Ready:** Arquitetura preparada para integração com *Light Protocol / Zeak* para comprimir o estado das contas de stream, reduzindo o custo de *Rent* do Solana em até 100x.
5. **Kamino CPI Integration (DeFi):** Interação direta do Smart Contract (Cross-Program Invocation) com os Vaults do Kamino para rentabilizar automaticamente o capital não consumido no Escrow.

---

## 🚀 Como Rodar Localmente

**1. Smart Contract (Anchor)**
```bash
cd fluxblink_program
anchor build
anchor test
```

**2. Frontend & Blinks (Next.js)**
```bash
cd web
npm install
npm run dev
```
Acesse `http://localhost:3000` para ver a Landing Page ou interaja com o Blink de testes através de uma extensão compatível (ex: Phantom Dial).

---

## 🔮 Roadmap
* **Phase 1 (Hackathon MVP):** Smart Contract Base, Video Player UI, Blinks Integration.
* **Phase 2 (AI & B2B Expansion):** Integração com **Squads Multisig** para tesourarias empresariais e Session Keys.
* **Phase 3 (FluxBlink Network):** Storage permanente via Arweave e DRM descentralizado.
