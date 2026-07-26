'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

const CARD_W = 280;
const CARD_H = 420;
const GAP = 24;
const STEP = CARD_W + GAP;
const LOOP_SECONDS = 32;
const SPEED = (CARDS.length * STEP) / LOOP_SECONDS;

const FEATURES = [
  {
    title: 'Lightning-Fast Setup',
    description:
      'From concept to execution in record time. Our crew transforms venues into stunning stages within hours, not days.',
  },
  {
    title: 'Multiple Styles & Customization',
    description:
      'From intimate weddings to massive festivals — elegant, energetic, or explosive — we build the vibe you want.',
  },
  {
    title: 'High-Impact Productions',
    description:
      'Crystal-clear sound, breathtaking visuals, and effects that leave lasting impressions. Professional quality guaranteed.',
  },
];

type CardStyle = {
  rotateY: number;
  scale: number;
  opacity: number;
  translateZ: number;
  zIndex: number;
  isCenter: boolean;
};

/** Stronger tunnel: center pops forward, sides shrink and recede. */
function styleForOffset(normalized: number): CardStyle {
  const abs = Math.abs(normalized);
  const rotateY = Math.max(-32, Math.min(32, -normalized * 18));

  let scale = 0.48;
  let opacity = 0.28;
  let translateZ = -280;

  if (abs < 0.4) {
    const t = abs / 0.4;
    scale = 1.22 - t * (1.22 - 0.88);
    opacity = 1 - t * 0.15;
    translateZ = 120 - t * 160;
  } else if (abs < 1.25) {
    const t = (abs - 0.4) / 0.85;
    scale = 0.88 - t * (0.88 - 0.62);
    opacity = 0.85 - t * 0.3;
    translateZ = -40 - t * 120;
  } else if (abs < 2.4) {
    const t = (abs - 1.25) / 1.15;
    scale = 0.62 - t * (0.62 - 0.48);
    opacity = 0.55 - t * 0.27;
    translateZ = -160 - t * 120;
  }

  return {
    rotateY,
    scale,
    opacity,
    translateZ,
    zIndex: Math.round(200 - abs * 40),
    isCenter: abs < 0.38,
  };
}

export default function CoverflowCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [viewportW, setViewportW] = useState(1200);
  const resumeTimer = useRef<number | null>(null);
  const dragState = useRef({ active: false, startX: 0, startOffset: 0 });
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);

  const segment = CARDS.length * STEP;
  const loopCards = useMemo(() => [...CARDS, ...CARDS, ...CARDS], []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setViewportW(entry.contentRect.width);
    });
    ro.observe(el);
    setViewportW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const wrapOffset = useCallback(
    (value: number) => {
      let v = value % segment;
      if (v < 0) v += segment;
      return v;
    },
    [segment]
  );

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      if (!paused && !dragging && !document.hidden) {
        offsetRef.current = wrapOffset(offsetRef.current + SPEED * dt);
        setOffset(offsetRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, dragging, wrapOffset]);

  const scheduleResume = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 1800);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      active: true,
      startX: e.clientX,
      startOffset: offsetRef.current,
    };
    setDragging(true);
    setPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    offsetRef.current = wrapOffset(dragState.current.startOffset - dx);
    setOffset(offsetRef.current);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setDragging(false);
    scheduleResume();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && Math.abs(e.deltaX) < 2) return;
    e.preventDefault();
    setPaused(true);
    offsetRef.current = wrapOffset(offsetRef.current + e.deltaX + e.deltaY * 0.35);
    setOffset(offsetRef.current);
    scheduleResume();
  };

  const baseIndex = CARDS.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden bg-black pt-14 md:pt-20 pb-20 md:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="mb-10 text-center md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-[12px] font-semibold uppercase tracking-[3px] text-[#ff5a3c]"
          >
            Our Productions
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-[38px] font-bold leading-tight tracking-tight text-white md:text-[54px] lg:text-[64px]"
          >
            Stage Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-2 font-serif italic text-[26px] text-[#ff5a3c] md:text-[34px] lg:text-[40px]"
          >
            Built for the Big Night.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-4 max-w-[700px] text-sm leading-relaxed text-[#b8b8b8] md:text-base"
          >
            Drag through real stages featuring LED walls, luxury wedding productions, corporate
            events, concerts, lighting setups, truss systems, fireworks, and immersive DJ
            performances crafted by Parth Production.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="relative mb-16 md:mb-20"
        >
          <div
            ref={viewportRef}
            className="relative z-10 h-[440px] cursor-grab overflow-visible active:cursor-grabbing md:h-[520px]"
            style={{ perspective: '1400px', touchAction: 'pan-y' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
              if (!dragState.current.active) setPaused(false);
            }}
            role="region"
            aria-label="Stage gallery infinite carousel"
          >
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              {loopCards.map((card, i) => {
                const logical = i - baseIndex;
                const cardCenter = logical * STEP + CARD_W / 2 - offset + viewportW / 2;
                const rel = cardCenter - viewportW / 2;
                const normalized = rel / STEP;
                const style = styleForOffset(normalized);

                if (Math.abs(normalized) > 4.2) return null;

                const left = cardCenter - CARD_W / 2;

                return (
                  <article
                    key={`${card.id}-${i}`}
                    className="absolute top-1/2 will-change-transform"
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      left,
                      marginTop: -CARD_H / 2,
                      zIndex: style.zIndex,
                      opacity: style.opacity,
                      transform: `translate3d(0, 0, ${style.translateZ}px) rotateY(${style.rotateY}deg) scale(${style.scale})`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      className={`relative h-full w-full overflow-hidden rounded-[24px] border bg-[#111111] shadow-[0_24px_60px_rgba(0,0,0,0.65)] ${
                        style.isCenter ? 'border-white/25' : 'border-white/[0.08]'
                      }`}
                    >
                      <Image
                        src={card.src}
                        alt={card.label}
                        fill
                        loading="lazy"
                        sizes="280px"
                        className="object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/45 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-[16px]">
                        {card.label}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-2 text-center md:grid-cols-3 md:gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.45 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
