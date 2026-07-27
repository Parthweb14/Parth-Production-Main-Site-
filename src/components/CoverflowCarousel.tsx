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

/** Soft fade at far left/right edges only */
const FADE_START = 3.1;
const FADE_END = 4.2;
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
  const t = (abs - FADE_START) / (FADE_END - FADE_START);
  return 1 - t * t * (3 - 2 * t);
}

/** Equal-size cards on a circular arc — no center scale-up */
function cardTransform(offset: number, isMobile: boolean) {
  const abs = Math.abs(offset);
  const cardW = isMobile ? 148 : 208;
  const gap = isMobile ? 26 : 36;
  const radius = isMobile ? 400 : 560;
  const angleStep = (cardW + gap) / radius;
  const angle = offset * angleStep;

  const x = radius * Math.sin(angle);
  const y = radius * (1 - Math.cos(angle)) * 0.9;
  const rotateZ = (angle * 180) / Math.PI * 0.32;
  const scale = 1;
  const opacity = 0.92 * edgeFade(abs);
  const zIndex = Math.round(50 - abs * 8);

  return { x, y, rotateZ, scale, opacity, zIndex };
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

  const cardW = isMobile ? 148 : 208;
  const cardH = isMobile ? 216 : 304;
  const nearest = ((Math.round(progress) % total) + total) % total;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden bg-black pt-14 md:pt-20 pb-16 md:pb-24"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[100px] md:h-[480px] md:w-[480px]"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] h-[200px] w-[min(100%,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] md:h-[280px] md:w-[min(100%,980px)]"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] h-[140px] w-[min(92%,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04] md:h-[200px] md:w-[min(92%,760px)]"
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
          >
            Our Productions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-[1.85rem] font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            Stage Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/50 md:text-[15px]"
          >
            Built for the big night — LED walls, luxury weddings, corporate stages, concerts, and
            immersive DJ performances from the Parth Production floor.
          </motion.p>
        </motion.div>

        <div className="relative mx-auto mb-8 flex h-[380px] items-start justify-center md:h-[500px] lg:h-[540px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full max-w-6xl"
          >
            {CARDS.map((card, index) => {
              const offset = wrapOffset(index - progress, total);
              const abs = Math.abs(offset);
              if (abs > FADE_END) return null;

              const t = cardTransform(offset, isMobile);
              const isNearest = index === nearest;

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
                    className={`relative h-full w-full overflow-hidden rounded-2xl border shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-colors duration-300 ${
                      isNearest ? 'border-white/20' : 'border-white/10'
                    }`}
                  >
                    <Image
                      src={card.src}
                      alt={card.label}
                      fill
                      sizes="208px"
                      className="object-cover"
                      draggable={false}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                      animate={{ opacity: isNearest ? 0.85 : 1 }}
                      transition={{ duration: 0.35 }}
                    />
                    <span
                      className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur pointer-events-none transition-all duration-300 ${
                        isNearest
                          ? 'border-white/20 bg-black/60 text-white'
                          : 'border-white/10 bg-black/40 text-white/70'
                      }`}
                    >
                      {card.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10 flex items-center justify-center gap-4 md:mb-12"
        >
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Previous stage"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-white/35 hover:bg-white/[0.08]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <motion.div
            className="flex items-center gap-1.5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                type="button"
                aria-label={`Go to ${card.label}`}
                onClick={() => goTo(i)}
                variants={{
                  hidden: { opacity: 0, scale: 0.6 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === nearest ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </motion.div>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Next stage"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-white/35 hover:bg-white/[0.08]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="text-center"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-[#3A8FB8]/40 bg-[#3A8FB8]/10 px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#3A8FB8] transition-all hover:border-[#3A8FB8]/70 hover:bg-[#3A8FB8]/18 hover:shadow-[0_0_24px_rgba(58,143,184,0.3)]"
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
