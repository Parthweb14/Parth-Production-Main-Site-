'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import { useAuth } from '@/context/AuthContext';
import LottiePlayer from '@/components/LottiePlayer';

const ASSETS_BASE = 'https://assets.kadamproduction.in';

const defaultVideoSources = [
  `${ASSETS_BASE}/videos/Trim-6.mp4`,
  `${ASSETS_BASE}/videos/Trim-3-1.mp4`,
  `${ASSETS_BASE}/videos/Trim-1.mp4`,
  `${ASSETS_BASE}/videos/Untitled_design_2_pbfqf3.mp4`,
  `${ASSETS_BASE}/videos/download_2_sispkn.mp4`,
  `${ASSETS_BASE}/videos/Untitled_design_3_lw9eld.mp4`,
  `${ASSETS_BASE}/videos/Trim-6.mp4`,
  `${ASSETS_BASE}/videos/Trim-3-1.mp4`,
  `${ASSETS_BASE}/videos/Trim-1.mp4`
];

const slogans = [
  'CINEMATIC SOUND DESIGN',
  'MODULAR TRUSS GATE RIGGINGS',
  'STADIUM CONCERT ACOUSTICS',
  'ROYAL WEDDING STAGES',
  'CULTURAL FESTIVAL INFRASTRUCTURE',
  'EXPERT LIGHT SYNC ARRAYS'
];

const statsData = [
  { number: '1000+', label: 'EVENTS COMPLETED', desc: 'Over a decade of orchestrating high-energy soundscapes and dynamic visual setups.' },
  { number: '10+', label: 'YEARS OF CRAFT', desc: 'Pioneering event production across Gujarat and all parts of India.' },
  { number: '500+', label: 'TRUSS SYSTEMS RIGGED', desc: 'Custom structural platforms and heavy duty line array configurations.' },
  { number: '250+', label: 'ROAD SHOWS PRODUCED', desc: 'High-impact mobile daylight LED displays and sound arrays.' }
];

interface StageVideoProps {
  src: string;
  isActive: boolean;
  className?: string;
}

function StageVideo({ src, isActive, className }: StageVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn('Playback deferred:', err));
      }
    } else {
      video.pause();
    }
  }, [isActive, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      loop
      preload="auto"
      className={className}
    />
  );
}

