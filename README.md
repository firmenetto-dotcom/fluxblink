# FluxBlink ⚡

> **A Primeira Rede de Pagamentos Autônoma do Mundo Real.**

O **FluxBlink** é um protocolo DePIN no Solana que transforma a infraestrutura física (estacionamentos, recarga EV) em serviços autônomos e fluidos. Sem cancelas, sem maquininhas de cartão, e sem fricção.

*Desenvolvido para o Solana Frontier Hackathon.*

---

## 🛑 O Problema das Bandeiras (A Fricção Atual)
O mercado de estacionamentos e serviços rotativos físicos é refém do sistema financeiro tradicional (Mastercard, Visa, Elo):
1. **Taxas Abusivas (MDR):** Maquininhas cobram um valor fixo + porcentagem (ex: R$ 0,30 + 3%), o que inviabiliza o lucro em micro-paradas (como uma vaga de 15 minutos).
2. **Custo de Infraestrutura:** Cancelas mecânicas e tótens de pagamento são caros, quebram com frequência e causam filas.
3. **Dinheiro "Burro":** Enquanto a transação não é liquidada, o dinheiro do lojista não rende nada (D+1 ou D+30).

## 💡 A Solução: O "Estacionamento Invisível"
O FluxBlink elimina o hardware tradicional usando software baseado em Solana:

1. **Computer Vision + Solana Actions (Blinks):** Câmeras (IoT) identificam a placa do veículo na vaga. O protocolo dispara um **Blink** para o usuário (via push notification, Telegram ou web). O usuário clica e inicia um "stream de pagamento". Zero cliques extras.
2. **Pagamento por Segundo Real:** Usando canais de estado otimistas, o motorista paga *exatamente* pelo tempo que ficou. 12 minutos e 4 segundos? O Solana cobra perfeitamente, com frações de centavo de taxa de rede.
3. **Yield-Bearing Escrow (Ondo Finance RWA):** O dinheiro pré-pago no estacionamento não fica parado. O Smart Contract converte os dólares para **USDY (Títulos do Tesouro Americano via Ondo)**, gerando juros seguros. **O dono do estacionamento lucra com o tempo de parada + o rendimento do capital.**

---

## 🏗️ Arquitetura & Defesas Técnicas

O protocolo é blindado para operações do mundo real:

1. **Smart Contracts (Rust + Anchor):** Lógica de *Escrow* controlada via PDAs, garantindo confiança entre o motorista e o dono do pátio.
2. **TTL Kill-Switch (Proteção IoT):** Se o carro sair da vaga e o sensor (IoT) falhar em avisar a rede, o contrato possui um "Heartbeat" com *Time-To-Live*. Ao expirar, o fluxo de pagamento é cortado automaticamente, protegendo o saldo do usuário.
3. **Zk-Compression Ready:** Estrutura otimizada para escalar milhares de vagas na cidade sem inchar o estado da rede, reduzindo custos de *Rent* radicalmente.

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
Acesse `http://localhost:3000` para ver o Dashboard de Estacionamento ou interagir com o Blink.

---

## 🔮 Roadmap
* **Phase 1 (Hackathon MVP):** Protótipo do Smart Contract de Stream, Integração com Ondo Finance (US Treasuries), e Solana Actions para a vaga física.
* **Phase 2 (Visão Computacional):** Integração com APIs de reconhecimento de placas (ALPR) para o gatilho automático do Blink.
* **Phase 3 (Airbnb das Vagas):** Abertura do protocolo para vagas residenciais peer-to-peer.
