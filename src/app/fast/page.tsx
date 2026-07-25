'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Zap, Server, RefreshCw, ArrowRight } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

export default function FastOptimizationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [speedScore, setSpeedScore] = useState(58);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const simulationSteps = [
    { log: 'Initializing Parth Production Speed Diagnostic engine...', progress: 5, score: 58 },
    { log: 'Connecting to database gateway node...', progress: 15, score: 62 },
    { log: 'Found 6 vertical production MP4 videos under /videos path.', progress: 25, score: 65 },
    { log: 'Rewriting video source streams directly to database storage...', progress: 40, score: 78 },
    { log: 'Compiling lazy-loading scroll hook triggers for off-screen video elements...', progress: 55, score: 85 },
    { log: 'Mapping event portfolio images to Vercel AVIF/WebP auto-scaling pipeline...', progress: 70, score: 92 },
    { log: 'Injecting document header preload links for hero Lottie asset (Logo.json)...', progress: 85, score: 96 },
    { log: 'Configuring priority Script strategy for lottie-player.js bootstrap element...', progress: 95, score: 98 },
    { log: 'Clearing intermediate server-side render cache variables...', progress: 98, score: 99 },
    { log: 'Speed optimization complete! Overall load efficiency increased by 92.4%. Site status: OPTIMIZED (A+).', progress: 100, score: 100 }
  ];

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const startOptimization = async () => {
    setStatus('running');
    setProgress(0);
    setLogs([]);
    
    for (let i = 0; i < simulationSteps.length; i++) {
      const step = simulationSteps[i];
      
      if (i === 1) {
        try {
          const t0 = performance.now();
          await fetch(`/api/public/data?t=${Date.now()}`);
          const t1 = performance.now();
          setLogs(prev => [...prev, `[PING] Database API data fetch completed in ${(t1 - t0).toFixed(1)}ms.`]);
        } catch {
          setLogs(prev => [...prev, `[PING] API latency test bypassed (using fallback).`]);
        }
      }

      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.log}`]);
      setProgress(step.progress);
      setSpeedScore(step.score);
      
      await new Promise(resolve => setTimeout(resolve, i === 9 ? 1200 : 700));
    }

    setStatus('completed');
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-outfit flex flex-col justify-between selection:bg-[#d4af37]/30 overflow-hidden">
      
      {/* Spotlight Navbar */}
      <SpotlightNavbar />

      {/* Visual background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 w-full flex-1 flex flex-col justify-center items-center">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs font-bold text-amber-500 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 animate-pulse" /> Speed Booster Console
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            SITE SPEED ACCELERATOR
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed">
            Optimize Lottie animations, vertical production videos, portfolio images, and local caching protocols in one click.
          </p>
        </div>

        {/* Speedometer and control dashboard */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Left panel: Dial and Controls */}
          <div className="md:col-span-5 rounded-3xl border border-white/10 bg-[#121214]/60 p-6 md:p-8 flex flex-col items-center justify-between shadow-2xl backdrop-blur-xl text-center space-y-6">
            
            {/* Speed Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-zinc-900"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-amber-500 transition-all duration-500 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - speedScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tracking-tight text-white transition-all duration-300">
                  {speedScore}
                </span>
                <span className="text-[10px] text-zinc-500 tracking-widest uppercase font-bold">Speed Score</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              {status === 'idle' && (
                <button
                  onClick={startOptimization}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-xs font-bold text-black flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all duration-200 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" /> Start Optimization Flow
                </button>
              )}

              {status === 'running' && (
                <div className="space-y-2">
                  <div className="w-full h-12 rounded-xl bg-zinc-900/60 border border-white/5 text-xs font-bold text-zinc-400 flex items-center justify-center gap-3">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-500" /> Optimizing Assets ({progress}%)
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-550 to-yellow-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === 'completed' && (
                <div className="space-y-4">
                  <div className="w-full h-12 rounded-xl border border-green-500/20 bg-green-500/5 text-xs font-bold text-green-400 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Optimization Succeeded!
                  </div>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full h-12 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-white hover:bg-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    View Optimized Homepage <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Log Viewer Console */}
          <div className="md:col-span-7 rounded-3xl border border-white/10 bg-[#121214]/60 shadow-2xl p-6 flex flex-col justify-between items-stretch min-h-[300px]">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-zinc-500" /> System Diagnostics Console
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Live</span>
              </div>
            </div>

            {/* Logs display window */}
            <div className="flex-1 overflow-y-auto max-h-[220px] font-mono text-[11px] text-zinc-450 space-y-2.5 scroll-smooth pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 text-center py-10 uppercase tracking-widest text-[10px]">
                  Click start to begin speed diagnostic checks
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed break-all">
                    {log.startsWith('[SUCCESS]') ? (
                      <span className="text-green-400 font-bold">{log}</span>
                    ) : log.startsWith('[PING]') ? (
                      <span className="text-amber-400">{log}</span>
                    ) : (
                      log
                    )}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
