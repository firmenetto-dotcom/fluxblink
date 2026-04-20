"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Car, QrCode, Camera, ChevronRight, DollarSign, Users, Activity, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';

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
      <div className="absolute -top-[30%] -left-[15%] w-[700px] h-[700px] rounded-full bg-blue-600/[0.07] blur-[150px] animate-float" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-600/[0.08] blur-[130px] animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.05] blur-[120px] animate-float" style={{ animationDelay: '-4s' }} />
      
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

/* ── Parking Dashboard Mock ── */
function ParkingDashboard() {
  const [spots, setSpots] = useState([
    { id: 'A-01', status: 'free', balance: 0, occupant: null, rate: 0.05 },
    { id: 'A-02', status: 'occupied', balance: 1.45, occupant: 'DEF-5678', rate: 0.05 },
    { id: 'B-01', status: 'occupied', balance: 4.20, occupant: 'XYZ-1234', rate: 0.08 },
    { id: 'B-02', status: 'free', balance: 0, occupant: null, rate: 0.05 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSpots(s => s.map(spot => 
        spot.status === 'occupied' 
          ? { ...spot, balance: spot.balance + (spot.rate / 60) } 
          : spot
      ));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card p-8 rounded-[2rem] w-full max-w-4xl mx-auto border border-white/10 shadow-2xl shadow-blue-500/10 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-400" />
            Painel da Unidade - Faria Lima
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Monitoramento autônomo de fluxo on-chain</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-bold mb-1">Rendimento (Kamino)</p>
            <p className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.4% APY
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {spots.map((spot) => (
          <div key={spot.id} className={`p-5 rounded-2xl border transition-all duration-300 ${
            spot.status === 'occupied' 
              ? 'bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500/30 shadow-inner shadow-blue-500/10' 
              : 'bg-white/5 border-white/5 opacity-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-bold bg-white/10 px-2 py-1 rounded text-[var(--text-muted)]">{spot.id}</span>
              {spot.status === 'occupied' && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
            </div>
            
            {spot.status === 'occupied' ? (
              <div className="space-y-3">
                <div className="text-xs text-[var(--text-secondary)] font-mono">{spot.occupant}</div>
                <div>
                  <div className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-1">Fluindo ao vivo</div>
                  <div className="text-2xl font-mono font-bold text-white tracking-tight">
                    ${spot.balance.toFixed(4)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-[var(--text-muted)] text-sm font-medium">
                Vaga Livre
              </div>
            )}
          </div>
        ))}
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
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:rotate-12 transition-all duration-500">
            <Zap className="w-5 h-5 fill-current" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />
          </div>
          <span className="text-xl font-extrabold tracking-tight font-[family-name:var(--font-display)]">
            FLUX<span className="text-cyan-400">PARK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#" className="hover:text-white transition-colors duration-300 relative group/link">
              Rede DePIN
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 group-hover/link:w-full transition-all duration-300" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 relative group/link">
              Gestores
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 group-hover/link:w-full transition-all duration-300" />
            </a>
          </div>
          <button className="btn-primary px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2">
            <span>Dashboard</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-16 md:pt-24 pb-20 px-4 max-w-[1400px] mx-auto">
        <div className="text-center mb-20 space-y-6">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass text-xs font-bold tracking-[0.15em] uppercase text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            Solana DePIN Infrastructure
          </div>

          {/* Title */}
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] max-w-5xl mx-auto font-[family-name:var(--font-display)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            INFRAESTRUTURA{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text animate-gradient inline-block">
              AUTÔNOMA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            O fim das maquininhas de cartão e cancelas. O pagamento de estacionamentos que flui em tempo real via Solana Blinks e rende juros no Kamino.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-base">
              <Sparkles className="w-5 h-5" />
              <span>Simular Estacionamento</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Mock Dashboard ── */}
        <div className="mb-32">
          <ParkingDashboard />
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <StatCard
            icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
            label="Economia em Taxas (MDR)"
            value="$42,500"
            delay="0.1s"
          />
          <StatCard
            icon={<Car className="w-6 h-6 text-blue-400" />}
            label="Vagas Conectadas"
            value="1,204"
            delay="0.2s"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-cyan-400" />}
            label="Yield Gerado (Kamino)"
            value="$8,450"
            delay="0.3s"
          />
        </div>

        {/* ── Feature Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Camera className="w-7 h-7 text-purple-400" />}
            title="Computer Vision"
            desc="Câmeras IoT leem as placas e disparam o Blink de pagamento automaticamente para o celular do usuário."
            delay="0.1s"
          />
          <FeatureCard
            icon={<QrCode className="w-7 h-7 text-blue-400" />}
            title="Blink-Native"
            desc="Sem fricção. Sem app para baixar. Escaneie um QR Code ou clique na notificação para iniciar o stream."
            delay="0.2s"
          />
          <FeatureCard
            icon={<Shield className="w-7 h-7 text-emerald-400" />}
            title="Kill-Switch IoT"
            desc="Se o carro sair e o sensor perder conexão, o contrato on-chain bloqueia o pagamento protegendo o cliente."
            delay="0.3s"
          />
          <FeatureCard
            icon={<TrendingUp className="w-7 h-7 text-amber-400" />}
            title="Yield-Bearing"
            desc="O dinheiro fica no Escrow rendendo juros no protocolo Kamino enquanto o carro está estacionado."
            delay="0.4s"
          />
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-16 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-600/10 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-4">
              Junte-se à revolução do{' '}
              <span className="gradient-text">DePIN</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-lg mx-auto">
              Transforme seu estacionamento em uma infraestrutura autônoma, corte taxas da Mastercard e ganhe juros pelo Kamino.
            </p>
            <button className="btn-primary px-10 py-4 rounded-2xl font-bold text-base">
              <span className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Cadastrar Estacionamento
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-3 h-3 fill-current" />
            </div>
            <span className="text-sm font-bold text-[var(--text-muted)]">FluxPark (FluxBlink) Protocol</span>
          </div>
          <p className="text-[var(--text-muted)] text-xs">
            © 2026 FluxBlink • Built for Solana Frontier Hackathon
          </p>
          <div className="flex items-center gap-4">
            <a href="/pitch" className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">Pitch Deck</a>
            <a href="#" className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
