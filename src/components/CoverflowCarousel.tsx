'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STAGE_IMAGES, resolveGallerySrc } from '@/utils/media';
import { fetchPublicData } from '@/utils/publicDataCache';
import MediaLightbox, { type LightboxMedia } from '@/components/MediaLightbox';

type StageCard = { id: number | string; label: string; src: string };

const DEFAULT_CARDS: StageCard[] = [
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
const SWIPE_PX = 140;
const RESUME_MS = 1800;

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
  const rotateZ = ((angle * 180) / Math.PI) * 0.32;
  const scale = 1;
  const opacity = 0.92 * edgeFade(abs);
  const zIndex = Math.round(50 - abs * 8);

  return { x, y, rotateZ, scale, opacity, zIndex };
}

export default function CoverflowCarousel() {
  const [cards, setCards] = useState<StageCard[]>(DEFAULT_CARDS);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startProgress: number;
    mode: 'undecided' | 'h' | 'v';
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const total = cards.length;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPublicData();
        const stageRaw = (data.stage_gallery as unknown[])?.length
          ? (data.stage_gallery as { id?: string; title?: string; image_url?: string }[])
          : (data.vibrants as { id?: string; title?: string; image_url?: string }[] | undefined);
        if (!stageRaw?.length) return;
        const mapped: StageCard[] = stageRaw.map((item, i) => {
          const fallback = DEFAULT_CARDS[i % DEFAULT_CARDS.length];
          return {
            id: item.id || `stage-${i + 1}`,
            label: item.title || fallback.label,
            src: resolveGallerySrc(item.image_url || '', fallback.src),
          };
        });
        if (!cancelled && mapped.length) setCards(mapped);
      } catch {
        /* keep defaults */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        inViewRef.current = visible;
        setInView(visible);
      },
      { rootMargin: '160px 0px', threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const clearResume = useCallback(() => {
    if (resumeTimer.current != null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  const scheduleResume = useCallback(
    (ms = RESUME_MS) => {
      clearResume();
      resumeTimer.current = window.setTimeout(() => {
        pausedRef.current = false;
        resumeTimer.current = null;
      }, ms);
    },
    [clearResume]
  );

  useEffect(() => () => clearResume(), [clearResume]);

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      if (!document.hidden && !lightbox && inViewRef.current) {
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
          setProgress(progressRef.current);
        } else if (!pausedRef.current) {
          progressRef.current = (progressRef.current + SPEED * dt) % total;
          setProgress(progressRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [total, lightbox]);

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

  const openCard = useCallback(
    (card: StageCard, index: number) => {
      goTo(index);
      setLightbox({ type: 'image', src: card.src, title: card.label });
    },
    [goTo]
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);

  /** Manual touch / mouse slide on the infinite stage strip */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pausedRef.current = true;
      clearResume();
      targetRef.current = null;
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startProgress: progressRef.current,
        mode: 'undecided',
        moved: false,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (d.mode === 'undecided') {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        d.mode = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'h' : 'v';
        if (d.mode === 'h') {
          try {
            el.setPointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        } else {
          // Vertical page scroll — release carousel control
          dragRef.current = null;
          scheduleResume(400);
          return;
        }
      }

      if (d.mode === 'h') {
        e.preventDefault();
        d.moved = true;
        const next = (d.startProgress - dx / SWIPE_PX + total * 10) % total;
        progressRef.current = next;
        setProgress(next);
      }
    };

    const endDrag = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      dragRef.current = null;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      if (d.mode === 'h' && d.moved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 280);
        const nearestIdx = Math.round(progressRef.current);
        goTo(nearestIdx);
        scheduleResume(RESUME_MS);
        return;
      }

      scheduleResume(600);
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    el.addEventListener('pointermove', onPointerMove, { passive: false });
    el.addEventListener('pointerup', endDrag, { passive: true });
    el.addEventListener('pointercancel', endDrag, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointercancel', endDrag);
    };
  }, [total, goTo, scheduleResume, clearResume]);

  const cardW = isMobile ? 148 : 208;
  const cardH = isMobile ? 216 : 304;
  const nearest = ((Math.round(progress) % total) + total) % total;

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden bg-black pt-14 pb-16 md:pt-20 md:pb-24"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[100px] md:h-[480px] md:w-[480px]"
        animate={inView ? { opacity: [0.4, 0.65, 0.4] } : { opacity: 0.4 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center md:mb-16"
        >
          <span className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Our Productions
          </span>
          <h2 className="whitespace-nowrap font-display text-[clamp(1.65rem,5vw,3rem)] font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
            <span className="uppercase">Stage </span>
            <span className="font-serif font-medium normal-case italic tracking-normal text-[#3A8FB8]">
              Gallery
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/50 md:text-[15px]">
            Built for the big night — LED walls, luxury weddings, corporate stages, concerts, and
            immersive DJ performances from the Parth Production floor.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/35 md:hidden">
            Swipe to browse
          </p>
        </motion.div>

        <div
          ref={stageRef}
          className="relative mx-auto mb-8 flex h-[380px] touch-pan-y items-start justify-center md:h-[500px] lg:h-[540px]"
          style={{ touchAction: 'pan-y' }}
        >
          <div className="relative h-full w-full max-w-6xl select-none">
            {cards.map((card, index) => {
              const offset = wrapOffset(index - progress, total);
              const abs = Math.abs(offset);
              if (abs > FADE_END) return null;

              const t = cardTransform(offset, isMobile);
              const isNearest = index === nearest;

              return (
                <div
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${card.label}`}
                  onClick={() => {
                    if (suppressClickRef.current) return;
                    openCard(card, index);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCard(card, index);
                    }
                  }}
                  className="absolute left-1/2 top-0 cursor-grab will-change-transform active:cursor-grabbing"
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
                      className="pointer-events-none object-cover"
                      draggable={false}
                      loading={isNearest || abs < 1.2 ? 'eager' : 'lazy'}
                      priority={isNearest}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span
                      className={`pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur transition-all duration-300 ${
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
          </div>
        </div>

        <div className="mb-10 flex items-center justify-center gap-4 md:mb-12">
          <button
            type="button"
            onClick={() => {
              pausedRef.current = true;
              nudge(-1);
              scheduleResume(RESUME_MS);
            }}
            aria-label="Previous stage"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-white/35 hover:bg-white/[0.08]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {cards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                aria-label={`Go to ${card.label}`}
                onClick={() => {
                  pausedRef.current = true;
                  goTo(i);
                  scheduleResume(RESUME_MS);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === nearest ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              pausedRef.current = true;
              nudge(1);
              scheduleResume(RESUME_MS);
            }}
            aria-label="Next stage"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-white/35 hover:bg-white/[0.08]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-[#3A8FB8]/40 bg-[#3A8FB8]/10 px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#3A8FB8] transition-all hover:border-[#3A8FB8]/70 hover:bg-[#3A8FB8]/18 hover:shadow-[0_0_24px_rgba(58,143,184,0.3)]"
          >
            View All Projects
          </Link>
        </div>
      </div>

      <MediaLightbox media={lightbox} onClose={closeLightbox} />
    </motion.section>
  );
}
