'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { STAGE_IMAGES } from '@/utils/media';
import { useAuth } from '@/context/AuthContext';

export default function CoverflowCarousel() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [active, setActive] = useState(0);
  const total = STAGE_IMAGES.length;

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  return (
    <section className="relative py-16 md:py-24 bg-[#0A0E27] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 site-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="section-label mb-3">Stage previewer</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-white uppercase tracking-tight max-w-xl">
            Built for the big night
          </h2>
        </div>
        <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed md:text-right">
          Orbit real stages — LED walls, corporate sets, and wedding builds from the production
          floor.
        </p>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-2 md:px-4">
        <div className="relative h-[420px] sm:h-[500px] md:h-[620px] lg:h-[680px]">
          <div
            className="absolute inset-0"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
          >
            {STAGE_IMAGES.map((item, i) => {
              let offset = i - active;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const absOff = Math.abs(offset);
              if (absOff > 3) return null;

              const rotateY = offset * -42;
              const translateX = offset * 38;
              const translateZ = -absOff * 180;
              const scale = 1 - absOff * 0.12;
              const opacity =
                absOff === 0 ? 1 : absOff === 1 ? 0.75 : absOff === 2 ? 0.4 : 0.15;
              const zIndex = 20 - absOff;

              return (
                <motion.div
                  key={item.src}
                  className="absolute left-1/2 top-1/2 w-[58%] sm:w-[48%] md:w-[42%] lg:w-[38%] aspect-[4/5] cursor-pointer"
                  style={{ transformStyle: 'preserve-3d', zIndex }}
                  animate={{
                    x: `calc(-50% + ${translateX}%)`,
                    y: '-50%',
                    rotateY,
                    z: translateZ,
                    scale,
                    opacity,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onClick={() => setActive(i)}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-cyan-400/20 bg-[#111827] shadow-[0_30px_80px_rgba(2,6,23,0.7)]">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 70vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-300 font-bold mb-1">
                        {item.tag}
                      </p>
                      <h3 className="font-display text-lg md:text-2xl font-semibold text-white uppercase tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/20 bg-[#0A0E27]/80 text-white text-xl hover:border-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/20 bg-[#0A0E27]/80 text-white text-xl hover:border-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ›
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {STAGE_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Book your event
          </a>
        </div>
      </div>
    </section>
  );
}
