# 🎯 FluxBlink - Lista de Tarefas do Hackathon (Pivot: DePIN/Estacionamento)

Bem-vindo ao repositório do FluxBlink! Pivotamos nossa solução para focar em **Infraestrutura do Mundo Real (DePIN)**, mirando especificamente em estacionamentos autônomos para bater de frente com as taxas de maquininhas de cartão.

## ✅ Concluído (Done) - O Que Já Foi Construído

**Frontend & Design (Next.js)**
- [x] Design System Base: Implementado um visual *Premium* (Glassmorphism, animações fluidas e paleta de cores escuras/vibrantes).
- [x] Rota base para os Blinks do Solana (`/api/actions/flux`) iniciada.
- [x] Apresentação: Layout base do Pitch Deck (`/pitch/page.tsx`).

**Backend & Protocolo (Solana)**
- [x] Arquitetura definida: Estrutura do Smart Contract em Rust/Anchor criada.
- [x] Defesas Técnicas Mapeadas: Lógica base para o "TTL-based Kill-Switch" projetada.
- [x] Zk-Compression: Estrutura desenhada para redução de custos (Rent).

**DevOps & Workflow**
- [x] Repositório inicializado e sincronizado no GitHub (`firmenetto-dotcom`).
- [x] Configuração de `.gitignore` adequada para Next.js e Anchor.

---

## 🧑‍💻 Para Fazer (To Do) - Foco no Novo Pitch

### Frontend (UI/UX) - Estacionamento
- [x] **Dashboard do "Estacionamento Invisível"**: Modificar a landing page para mostrar um painel de vagas em tempo real, onde as vagas "ocupadas" mostram o saldo fluindo em USDC.
- [ ] **Solana Actions (Blinks) da Vaga**: Atualizar o código do `route.ts` para que o Blink simule o pagamento de uma vaga específica (ex: "Vaga A-12 - $0.05 / minuto").

### Backend & Smart Contract (IoT & Yield)
- [ ] **Integração Kamino (A Arma contra a Mastercard)**: Fazer um CPI no contrato para depositar os fundos no Kamino Finance e gerar Yield enquanto o carro está estacionado.
- [ ] **Lógica do Escrow**: Ajustar `lib.rs` para liberar fundos ao dono do estacionamento baseado nos minutos consumidos.
- [ ] **Testes na Devnet**: Fazer deploy do contrato e simulação de uma "entrada de carro".
- [ ] **Kill-Switch**: Implementar regra de bloqueio se o pulso (IoT da câmera) parar, expirando o TTL.

### Apresentação & Marketing
- [x] **Pitch Deck (Guerra às Bandeiras)**: Atualizar textos em `/pitch/page.tsx` para destacar a economia contra as taxas de 2-5% da Mastercard/Elo.
- [ ] **Vídeo Demo**: Mostrar a experiência zero-click (motorista clica no Blink simulando que escaneou um QR na vaga, o dashboard acende indicando início do fluxo).

---

## ⏳ Em Andamento (In Progress)
- [x] Refatoração da Visão (Pivot 100% focado em DePIN finalizado no README).
- [ ] Conexão Web3 na interface para interagir com o fluxo da vaga.
