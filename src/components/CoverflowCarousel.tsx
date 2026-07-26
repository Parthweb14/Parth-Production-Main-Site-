'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STAGE_IMAGES } from '@/utils/media';

const CARDS = [
  { id: 1, label: 'Wedding Stage', src: STAGE_IMAGES[0].src },
  { id: 2, label: 'Concert Setup', src: STAGE_IMAGES[1].src },
  { id: 3, label: 'Festival Lighting', src: STAGE_IMAGES[2].src },
  { id: 4, label: 'Corporate Event', src: STAGE_IMAGES[3].src },
  { id: 5, label: 'Road Show', src: STAGE_IMAGES[4].src },
  { id: 6, label: 'DJ Performance', src: STAGE_IMAGES[5].src },
  { id: 7, label: 'LED Wall', src: STAGE_IMAGES[6].src },
  { id: 8, label: 'Fireworks Show', src: STAGE_IMAGES[8].src },
  { id: 9, label: 'Mainstage Array', src: STAGE_IMAGES[7].src },
];

const VISIBLE_RADIUS = 3; // show center ± 3

function cardTransform(offset: number, isMobile: boolean) {
  const abs = Math.abs(offset);
  const spacing = isMobile ? 118 : 168;
  const curve = isMobile ? 14 : 22;
  const x = offset * spacing;
  // Downward convex arc (smile curve) like the reference
  const y = abs * abs * curve;
  const rotateZ = offset * (isMobile ? 7 : 9);
  const scale = Math.max(0.72, 1.08 - abs * 0.1);
  const opacity = Math.max(0.45, 1 - abs * 0.14);
  const zIndex = 40 - abs;

  return { x, y, rotateZ, scale, opacity, zIndex };
}

export default function CoverflowCarousel() {
  const [active, setActive] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const total = CARDS.length;

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const cardW = isMobile ? 150 : 210;
  const cardH = isMobile ? 220 : 310;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden bg-black pt-14 md:pt-20 pb-16 md:pb-24"
    >
      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-10">
        {/* Header — centered like reference */}
        <div className="mb-8 text-center md:mb-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center rounded-full bg-[#ff5a3c]/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff5a3c]"
          >
            Our Productions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-[2rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Stage Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base"
          >
            Built for the big night — LED walls, luxury weddings, corporate stages, concerts, and
            immersive DJ performances from the Parth Production floor.
          </motion.p>
        </div>

        {/* Curved gallery stage */}
        <div className="relative mx-auto mb-6 h-[340px] md:h-[460px] lg:h-[500px]">
          <div className="absolute inset-0 flex items-start justify-center pt-2 md:pt-4">
            {CARDS.map((card, index) => {
              let offset = index - active;
              // shortest path wrapping for continuous feel when clicking buttons
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              if (Math.abs(offset) > VISIBLE_RADIUS) return null;

              const t = cardTransform(offset, isMobile);
              const isCenter = offset === 0;

              return (
                <motion.button
                  key={card.id}
                  type="button"
                  onClick={() => setActive(index)}
                  initial={false}
                  animate={{
                    x: t.x,
                    y: t.y,
                    rotate: t.rotateZ,
                    scale: t.scale,
                    opacity: t.opacity,
                    zIndex: t.zIndex,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="absolute top-0"
                  style={{
                    width: cardW,
                    height: cardH,
                    marginLeft: -cardW / 2,
                  }}
                  aria-label={card.label}
                  aria-current={isCenter ? 'true' : undefined}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.55)] ${
                      isCenter ? 'border-white/30' : 'border-white/10'
                    }`}
                  >
                    <Image
                      src={card.src}
                      alt={card.label}
                      fill
                      sizes="220px"
                      className="object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    {isCenter && (
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                        {card.label}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Nav buttons — no infinite auto scroll */}
        <div className="mb-10 flex items-center justify-center gap-4 md:mb-12">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous stage"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {CARDS.map((card, i) => (
              <button
                key={card.id}
                type="button"
                aria-label={`Go to ${card.label}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-6 bg-[#ff5a3c]' : 'w-1.5 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next stage"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full bg-[#ff5a3c] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white transition-transform hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(255,90,60,0.35)]"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
