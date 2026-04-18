"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, AlertTriangle, ShieldCheck, ArrowRight, Globe, Cpu, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users, Clock, DollarSign, Lock, Code2 } from 'lucide-react';

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
          <div className="w-28 h-28 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 mx-auto mb-8 animate-float">
            <Zap className="w-14 h-14 text-white fill-current" />
          </div>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter font-[family-name:var(--font-display)] animate-fade-in-up">
          FLUX<span className="gradient-text">BLINK</span>
        </h1>
        <p className="text-2xl md:text-3xl font-medium text-[var(--text-secondary)] max-w-3xl animate-fade-in-up stagger-2">
          A Economia da Atenção,{' '}
          <span className="text-white font-bold">Precificada por Segundo.</span>
        </p>
        <div className="pt-8 animate-fade-in-up stagger-3">
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass text-blue-400 text-sm font-bold tracking-[0.15em] uppercase">
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
            A Fricção <span className="gradient-text-warm">Atual</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <DollarSign className="w-7 h-7 text-red-400" />,
              title: "Assinaturas Tóxicas",
              desc: "Usuários pagam $15/mês por serviços onde assistem apenas algumas horas de conteúdo. Modelo ineficiente para todos.",
              stat: "$180/ano",
              statLabel: "gasto médio desperdiçado"
            },
            {
              icon: <Lock className="w-7 h-7 text-orange-400" />,
              title: "Barreiras de Pagamento",
              desc: "Criadores não conseguem monetizar pequenos vídeos sem forçar os usuários a longos cadastros de cartão de crédito.",
              stat: "68%",
              statLabel: "abandono no checkout"
            },
            {
              icon: <Clock className="w-7 h-7 text-amber-400" />,
              title: "Ineficiência de Capital",
              desc: "Modelos de escrow tradicionais travam o capital. No streaming, o dinheiro rende na carteira do usuário até o segundo da transferência.",
              stat: "100%",
              statLabel: "de capital flutuante otimizado"
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400 mb-3">A Solução</p>
          <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            Conheça o <span className="gradient-text">FluxBlink</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-slide-left">
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
              Um protocolo <span className="text-white font-semibold">não-custodial</span> na Solana que permite a transferência de valor de forma diretamente proporcional ao tempo consumido.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Zap className="text-blue-400 w-5 h-5" />, text: "Pagamento real-time por segundo" },
                { icon: <Globe className="text-cyan-400 w-5 h-5" />, text: "Integração Nativa via Solana Blinks" },
                { icon: <Cpu className="text-purple-400 w-5 h-5" />, text: "Ideal para AI Agent Economy" },
                { icon: <ShieldCheck className="text-emerald-400 w-5 h-5" />, text: "Audit-Ready & 100% Trustless" },
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
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/30 blur-[60px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
              </div>
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-6xl md:text-7xl font-bold font-[family-name:var(--font-mono)] text-emerald-400 mb-2 tabular-nums">
                  0.9995
                </div>
                <div className="text-2xl text-[var(--text-muted)] font-[family-name:var(--font-mono)]">USDC</div>
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Saldo Atualizando em Tempo Real
                </div>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-[family-name:var(--font-mono)] text-emerald-400">LIVE</span>
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
            Stack <span className="gradient-text">Técnico</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-7 rounded-2xl animate-fade-in-up stagger-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Smart Contract</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">
              Lógica de Escrow com PDAs (Program Derived Addresses) garantindo que os fundos só possam ser sacados pelo criador proporcionalmente ao consumo.
            </p>
            <div className="bg-black/40 p-4 rounded-xl font-[family-name:var(--font-mono)] text-xs border border-white/5 overflow-x-auto">
              <span className="text-purple-400">initialize_stream</span>
              <span className="text-[var(--text-muted)]">()</span>
              <span className="text-[var(--text-muted)]"> → </span>
              <span className="text-blue-400">consume_stream</span>
              <span className="text-[var(--text-muted)]">()</span>
              <span className="text-[var(--text-muted)]"> → </span>
              <span className="text-emerald-400">close_stream</span>
              <span className="text-[var(--text-muted)]">()</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Rust', 'Anchor', 'SPL Token', 'PDA'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>

          <div className="glass-card p-7 rounded-2xl animate-fade-in-up stagger-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Frontend & Sync</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">
              Next.js App Router simulando consumo em tempo real no cliente e enviando &quot;heartbeats&quot; via RPC para registrar o consumo na Solana em lotes.
            </p>
            <div className="bg-black/40 p-4 rounded-xl font-[family-name:var(--font-mono)] text-xs border border-white/5">
              <span className="text-blue-400">@solana/web3.js</span>
              <span className="text-[var(--text-muted)]"> + </span>
              <span className="text-cyan-400">Solana Actions</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Next.js', 'TypeScript', 'Blinks', 'RPC'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="glass p-6 rounded-2xl animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between text-center">
            {[
              { label: 'Viewer', icon: <Users className="w-5 h-5 text-purple-400" />, sub: 'Deposita USDC' },
              { label: 'Escrow PDA', icon: <Lock className="w-5 h-5 text-blue-400" />, sub: 'Segura fundos' },
              { label: 'Backend', icon: <Cpu className="w-5 h-5 text-cyan-400" />, sub: 'Valida tempo' },
              { label: 'Creator', icon: <DollarSign className="w-5 h-5 text-emerald-400" />, sub: 'Recebe USDC' },
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-3">Roadmap</p>
          <h2 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            O Futuro do <span className="gradient-text">FluxBlink</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              phase: "Phase 1",
              title: "Hackathon MVP",
              desc: "Contrato inteligente base, UI premium e API de sincronização.",
              items: ["Smart Contract ✅", "Video Player ✅", "Blinks Integration"],
              color: "purple",
              active: true,
            },
            {
              phase: "Phase 2",
              title: "AI & B2B Expansion",
              desc: "Uso de Session Keys e integração com Squads Multisig para tesourarias empresariais.",
              items: ["Squads Integration", "Session Keys", "AI Agent SDK"],
              color: "blue",
              active: false,
            },
            {
              phase: "Phase 3",
              title: "FluxBlink Network",
              desc: "Protocolo agnóstico de conteúdo com storage via Arweave e DRM descentralizado.",
              items: ["Arweave Native", "Governance Token", "Creator Dashboard"],
              color: "cyan",
              active: false,
            }
          ].map((phase, i) => (
            <div
              key={i}
              className={`p-7 rounded-2xl border transition-all duration-500 animate-fade-in-up ${
                phase.active
                  ? 'glass-card border-purple-500/30 shadow-lg shadow-purple-500/5'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              {phase.active && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Atual
                </div>
              )}
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${
                phase.active ? 'text-purple-400' : 'text-[var(--text-muted)]'
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
            Pronto para conhecer o protocolo que vai{' '}
            <span className="text-white font-bold">redefinir o streaming?</span>
          </p>
          <button className="btn-primary px-10 py-4 rounded-2xl font-bold text-base">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Explorar o FluxBlink
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
        <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-600/[0.06] blur-[150px] rounded-full mix-blend-screen transform -translate-x-1/3 -translate-y-1/3 animate-float" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-600/[0.06] blur-[150px] rounded-full mix-blend-screen transform translate-x-1/3 translate-y-1/3 animate-float" style={{ animationDelay: '-3s' }} />
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
            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)',
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
              i === currentSlide ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
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
          className="p-3.5 rounded-full btn-primary disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-12 z-50 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="font-bold tracking-tight text-sm font-[family-name:var(--font-display)] text-[var(--text-secondary)]">
          FluxBlink
        </span>
      </div>
    </div>
  );
}
