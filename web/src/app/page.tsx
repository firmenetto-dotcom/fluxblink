"use client";

import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { Zap, Shield, Globe, Cpu, ChevronRight, DollarSign, Users, Activity, ArrowUpRight, Sparkles } from 'lucide-react';

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 2000, suffix = '') {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref, suffix };
}

/* ── Floating orbs background ── */
function OrbField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary glow */}
      <div className="absolute -top-[30%] -left-[15%] w-[700px] h-[700px] rounded-full bg-purple-600/[0.07] blur-[150px] animate-float" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.08] blur-[130px] animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[120px] animate-float" style={{ animationDelay: '-4s' }} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: string }) {
  return (
    <div
      className="glass-card p-8 rounded-2xl group animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <p className="text-[var(--text-muted)] text-xs uppercase tracking-[0.15em] font-semibold mb-2">{label}</p>
      <p className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">{value}</p>
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: string }) {
  return (
    <div
      className="glass-card p-8 rounded-2xl group cursor-default animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-display)]">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Saiba mais <ArrowUpRight className="w-3 h-3" />
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-white overflow-x-hidden relative">
      <OrbField />

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-5 max-w-[1400px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 group-hover:rotate-12 transition-all duration-500">
            <Zap className="w-5 h-5 fill-current" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />
          </div>
          <span className="text-xl font-extrabold tracking-tight font-[family-name:var(--font-display)]">
            FLUX<span className="text-blue-400">BLINK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#" className="hover:text-white transition-colors duration-300 relative group/link">
              Protocol
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover/link:w-full transition-all duration-300" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 relative group/link">
              Developers
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover/link:w-full transition-all duration-300" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 relative group/link">
              Governance
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover/link:w-full transition-all duration-300" />
            </a>
          </div>
          <button className="btn-primary px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2">
            <span>Launch App</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-16 md:pt-24 pb-20 px-4 max-w-[1400px] mx-auto">
        <div className="text-center mb-20 space-y-6">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass text-xs font-bold tracking-[0.15em] uppercase text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Solana Frontier Hackathon
          </div>

          {/* Title */}
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] max-w-5xl mx-auto font-[family-name:var(--font-display)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            STREAMING{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text animate-gradient inline-block">
              PAY-PER-SECOND
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            O futuro da monetização de conteúdo chegou. Sem assinaturas, sem intermediários.
            Pague apenas pelo que você assiste, direto no seu browser via Blinks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-base">
              <Sparkles className="w-5 h-5" />
              <span>Começar a Assistir</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 glass rounded-2xl font-bold transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 text-base">
              Sou Criador
            </button>
          </div>
        </div>

        {/* ── Video Player ── */}
        <div className="relative group mb-32 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
          {/* Outer glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-500/30 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700" />
          <VideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            ratePerSecond={100}
          />
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <StatCard
            icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
            label="Total Pago a Criadores"
            value="142,500 USDC"
            delay="0.1s"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-400" />}
            label="Visualizações Ativas"
            value="1,204"
            delay="0.2s"
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-purple-400" />}
            label="Transações por Segundo"
            value="65,000+"
            delay="0.3s"
          />
        </div>

        {/* ── Feature Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Shield className="w-7 h-7 text-purple-400" />}
            title="TTL Kill-Switch"
            desc="Proteção contra quedas de internet. O stream é bloqueado on-chain automaticamente se o heartbeat falhar."
            delay="0.1s"
          />
          <FeatureCard
            icon={<Cpu className="w-7 h-7 text-blue-400" />}
            title="Optimistic Sync"
            desc="Interface fluida com reconciliação on-chain em lote, anulando problemas de latência de RPC e WebSockets."
            delay="0.2s"
          />
          <FeatureCard
            icon={<Globe className="w-7 h-7 text-emerald-400" />}
            title="Blink-Native"
            desc="Inicie um stream instantaneamente de um tweet ou chat via Solana Actions, sem fricção de cadastro."
            delay="0.3s"
          />
          <FeatureCard
            icon={<Zap className="w-7 h-7 text-amber-400" />}
            title="Zk-Compression Ready"
            desc="Arquitetura preparada para comprimir contas de estado, reduzindo custos de rent em até 100x."
            delay="0.4s"
          />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 py-32 px-4 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-4">Como funciona</p>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] tracking-tight">
            Simples como <span className="gradient-text">1-2-3</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-[3.5rem] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {[
            { step: "01", title: "Conecte sua Wallet", desc: "Use Phantom ou Solflare para conectar em 1 clique. Sem cadastro.", color: "from-purple-500 to-purple-600" },
            { step: "02", title: "Deposite no Escrow", desc: "Escolha quanto USDC deseja depositar. Seus fundos ficam seguros no Smart Contract.", color: "from-blue-500 to-blue-600" },
            { step: "03", title: "Assista e Pague", desc: "O pagamento acontece em tempo real por segundo. Pare quando quiser e receba o troco.", color: "from-cyan-500 to-emerald-500" },
          ].map((item, i) => (
            <div key={i} className="text-center group animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 relative`}>
                <span className="text-xl font-bold font-[family-name:var(--font-mono)]">{item.step}</span>
                <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${item.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-display)]">{item.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-16 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-4">
              Pronto para revolucionar o{' '}
              <span className="gradient-text">streaming?</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-lg mx-auto">
              Junte-se aos criadores que já estão recebendo pagamento em tempo real por cada segundo de conteúdo.
            </p>
            <button className="btn-primary px-10 py-4 rounded-2xl font-bold text-base">
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Acessar Protocolo
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-3 h-3 fill-current" />
            </div>
            <span className="text-sm font-bold text-[var(--text-muted)]">FluxBlink Protocol</span>
          </div>
          <p className="text-[var(--text-muted)] text-xs">
            © 2026 FluxBlink • Built for Solana Frontier Hackathon
          </p>
          <div className="flex items-center gap-4">
            <a href="/pitch" className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">Pitch Deck</a>
            <a href="#" className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
