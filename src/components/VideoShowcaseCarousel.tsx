'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOW_VIDEOS } from '@/utils/media';

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

export default function VideoShowcaseCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const visible = useVisibleCount();
  const pageCount = Math.max(1, Math.ceil(SHOW_VIDEOS.length / visible));

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const videos = Array.from(root.querySelectorAll('video'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: [0.45, 0.7] }
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const goToPage = (next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(pageCount - 1, next));
    setPage(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  const gapClass = 'gap-4 md:gap-6';
  const cardWidth =
    visible === 1
      ? 'w-full'
      : visible === 2
        ? 'w-[calc((100%-1rem)/2)] md:w-[calc((100%-1.5rem)/2)]'
        : 'w-[calc((100%-2rem)/3)] md:w-[calc((100%-3rem)/3)]';

  return (
    <section className="relative py-16 md:py-24 bg-[#0A0E27] border-b border-white/10 overflow-hidden">
      <div className="absolute inset-0 site-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="section-label mb-3">Live reels</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight uppercase text-white">
            Beyond Events. We Create Experiences
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed">
            Experience our finest DJ, lighting, stage, and event productions.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            className="w-11 h-11 min-w-[44px] rounded-full border border-white/15 bg-white/5 flex items-center justify-center hover:border-cyan-400/50 hover:text-cyan-300 transition-all"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            className="w-11 h-11 min-w-[44px] rounded-full border border-white/15 bg-white/5 flex items-center justify-center hover:border-cyan-400/50 hover:text-cyan-300 transition-all"
            aria-label="Next videos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 overflow-hidden">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={`flex ${gapClass} overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2`}
        >
          {SHOW_VIDEOS.map((clip, i) => (
            <motion.article
              key={clip.src}
              data-video-card
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % visible) * 0.08, duration: 0.45 }}
              className={`relative flex-shrink-0 ${cardWidth} aspect-[9/16] snap-start rounded-2xl overflow-hidden border border-white/10 bg-[#111827] shadow-[0_20px_50px_rgba(2,6,23,0.45)] transition-transform duration-300 ease-out hover:scale-[1.02] hover:border-cyan-400/40`}
            >
              <video
                src={clip.src}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0E27] to-transparent" />
            </motion.article>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Jump to video page ${i + 1}`}
            onClick={() => goToPage(i)}
            className={`h-2 rounded-full transition-all ${
              i === page ? 'w-7 bg-cyan-400' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
