'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SHOW_VIDEOS } from '@/utils/media';

export default function VideoShowcaseCarousel() {
  const [active, setActive] = useState(0);
  const featuredRef = useRef<HTMLVideoElement>(null);
  const railRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const featured = featuredRef.current;
    if (featured) {
      void featured.play().catch(() => undefined);
    }
    railRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [active]);

  const featured = SHOW_VIDEOS[active] || SHOW_VIDEOS[0];

  return (
    <section className="relative py-16 md:py-24 bg-[#0A0E27] border-b border-white/10 overflow-hidden">
      <div className="absolute inset-0 site-grid opacity-20" />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-12">
        <p className="section-label mb-3">Live reels</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight uppercase text-white max-w-2xl">
            Beyond Events. We Create Experiences
          </h2>
          <p className="text-slate-400 max-w-md text-base leading-relaxed">
            Spotlight the floor — tap a reel to promote it into the main stage.
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
        <motion.div
          key={featured.src}
          initial={{ opacity: 0.6, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-8 relative aspect-[9/14] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-cyan-400/25 bg-[#111827] shadow-[0_30px_80px_rgba(2,6,23,0.55)]"
        >
          <video
            ref={featuredRef}
            key={featured.src}
            src={featured.src}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300 font-bold mb-2">
                Now playing
              </p>
              <h3 className="font-display text-2xl md:text-4xl font-semibold uppercase tracking-tight text-white">
                {featured.title}
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Live cut
            </span>
          </div>
        </motion.div>

        <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-none pb-1 lg:pb-0 lg:max-h-[min(720px,70vh)] lg:overflow-y-auto">
          {SHOW_VIDEOS.map((clip, i) => {
            const isActive = i === active;
            return (
              <button
                key={clip.src}
                type="button"
                onClick={() => setActive(i)}
                className={`relative flex-shrink-0 w-[46%] sm:w-[38%] lg:w-full aspect-[16/10] rounded-xl overflow-hidden border text-left transition-all duration-300 ${
                  isActive
                    ? 'border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.25)] scale-[1.01]'
                    : 'border-white/10 hover:border-cyan-400/40'
                }`}
              >
                <video
                  ref={(el) => {
                    railRefs.current[i] = el;
                  }}
                  src={clip.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27]/90 via-[#0A0E27]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/90 font-semibold">
                    0{i + 1}
                  </p>
                  <p className="font-display text-sm md:text-base font-semibold uppercase tracking-tight text-white">
                    {clip.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
