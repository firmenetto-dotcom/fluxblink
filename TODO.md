# 🎯 FluxBlink - Lista de Tarefas do Hackathon

Bem-vindo ao repositório do FluxBlink! Abaixo estão as tarefas divididas para focarmos e não perdermos tempo durante a competição.

## ✅ Concluído (Done) - O Que Já Foi Construído

**Frontend & Design (Next.js)**
- [x] Design System Base: Implementado um visual *Premium* (Glassmorphism, animações fluidas e paleta de cores escuras/vibrantes).
- [x] Componente do Player de Vídeo interativo com design moderno e integrado.
- [x] Rota base para os Blinks do Solana (`/api/actions/flux`) iniciada.
- [x] Apresentação: Layout base do Pitch Deck (`/pitch/page.tsx`) com os argumentos do Colosseum Copilot embutidos.

**Backend & Protocolo (Solana)**
- [x] Arquitetura definida: Estrutura do Smart Contract em Rust/Anchor criada.
- [x] Defesas Técnicas Mapeadas: Lógica base para o "TTL-based Kill-Switch" projetada.
- [x] Zk-Compression: Estrutura desenhada para ser *Zk-Compression ready* visando redução extrema de custos (Rent).

**DevOps & Workflow**
- [x] Repositório inicializado e sincronizado no GitHub (`firmenetto-dotcom`).
- [x] Configuração de `.gitignore` adequada para Next.js e Anchor.

---

## 🧑‍💻 Para Fazer (To Do)

### Frontend (UI/UX)
- [ ] **Integração Real-time**: Fazer o player de vídeo pausar e rodar dependendo do status do pagamento via websocket/RPC.
- [ ] **Solana Actions (Blinks)**: Terminar o código do `route.ts` para gerar a transação real de pagamento ao clicar no Blink no Twitter.

### Backend & Smart Contract
- [ ] **Contrato Anchor**: Codificar a lógica final do *Escrow* em `lib.rs` (distribuição proporcional do pagamento por tempo assistido).
- [ ] **Testes na Devnet**: Fazer o deploy do contrato na Devnet e testar o envio de tokens de teste.
- [ ] **Kill-Switch**: Implementar no contrato a regra que bloqueia o fluxo automaticamente após o TTL expirar.

### Apresentação & Marketing
- [ ] **Pitch Deck**: Adicionar capturas de tela finais da aplicação funcionando.
- [ ] **Vídeo Demo**: Gravar um fluxo completo de "Zero-Click Experience" usando o Twitter para o vídeo de 3 minutos.

---

## ⏳ Em Andamento (In Progress)
- [ ] Conexão Web3: Finalizando a ponte entre a interface (botão de "Pagar Stream") e o protocolo Solana usando `@solana/web3.js`.
