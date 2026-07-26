'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaImage from '@/components/MediaImage';
import { STAGE_IMAGES } from '@/utils/media';

const items = STAGE_IMAGES.slice(0, 7);

export default function CoverflowCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % items.length), 4200);
    return () => clearInterval(id);
  }, []);

  const prev = () => setActive((i) => (i - 1 + items.length) % items.length);
  const next = () => setActive((i) => (i + 1) % items.length);

  return (
    <section className="relative py-16 md:py-24 bg-black overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3">Stage deck</p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight">3D fan coverflow</h2>
          <p className="mt-3 text-white/55 max-w-xl text-sm md:text-base leading-relaxed">
            Center card stays flat, bright, and largest — side cards rotate on the Y-axis and drop back in depth.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative h-[380px] sm:h-[440px] md:h-[520px] max-w-6xl mx-auto px-2" style={{ perspective: '1400px' }}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, index) => {
            let offset = index - active;
            const half = Math.floor(items.length / 2);
            if (offset > half) offset -= items.length;
            if (offset < -half) offset += items.length;

            const abs = Math.abs(offset);
            const rotateY = offset * -34;
            const translateX = offset * 138;
            const translateZ = -abs * 140;
            const scale = Math.max(0.72, 1 - abs * 0.11);
            const opacity = abs > 2 ? 0 : 1 - abs * 0.2;
            const zIndex = 50 - abs;

            return (
              <button
                key={item.src}
                type="button"
                onClick={() => setActive(index)}
                className="absolute w-[200px] sm:w-[240px] md:w-[300px] aspect-[3/4] rounded-[28px] overflow-hidden border border-white/15 cursor-pointer transition-[transform,opacity,box-shadow] duration-500 ease-out"
                style={{
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  boxShadow:
                    abs === 0
                      ? '0 24px 70px rgba(255,95,31,0.25), 0 16px 40px rgba(0,0,0,0.7)'
                      : '0 16px 40px rgba(0,0,0,0.55)',
                  filter: abs === 0 ? 'brightness(1)' : 'brightness(0.55)',
                }}
              >
                <MediaImage src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      abs === 0
                        ? 'linear-gradient(to top, rgba(0,0,0,0.78), transparent 48%)'
                        : 'rgba(0,0,0,0.38)',
                  }}
                />
                <AnimatePresence>
                  {abs === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-5 left-5 right-5 text-left"
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em] text-accent mb-1">{item.tag}</p>
                      <p className="font-display text-2xl">{item.title}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-7 bg-accent' : 'w-2 bg-white/25 hover:bg-white/45'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
