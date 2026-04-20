"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, ShieldCheck, ArrowRight, Globe, Cpu, ChevronLeft, ChevronRight, Sparkles, TrendingUp, DollarSign, Lock, Code2, Car, Camera, QrCode, CreditCard } from 'lucide-react';

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      setIsAnimating(false);
    }, 100);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
      setIsAnimating(false);
    }, 100);
  }, [isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slides = [
    // ═══ SLIDE 1: COVER ═══
    (
      <div key="cover" className="flex flex-col items-center justify-center h-full text-center space-y-8">
        <div className="animate-fade-in-scale">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 mx-auto mb-8 animate-float">
            <Car className="w-14 h-14 text-white fill-current" />
          </div>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter font-[family-name:var(--font-display)] animate-fade-in-up">
          FLUX<span className="gradient-text">PARK</span>
        </h1>
        <p className="text-2xl md:text-3xl font-medium text-[var(--text-secondary)] max-w-3xl animate-fade-in-up stagger-2">
          A Primeira Rede de Pagamentos{' '}
          <span className="text-white font-bold">Autônoma do Mundo Real.</span>
        </p>
        <div className="pt-8 animate-fade-in-up stagger-3">
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass text-cyan-400 text-sm font-bold tracking-[0.15em] uppercase">
            <Sparkles className="w-4 h-4" />
            Solana Frontier Hackathon
          </div>
        </div>
      </div>
    ),

    // ═══ SLIDE 2: PROBLEM ═══
    (
      <div key="problem" className="flex flex-col justify-center h-full max-w-6xl mx-auto space-y-10">
        <div className="animate-fade-in">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-red-400 mb-3">O Problema</p>
          <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            A Ditadura das <span className="gradient-text-warm">Bandeiras</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <CreditCard className="w-7 h-7 text-red-400" />,
              title: "Taxas Abusivas (MDR)",
              desc: "Maquininhas cobram taxas fixas mais uma porcentagem. Inviabiliza completamente o lucro em micro-paradas (ex: vagas de 15 minutos).",
              stat: "5%",
              statLabel: "perdido em taxas por transação"
            },
            {
              icon: <Lock className="w-7 h-7 text-orange-400" />,
              title: "Custo de Infraestrutura",
              desc: "O modelo atual depende de tótens de pagamento e cancelas mecânicas que quebram, exigem manutenção e geram longas filas.",
              stat: "$5k+",
              statLabel: "custo inicial de hardware"
            },
            {
              icon: <TrendingUp className="w-7 h-7 text-amber-400" />,
              title: "Dinheiro 'Burro'",
              desc: "Com cartões tradicionais, o capital não rende nada até ser liquidado em D+1 ou D+30. O lojista perde o custo de oportunidade.",
              stat: "Zero",
              statLabel: "rendimento enquanto processa"
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl bg-red-500/[0.03] border border-red-500/10 hover:border-red-500/25 transition-all duration-500 animate-fade-in-up group"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-[family-name:var(--font-display)]">{item.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">{item.desc}</p>
              <div className="pt-4 border-t border-red-500/10">
                <span className="text-2xl font-bold text-red-400 font-[family-name:var(--font-mono)]">{item.stat}</span>
                <span className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-1">{item.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    // ═══ SLIDE 3: SOLUTION ═══
    (
      <div key="solution" className="flex flex-col justify-center h-full max-w-6xl mx-auto space-y-10">
        <div className="animate-fade-in">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-400 mb-3">A Solução</p>
          <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            Estacionamento <span className="gradient-text">Invisível</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-slide-left">
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              Substituímos todo o hardware por <span className="text-white font-semibold">software on-chain</span>. O pagamento flui em tempo real, sem intermediários.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Camera className="text-blue-400 w-5 h-5" />, text: "Computer Vision (ALPR) elimina cancelas" },
                { icon: <QrCode className="text-cyan-400 w-5 h-5" />, text: "Blinks via push para pagamento Zero-Click" },
                { icon: <TrendingUp className="text-emerald-400 w-5 h-5" />, text: "Escrow Yield-Bearing no Kamino Finance" },
                { icon: <Zap className="text-amber-400 w-5 h-5" />, text: "Frações de centavo por transação na Solana" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg text-[var(--text-secondary)] animate-fade-in-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-slide-right">
            <div className="aspect-[4/3] rounded-2xl glass-card p-8 relative overflow-hidden flex flex-col items-center justify-center">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 blur-[60px] rounded-full animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-500/30 blur-[60px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
              </div>
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-6xl md:text-7xl font-bold font-[family-name:var(--font-mono)] text-emerald-400 mb-2 tabular-nums">
                  +12.4%
                </div>
                <div className="text-2xl text-[var(--text-muted)] font-[family-name:var(--font-mono)]">APY Kamino Yield</div>
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  O dinheiro rende enquanto o carro estaciona
                </div>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-[family-name:var(--font-mono)] text-emerald-400">Juros Gerados ao Vivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // ═══ SLIDE 4: ARCHITECTURE ═══
    (
      <div key="arch" className="flex flex-col justify-center h-full max-w-6xl mx-auto space-y-10">
        <div className="animate-fade-in">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-3">Arquitetura</p>
          <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            Stack <span className="gradient-text">Técnico (DePIN)</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-7 rounded-2xl animate-fade-in-up stagger-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Smart Contract (Rust)</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">
              Escrow PDA com <span className="text-white font-bold">TTL Kill-Switch</span>. Se o sensor (IoT) perder a conexão, o contrato corta o pagamento automaticamente após o tempo expirar.
            </p>
            <div className="bg-black/40 p-4 rounded-xl font-[family-name:var(--font-mono)] text-xs border border-white/5 overflow-x-auto">
              <span className="text-blue-400">start_parking</span>
              <span className="text-[var(--text-muted)]">()</span>
              <span className="text-[var(--text-muted)]"> → </span>
              <span className="text-emerald-400">cpi_kamino_deposit</span>
              <span className="text-[var(--text-muted)]">()</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Anchor', 'PDA', 'CPI', 'Yield'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>

          <div className="glass-card p-7 rounded-2xl animate-fade-in-up stagger-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Fronteira IoT & Actions</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">
              A câmera lê a placa e dispara uma Solana Action (Blink). O motorista paga em 1 clique pela web, enviando heartbeats (pulsos) de presença na vaga.
            </p>
            <div className="bg-black/40 p-4 rounded-xl font-[family-name:var(--font-mono)] text-xs border border-white/5">
              <span className="text-cyan-400">ALPR Camera</span>
              <span className="text-[var(--text-muted)]"> + </span>
              <span className="text-blue-400">Solana Blinks</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Blinks', 'IoT', 'WebSockets', 'Zk-Compression'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="glass p-6 rounded-2xl animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between text-center px-4">
            {[
              { label: 'Câmera IoT', icon: <Camera className="w-5 h-5 text-blue-400" />, sub: 'Identifica Placa' },
              { label: 'Motorista', icon: <QrCode className="w-5 h-5 text-cyan-400" />, sub: 'Aceita o Blink' },
              { label: 'Escrow + Kamino', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, sub: 'Gera Juros' },
              { label: 'Gestor (DePIN)', icon: <DollarSign className="w-5 h-5 text-amber-400" />, sub: 'Recebe Taxa + Yield' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ArrowRight className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{item.sub}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    ),

    // ═══ SLIDE 5: ROADMAP ═══
    (
      <div key="roadmap" className="flex flex-col justify-center h-full max-w-6xl mx-auto space-y-10">
        <div className="animate-fade-in">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400 mb-3">Roadmap</p>
          <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            Escalando o <span className="gradient-text">FluxPark</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              phase: "Phase 1",
              title: "Hackathon MVP",
              desc: "Smart Contract com Escrow por tempo, UI do Gestor e integração com Solana Blinks.",
              items: ["Smart Contract ✅", "DePIN Dashboard ✅", "Blinks Actions"],
              color: "blue",
              active: true,
            },
            {
              phase: "Phase 2",
              title: "Computer Vision Integration",
              desc: "Deploy de algoritmos ALPR (leitura de placas) em câmeras IoT baratas (Raspberry Pi).",
              items: ["ALPR Engine", "IoT Hardware Sync", "Kamino CPI"],
              color: "cyan",
              active: false,
            },
            {
              phase: "Phase 3",
              title: "O Airbnb das Vagas (P2P)",
              desc: "Permitir que usuários comuns monetizem suas garagens vazias na rede FluxPark.",
              items: ["Rede P2P", "Dynamic Pricing", "Token Rewards"],
              color: "emerald",
              active: false,
            }
          ].map((phase, i) => (
            <div
              key={i}
              className={`p-7 rounded-2xl border transition-all duration-500 animate-fade-in-up ${
                phase.active
                  ? 'glass-card border-blue-500/30 shadow-lg shadow-blue-500/5'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              {phase.active && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Atual
                </div>
              )}
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${
                phase.active ? 'text-blue-400' : 'text-[var(--text-muted)]'
              }`}>{phase.phase}</p>
              <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-display)]">{phase.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">{phase.desc}</p>
              <ul className="space-y-2">
                {phase.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <div className={`w-1 h-1 rounded-full ${
                      phase.active ? `bg-${phase.color}-400` : 'bg-[var(--text-muted)]'
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center pt-6 animate-fade-in-up stagger-4">
          <p className="text-[var(--text-secondary)] text-lg mb-6">
            Junte-se à revolução DePIN e{' '}
            <span className="text-white font-bold">elimine as maquininhas de vez.</span>
          </p>
          <button className="btn-primary px-10 py-4 rounded-2xl font-bold text-base">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Explorar o Protocolo
            </span>
          </button>
        </div>
      </div>
    )
  ];

  return (
    <div className="h-screen w-screen bg-[var(--bg-primary)] text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-blue-600/[0.06] blur-[150px] rounded-full mix-blend-screen transform -translate-x-1/3 -translate-y-1/3 animate-float" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-cyan-600/[0.06] blur-[150px] rounded-full mix-blend-screen transform translate-x-1/3 translate-y-1/3 animate-float" style={{ animationDelay: '-3s' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 z-50">
        <div
          className="h-full transition-all duration-500 ease-out rounded-r-full"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)',
          }}
        />
      </div>

      {/* Slide Indicators */}
      <div className="absolute top-8 right-12 z-50 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > currentSlide ? 'next' : 'prev'); setCurrentSlide(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-gradient-to-r from-blue-500 to-cyan-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        key={currentSlide}
        className="relative z-10 h-full w-full px-8 md:px-16 py-12 flex items-center justify-center animate-fade-in"
      >
        {slides[currentSlide]}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-12 z-50 flex items-center gap-4">
        <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs mr-4">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3.5 rounded-full glass hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3.5 rounded-full btn-primary disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-12 z-50 flex items-center gap-2.5">
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Car className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold tracking-tight text-sm font-[family-name:var(--font-display)] text-[var(--text-secondary)]">
            FluxPark (Pitch)
          </span>
        </a>
      </div>
    </div>
  );
}