export default function HomePage() {
  const router = useRouter();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSources, setVideoSources] = useState<string[]>(defaultVideoSources);
  const { siteSettings } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const isReady = videoLoaded && minTimeElapsed;

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), 4000);
    const fallbackTimer = setTimeout(() => setVideoLoaded(true), 8000);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    async function loadKVVideos() {
      try {
        const res = await fetch(`/api/public/data?t=${Date.now()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          const urls = data.videos.map((item: any) => {
            const url = item.video_url;
            return url.startsWith('/videos/') ? `${ASSETS_BASE}${url}` : url;
          });
          while (urls.length < 3) {
            urls.push(defaultVideoSources[urls.length % defaultVideoSources.length]);
          }
          setVideoSources(urls);
        }
      } catch (err) {
        console.error('Failed to load stage videos:', err);
      }
    }
    loadKVVideos();
  }, []);

  return (
    <>
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} isReady={isReady} />
      )}

      <div className="film-grain" />
      <SpotlightNavbar />

      <main className="min-h-screen bg-[#12100E] text-[#E7E3DC] overflow-hidden pt-16 md:pt-20">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col justify-between border-b border-[#E7E3DC]/10 px-6 md:px-12 py-12">
          
          {/* Top Metadata Row (Editorial style) */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 font-mono text-[10px] tracking-widest text-[#A39E93] uppercase">
            <span>OFFICE: GUJARAT / MH / IN</span>
            <span>CINEMATIC PRODUCTION SPECIALISTS</span>
            <span>EST. 2016</span>
          </div>

          {/* Center Cinematic Title Card */}
          <div className="my-auto py-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-8 text-left">
              <h1 
                className="text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none text-[#E7E3DC]"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                THE ART OF <br />
                <span className="italic font-light text-[#C87A53]">Kinetic Light</span> <br />
                & ACOUSTICS.
              </h1>
              <p className="text-xs sm:text-sm font-mono text-[#A39E93] max-w-xl leading-relaxed">
                We engineer large-scale stage backdrops, high-fidelity sound fields, and responsive lighting choreography that transforms empty spaces into living monuments.
              </p>
              
              {/* Editorial Outlined Button Triggers */}
              <div className="flex flex-wrap gap-4 pt-4 font-mono text-[11px] tracking-widest uppercase">
                <button 
                  onClick={() => router.push('/services')}
                  className="px-8 py-4 border border-[#E7E3DC] hover:bg-[#E7E3DC] hover:text-[#12100E] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Explore Sectors <ArrowUpRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => router.push('/gallery')}
                  className="px-8 py-4 border border-[#E7E3DC]/20 hover:border-[#E7E3DC] transition-all duration-300 cursor-pointer text-[#A39E93] hover:text-[#E7E3DC]"
                >
                  View Archive
                </button>
              </div>
            </div>

            {/* Circular Abstract Logo on the right */}
            <div className="lg:col-span-4 flex justify-center items-center relative aspect-square max-w-[320px] mx-auto w-full lg:max-w-none opacity-40">
              <LottiePlayer src="/Logo.json" className="w-full h-full flex items-center justify-center filter grayscale contrast-125" />
            </div>
          </div>

          {/* Bottom Row - Cinematic video background card */}
          <div className="w-full relative aspect-[21/9] md:aspect-[32/10] overflow-hidden border border-[#E7E3DC]/10 rounded-sm">
            <video 
              src={`${ASSETS_BASE}/videos/upscaled-video_v3jizt.mp4`}
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover grayscale opacity-60 brightness-[0.7] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-transparent to-transparent" />
          </div>

        </section>

        {/* KINETIC SLOGAN TICKER */}
        <section className="relative py-8 bg-[#12100E] border-b border-[#E7E3DC]/10 overflow-hidden font-mono text-xs tracking-[0.25em] text-[#E7E3DC] uppercase">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {slogans.map((text, idx) => (
              <span key={idx} className="flex items-center gap-12">
                <span>{text}</span>
                <span className="text-[#C87A53]">•</span>
              </span>
            ))}
            {/* Duplicated for loop */}
            {slogans.map((text, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-12">
                <span>{text}</span>
                <span className="text-[#C87A53]">•</span>
              </span>
            ))}
          </div>
        </section>

        {/* ASYMMETRICAL SELECTED STAGES VIEW */}
        <section className="py-20 md:py-32 px-6 md:px-12 border-b border-[#E7E3DC]/10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] tracking-widest text-[#C87A53] block uppercase">// Live Showcases</span>
              <h2 
                className="text-4xl sm:text-5xl leading-none text-[#E7E3DC]"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                OUR STAGES IN <br />
                <span className="italic font-light">Kinetic Motion</span>
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="font-mono text-xs text-[#A39E93] leading-relaxed max-w-xl">
                A curated sequence of live systems executing design choreography. Each installation blends modular rigging precision with synchronized sound wave fields.
              </p>
            </div>
          </div>

          {/* Asymmetric layout frames */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Frame (Tall Video / Small text) */}
            <div className="md:col-span-7 border border-[#E7E3DC]/10 p-6 flex flex-col justify-between space-y-8 rounded-sm bg-[#1A1816]/30">
              <div className="relative w-full aspect-[16/10] md:aspect-square overflow-hidden rounded-sm border border-[#E7E3DC]/5">
                {videoSources[0] ? (
                  <StageVideo 
                    src={videoSources[0]} 
                    isActive={true} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-950/40 animate-pulse" />
                )}
              </div>
              <div className="space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">Stage Design 01</span>
                <h3 
                  className="text-2xl text-[#E7E3DC]"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}
                >
                  Concert Mainstages & Arena Riggings
                </h3>
                <p className="font-mono text-[11px] text-[#A39E93] leading-relaxed">
                  Line arrays hung on aluminum heavy duty structures configured to cover large audience venues with massive sound pressure levels.
                </p>
              </div>
            </div>

            {/* Right Frame (Short Video / Detailed text accordion) */}
            <div className="md:col-span-5 flex flex-col justify-between gap-8">
              
              {/* Top Frame card */}
              <div className="border border-[#E7E3DC]/10 p-6 flex flex-col gap-6 rounded-sm bg-[#1A1816]/30">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-sm border border-[#E7E3DC]/5">
                  {videoSources[1] ? (
                    <StageVideo 
                      src={videoSources[1]} 
                      isActive={true} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-950/40 animate-pulse" />
                  )}
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">Stage Design 02</span>
                  <h3 className="text-xl text-[#E7E3DC]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    Elite Weddings & Varmala Setups
                  </h3>
                </div>
              </div>

              {/* Bottom Frame card */}
              <div className="border border-[#E7E3DC]/10 p-6 flex flex-col gap-6 rounded-sm bg-[#1A1816]/30">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-sm border border-[#E7E3DC]/5">
                  {videoSources[2] ? (
                    <StageVideo 
                      src={videoSources[2]} 
                      isActive={true} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-950/40 animate-pulse" />
                  )}
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">Stage Design 03</span>
                  <h3 className="text-xl text-[#E7E3DC]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    Road Shows & Corporate Launches
                  </h3>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* EDITORIAL ACCORDION DETAILS SECTION */}
        <section className="py-20 md:py-32 border-b border-[#E7E3DC]/10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-[10px] tracking-widest text-[#C87A53] block uppercase">// System Metrics</span>
            <h2 
              className="text-4xl md:text-5xl leading-none text-[#E7E3DC]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              METRICS OF <br />
              <span className="italic font-light">Performance</span>
            </h2>
            <p className="font-mono text-xs text-[#A39E93] leading-relaxed max-w-sm pt-4">
              Our capability mapped out in numbers. Click each item to view details of our structural deployments.
            </p>
          </div>

          {/* Right Accordion */}
          <div className="lg:col-span-7 border-t border-[#E7E3DC]/10 divide-y divide-[#E7E3DC]/10">
            {statsData.map((stat, idx) => {
              const isOpen = activeAccordion === idx;
              return (
                <div key={idx} className="py-6 transition-all duration-300">
                  <button 
                    onClick={() => setActiveAccordion(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none group"
                  >
                    <div className="flex items-center gap-6">
                      <span 
                        className="text-3xl md:text-4xl text-[#C87A53] font-normal"
                        style={{ fontFamily: 'var(--font-cormorant), serif' }}
                      >
                        {stat.number}
                      </span>
                      <span className="font-mono text-xs tracking-wider text-[#E7E3DC] uppercase group-hover:text-[#C87A53] transition-colors">
                        {stat.label}
                      </span>
                    </div>
                    {isOpen ? <Minus className="w-4 h-4 text-[#C87A53]" /> : <Plus className="w-4 h-4 text-[#A39E93] group-hover:text-[#E7E3DC] transition-colors" />}
                  </button>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-4 pl-16 pr-8 text-xs font-mono text-[#A39E93] leading-relaxed"
                    >
                      {stat.desc}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* PROJECTS SHOWCASE */}
        <ProjectsSection />

      </main>

      <Footer />
    </>
  );
}
