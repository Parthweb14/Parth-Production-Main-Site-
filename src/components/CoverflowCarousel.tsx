'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

/** Soft fade band at left/right edges (no hard cut) */
const FADE_START = 2.35;
const FADE_END = 3.55;
/** Cards per second — continuous circular motion */
const SPEED = 0.4;
const EASE_TO_TARGET = 4.2;

function wrapOffset(offset: number, total: number) {
  let o = ((offset % total) + total) % total;
  if (o > total / 2) o -= total;
  return o;
}

function shortestDiff(from: number, to: number, total: number) {
  let diff = to - from;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function edgeFade(abs: number) {
  if (abs <= FADE_START) return 1;
  if (abs >= FADE_END) return 0;
  // Smoothstep for softer fade in/out
  const t = (abs - FADE_START) / (FADE_END - FADE_START);
  return 1 - t * t * (3 - 2 * t);
}

function cardTransform(offset: number, isMobile: boolean) {
  const abs = Math.abs(offset);
  const spacing = isMobile ? 132 : 188;
  const curve = isMobile ? 14 : 22;
  const x = offset * spacing;
  const y = abs * abs * curve;
  const rotateZ = offset * (isMobile ? 7 : 9);
  // Wider, eased center emphasis so the main image eases in smoothly
  const raw = Math.max(0, 1 - abs / 1.2);
  const centerMix = raw * raw * (3 - 2 * raw); // smoothstep
  const scale = 0.72 + centerMix * 0.56;
  const baseOpacity = 0.55 + centerMix * 0.45;
  const opacity = baseOpacity * edgeFade(abs);
  const zIndex = Math.round(50 - abs * 10);

  return { x, y, rotateZ, scale, opacity, zIndex, centerMix };
}

export default function CoverflowCarousel() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const progressRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const total = CARDS.length;

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      if (!document.hidden) {
        if (targetRef.current != null) {
          const current = progressRef.current;
          const target = targetRef.current;
          const diff = shortestDiff(current, target, total);
          if (Math.abs(diff) < 0.008) {
            progressRef.current = ((target % total) + total) % total;
            targetRef.current = null;
          } else {
            const step = diff * Math.min(1, EASE_TO_TARGET * dt);
            progressRef.current = (current + step + total) % total;
          }
        } else {
          // Continuous loop (reversed from previous direction)
          progressRef.current = (progressRef.current + SPEED * dt) % total;
        }
        setProgress(progressRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      targetRef.current = ((index % total) + total) % total;
    },
    [total]
  );

  const nudge = useCallback(
    (dir: -1 | 1) => {
      const nearest = Math.round(progressRef.current);
      goTo(nearest + dir);
    },
    [goTo]
  );

  const cardW = isMobile ? 168 : 240;
  const cardH = isMobile ? 246 : 352;
  const nearest = ((Math.round(progress) % total) + total) % total;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden bg-black pt-14 md:pt-20 pb-16 md:pb-24"
    >
      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <div className="mb-16 text-center md:mb-24">
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

        <div className="relative mx-auto mb-8 flex h-[400px] items-start justify-center md:h-[520px] lg:h-[560px]">
          <div className="relative h-full w-full max-w-5xl">
            {CARDS.map((card, index) => {
              const offset = wrapOffset(index - progress, total);
              const abs = Math.abs(offset);
              // Keep mounted through full fade range — no hard disappear
              if (abs > FADE_END) return null;

              const t = cardTransform(offset, isMobile);
              const labelOpacity = Math.max(0, Math.min(1, t.centerMix * 1.35 - 0.2));

              return (
                <div
                  key={card.id}
                  className="absolute left-1/2 top-0 will-change-transform"
                  style={{
                    width: cardW,
                    height: cardH,
                    marginLeft: -cardW / 2,
                    zIndex: t.zIndex,
                    opacity: t.opacity,
                    transform: `translate3d(${t.x}px, ${t.y}px, 0) rotate(${t.rotateZ}deg) scale(${t.scale})`,
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                    style={{
                      borderColor:
                        t.centerMix > 0.55
                          ? `rgba(255,255,255,${0.12 + t.centerMix * 0.2})`
                          : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <Image
                      src={card.src}
                      alt={card.label}
                      fill
                      sizes="240px"
                      className="object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur pointer-events-none"
                      style={{ opacity: labelOpacity }}
                    >
                      {card.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-10 flex items-center justify-center gap-4 md:mb-12">
          <button
            type="button"
            onClick={() => nudge(-1)}
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
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === nearest ? 'w-6 bg-[#ff5a3c]' : 'w-1.5 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => nudge(1)}
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
