'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOW_VIDEOS } from '@/utils/media';

export default function VideoShowcaseCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-video-card]');
    const amount = (card?.offsetWidth || 280) + 24;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-video-card]');
    const width = (card?.offsetWidth || 280) + 24;
    setActive(Math.round(el.scrollLeft / width));
  };

  return (
    <section className="relative py-16 md:py-24 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">
            Parth Production
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase">
            Beyond Events. We Create Experiences
          </h2>
          <p className="mt-3 text-white/70 max-w-2xl text-base md:text-lg leading-relaxed">
            Experience our finest DJ, lighting, stage, and event productions.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="w-11 h-11 min-w-[44px] rounded-full border border-white/20 flex items-center justify-center hover:border-accent transition-all"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="w-11 h-11 min-w-[44px] rounded-full border border-white/20 flex items-center justify-center hover:border-accent transition-all"
            aria-label="Next videos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="max-w-7xl mx-auto px-4 md:px-8 flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
      >
        {SHOW_VIDEOS.map((clip, i) => (
          <motion.article
            key={clip.src}
            data-video-card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className="relative flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)] aspect-[9/16] snap-center rounded-3xl overflow-hidden bg-black border border-accent transition-transform duration-300 ease-out hover:scale-[1.02]"
          >
            <video
              src={clip.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.article>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {SHOW_VIDEOS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Jump to video ${i + 1}`}
            onClick={() => {
              const el = scrollerRef.current;
              const card = el?.querySelector<HTMLElement>('[data-video-card]');
              if (!el || !card) return;
              el.scrollTo({ left: i * (card.offsetWidth + 24), behavior: 'smooth' });
            }}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-7 bg-accent' : 'w-2 bg-white/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
