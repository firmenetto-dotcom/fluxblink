# DevLog: Dia 01 (17/04/2026)

## O que foi feito hoje
- Definida a ideia do projeto **FluxBlink** (Pagamento por segundo em Blinks).
- Criada a estrutura do Obsidian para gerenciar o conhecimento.
- Estabelecido o plano de execução para os próximos 24 dias do hackathon da Colosseum.

## Decisões Técnicas
- **Moeda Base:** Decidimos iniciar a arquitetura pensando em **USDC** (stablecoin), pois pagamentos de fração de centavo por tempo consumido fazem mais sentido sem a volatilidade do token nativo da rede, facilitando a adesão de criadores e usuários.
- **Canal de Pagamento (State Channel vs Escrow):** Para simplificar e manter a segurança on-chain, o usuário depositará uma quantia pré-paga no contrato (Escrow) e o backend assinará a transação de fechamento consumindo apenas o equivalente aos segundos assistidos.

- Configurar o ambiente do `anchor` localmente. (Concluído)
- Configurar o projeto Next.js com as bibliotecas do Solana Actions. (Concluído)
- Criado o Smart Contract base `FluxEscrow` em Rust/Anchor.
- Desenvolvido o primeiro endpoint de Solana Action em `/api/actions/flux`.

## Próximos Passos
- Finalizar o build do Smart Contract e fazer o deploy na Devnet.
- Implementar o Video Player que integra com os micropagamentos.

