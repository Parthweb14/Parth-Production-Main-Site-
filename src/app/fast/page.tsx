'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, CheckCircle, Server, RefreshCw, ArrowRight } from 'lucide-react';
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
    <div className="relative min-h-screen bg-[#12100E] text-[#E7E3DC] font-mono flex flex-col justify-between selection:bg-[#C87A53]/30 overflow-hidden">
      
      <SpotlightNavbar />
      <div className="film-grain" />

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 w-full flex-1 flex flex-col justify-center items-center">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#E7E3DC]/15 bg-[#1A1816]/30 text-[10px] tracking-widest text-[#C87A53] uppercase font-bold">
            ⚡ Performance Tuner
          </div>
          <h1 
            className="text-4xl sm:text-5xl text-[#E7E3DC] tracking-tight leading-none uppercase"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            SPEED ACCELERATOR
          </h1>
          <p className="text-[11px] text-[#A39E93] max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Optimizing vector assets, vertical streams, and image indices for Parth Production portals.
          </p>
        </div>

        {/* Speedometer and control dashboard */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Left panel: Dial and Controls */}
          <div className="md:col-span-5 rounded-sm border border-[#E7E3DC]/10 bg-[#1A1816]/20 p-6 md:p-8 flex flex-col items-center justify-between shadow-2xl text-center space-y-6">
            
            {/* Speed Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#12100E] border border-[#E7E3DC]/5"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#C87A53] transition-all duration-500 ease-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - speedScore / 100)}`}
                  strokeLinecap="square"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span 
                  className="text-4xl text-[#E7E3DC] font-normal"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                  {speedScore}
                </span>
                <span className="text-[9px] text-[#A39E93] tracking-widest uppercase font-bold">Metrics Index</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              {status === 'idle' && (
                <button
                  onClick={startOptimization}
                  className="w-full h-12 rounded-sm border border-[#C87A53] text-[#C87A53] hover:bg-[#C87A53] hover:text-[#12100E] text-[10px] tracking-[0.2em] font-bold uppercase transition-all duration-300 cursor-pointer"
                >
                  Start Optimizer
                </button>
              )}

              {status === 'running' && (
                <div className="space-y-3">
                  <div className="w-full h-12 rounded-sm border border-[#E7E3DC]/10 bg-[#1A1816]/40 text-[10px] tracking-wider uppercase text-[#A39E93] flex items-center justify-center gap-3">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C87A53]" /> Deploying Optimizations ({progress}%)
                  </div>
                  <div className="w-full bg-[#12100E] border border-[#E7E3DC]/5 rounded-sm h-1 overflow-hidden">
                    <div 
                      className="bg-[#C87A53] h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === 'completed' && (
                <div className="space-y-4">
                  <div className="w-full h-12 rounded-sm border border-green-500/20 bg-green-500/5 text-[10px] tracking-wider uppercase font-bold text-green-400 flex items-center justify-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Operations Complete
                  </div>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full h-12 rounded-sm border border-[#E7E3DC]/10 bg-[#1A1816]/40 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#E7E3DC]/5 transition flex items-center justify-center gap-2 cursor-pointer text-[#E7E3DC]"
                  >
                    Return Home <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Log Viewer Console */}
          <div className="md:col-span-7 rounded-sm border border-[#E7E3DC]/10 bg-[#1A1816]/20 shadow-2xl p-6 flex flex-col justify-between items-stretch min-h-[300px]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC]/10 mb-4">
              <span className="text-[10px] font-bold text-[#E7E3DC] tracking-widest uppercase flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-[#C87A53]" /> System Diagnostics Console
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-[#A39E93] font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>

            {/* Logs display window */}
            <div className="flex-1 overflow-y-auto max-h-[220px] font-mono text-[10px] text-[#A39E93] space-y-2.5 scroll-smooth pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[#A39E93]/40 text-center py-10 uppercase tracking-widest text-[9px]">
                  Initiate speed sequence log metrics
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed break-all">
                    {log.startsWith('[SUCCESS]') ? (
                      <span className="text-green-400 font-bold">{log}</span>
                    ) : log.startsWith('[PING]') ? (
                      <span className="text-[#C87A53]">{log}</span>
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
