"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, AlertCircle, Volume2, VolumeX, Maximize, SkipForward, Loader } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  ratePerSecond: number; // em microlamports de USDC
}

export default function VideoPlayer({ src, ratePerSecond }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [unsyncedSeconds, setUnsyncedSeconds] = useState(0);
  const [balance, setBalance] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  // Sincroniza com o contrato a cada 10 segundos assistidos
  useEffect(() => {
    if (unsyncedSeconds >= 10) {
      syncWithBlockchain(unsyncedSeconds);
      setUnsyncedSeconds(0);
    }
  }, [unsyncedSeconds]);

  const syncWithBlockchain = async (seconds: number) => {
    setIsSyncing(true);
    try {
      console.log(`Sincronizando ${seconds} segundos com a blockchain...`);
      const response = await fetch('/api/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId: "12345",
          seconds: seconds,
          viewerAddress: "47qsb1iDqWq3zyBNsnFAyNEsFtCJX7EWsrEAy1aaY9jt"
        })
      });
      const data = await response.json();
      if (data.success) {
        console.log("✅ Sincronizado! Signature:", data.signature);
      }
    } catch (err) {
      console.error("Falha ao sincronizar:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && balance > 0) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setUnsyncedSeconds((prev) => prev + 1);

        const cost = ratePerSecond / 1_000_000;
        setBalance((prev) => Math.max(0, prev - cost));
        setTotalPaid((prev) => prev + cost);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, balance, ratePerSecond]);

  // Video progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('progress', onProgress);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  }, [duration]);

  const handleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement?.parentElement;
    if (container?.requestFullscreen) {
      container.requestFullscreen();
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden glass-heavy shadow-2xl shadow-black/50 relative">
      <div
        className="relative aspect-video group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover bg-black"
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <Loader className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
        )}

        {/* Play/Pause Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 z-10 ${
            isPlaying
              ? showControls ? 'opacity-100 bg-black/20' : 'opacity-0'
              : 'opacity-100 bg-black/40'
          }`}
          onClick={togglePlay}
        >
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(139,92,246,0.9))',
              boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.5)',
            }}
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
        </div>

        {/* Bottom Controls Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-500 z-20 ${
            showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1.5 bg-white/10 cursor-pointer group/progress hover:h-3 transition-all duration-200 relative"
            onClick={handleProgressClick}
          >
            {/* Buffered */}
            <div className="absolute inset-0 bg-white/10 rounded-full" style={{ width: `${buffered}%` }} />
            {/* Progress */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)',
              }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Skip */}
              <button
                onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }}
                className="hover:text-blue-400 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/vol:w-20 transition-all duration-300 opacity-0 group-hover/vol:opacity-100 accent-blue-500 h-1"
                />
              </div>

              {/* Time */}
              <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-5">
              {/* Streaming Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-red-500'}`} />
                <span className="text-[11px] font-[family-name:var(--font-mono)] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {isPlaying ? 'STREAMING' : 'PAUSED'}
                </span>
              </div>

              {/* Sync indicator */}
              {isSyncing && (
                <div className="flex items-center gap-1.5">
                  <Loader className="w-3 h-3 animate-spin text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-[family-name:var(--font-mono)]">SYNC</span>
                </div>
              )}

              {/* Balance */}
              <div className="text-right pl-4 border-l border-white/10">
                <div className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold">Escrow</div>
                <div className={`text-sm font-[family-name:var(--font-mono)] font-bold tabular-nums ${
                  balance < 0.1 ? 'text-red-400' : balance < 0.3 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {balance.toFixed(4)} <span className="text-[10px] text-[var(--text-muted)]">USDC</span>
                </div>
              </div>

              {/* Fullscreen */}
              <button onClick={handleFullscreen} className="hover:text-blue-400 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-5 py-3.5 flex items-center justify-between border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold block">Tempo Assistido</span>
            <span className="text-sm font-[family-name:var(--font-mono)] font-bold tabular-nums">{elapsedSeconds}s</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold block">Custo/Segundo</span>
            <span className="text-sm font-[family-name:var(--font-mono)] font-bold text-blue-400 tabular-nums">
              {(ratePerSecond / 1_000_000).toFixed(4)} USDC
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold">Total Pago</span>
          <span className="text-sm font-[family-name:var(--font-mono)] font-bold text-purple-400 tabular-nums">
            {totalPaid.toFixed(4)} USDC
          </span>
        </div>
      </div>

      {/* Empty balance warning */}
      {balance <= 0 && (
        <div className="px-5 py-3 flex items-center gap-3 text-red-400 text-sm border-t border-red-500/20 bg-red-500/5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">Seu saldo no Escrow acabou. O stream foi interrompido.</span>
        </div>
      )}
    </div>
  );
}
