# 🎬 Roteiro do Vídeo de Demonstração (Solana Frontier)

**Duração Alvo:** 2 minutos e 30 segundos.
**Tom:** Direto, Técnico e Focado em UX.

---

### 1. O Gancho (0:00 - 0:20)
*   **(Visual):** Tela dividida. De um lado, uma fatia de cartão de crédito mostrando várias cobranças de $15 (Netflix, Spotify, Substack). Do outro lado, o ícone de um relógio girando e dinheiro vazando.
*   **(Narrador/Voz):** "As assinaturas mensais estão mortas. Pagamos por meses inteiros de serviços que consumimos por apenas algumas horas. O capital fica preso. A barreira de entrada é alta."
*   **(Visual):** Logo do FluxBlink aparece brilhando.
*   **(Narrador):** "Apresentamos o FluxBlink: A economia da atenção, precificada por segundo no Solana."

### 2. A Mágica do UX / Solana Blinks (0:20 - 1:00)
*   **(Visual):** Gravação de tela do X (Twitter). O usuário rola o feed e vê um tweet com um *Solana Blink* embutido escrito "Aula Masterclass Exclusiva".
*   **(Narrador):** "A melhor UI é aquela que não existe. Com o FluxBlink, a integração é 100% Blink-Native. Sem redirecionamentos, sem cadastros."
*   **(Visual):** O usuário clica em "Depositar 1 USDC" direto no Tweet. A carteira Phantom aprova.
*   **(Visual):** O player de vídeo abre instantaneamente. No canto inferior, um contador mostra o saldo de USDC caindo milissegundo a milissegundo (0.9995... 0.9994...).
*   **(Narrador):** "O pagamento acontece em tempo real. O dinheiro flui da carteira do espectador para o criador, sem intermediários. E o melhor..."

### 3. Recuperação de Capital (1:00 - 1:20)
*   **(Visual):** O usuário clica no botão "Parar / Fechar". O vídeo para. Uma notificação da Phantom mostra "+0.60 USDC reembolsados".
*   **(Narrador):** "...você só paga pelo que consome. O usuário clica em fechar e o Smart Contract devolve o saldo restante instantaneamente."

### 4. Deep Dive Técnico / Defesas (1:20 - 2:00)
*   **(Visual):** Um diagrama animado aparecendo na tela. Mostra: *Viewer -> Escrow PDA -> Creator*.
*   **(Narrador):** "Mas e se a internet cair? Como garantimos a segurança?"
*   **(Visual):** Zoom no termo *TTL Kill-Switch*.
*   **(Narrador):** "Nosso Smart Contract em Rust/Anchor implementa um 'TTL Kill-Switch' on-chain. Se o frontend parar de enviar *heartbeats*, o fluxo congela na hora. Zero risco de drenagem de fundos."
*   **(Visual):** Ícone de Zk-Compression.
*   **(Narrador):** "E para garantir escalabilidade para micro-pagamentos, nossa arquitetura está sendo preparada para *ZkCompression*, reduzindo o custo do estado no Solana em até 100 vezes."

### 5. O Futuro e Fechamento (2:00 - 2:30)
*   **(Visual):** Mostra um terminal com uma IA (ChatGPT/Cursor) fazendo queries em uma API.
*   **(Narrador):** "O streaming de valor não é apenas para vídeos. É a infraestrutura ideal para a *AI Agent Economy*, onde agentes de IA pagam uns aos outros por tempo de processamento via APIs."
*   **(Visual):** Tela final com QR Code, Logo do FluxBlink, Github Link.
*   **(Narrador):** "FluxBlink. Construído para o Solana Frontier. Obrigado."
