'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOW_VIDEOS, resolveVideoSrc } from '@/utils/media';
import MediaLightbox, { type LightboxMedia } from '@/components/MediaLightbox';
import OptimizedVideo from '@/components/OptimizedVideo';

type Clip = { title: string; src: string };

const ease = [0.22, 1, 0.36, 1] as const;

/** Cinema-lane drift — balanced for a smooth left/right feel */
const SPEED = 0.22;
const EASE_TO_TARGET = 7.5;
const DRAG_FRICTION = 4.8;
const FADE_START = 2.4;
const FADE_END = 3.2;

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

function laneTransform(offset: number, isMobile: boolean, progress: number) {
  const abs = Math.abs(offset);
  const spacing = isMobile ? 248 : 360;
  const depth = isMobile ? 105 : 155;

  const x = offset * spacing;
  const float = Math.sin(offset * 1.05 + progress * 1.15) * (isMobile ? 3 : 6);
  const y = abs * abs * (isMobile ? 3 : 5.5) + float;
  const rotateY = offset * (isMobile ? -12 : -14);
  const scale = 1 - Math.min(abs, 2.5) * (isMobile ? 0.04 : 0.05);
  const z = -abs * depth;
  const opacity = 0.22 + 0.78 * edgeFade(abs);
  const zIndex = Math.round(40 - abs * 10);
  const brightness = 1 - Math.min(abs, 2) * 0.16;

  return { x, y, rotateY, scale, z, opacity, zIndex, brightness };
}

export default function VideoShowcaseCarousel() {
  const reduceMotion = useReducedMotion();
  const [clips, setClips] = useState<Clip[]>(SHOW_VIDEOS);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null);
  const progressRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startProgress: number;
    lastX: number;
    lastT: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const spacing = isMobile ? 248 : 360;
  const total = clips.length;

  const clearResumeTimer = useCallback(() => {
    if (resumeTimer.current != null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  const scheduleResume = useCallback(
    (ms = 1100) => {
      clearResumeTimer();
      resumeTimer.current = window.setTimeout(() => {
        setPaused(false);
        resumeTimer.current = null;
      }, ms);
    },
    [clearResumeTimer]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/public/data?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.videos?.length) return;
        const mapped: Clip[] = data.videos
          .map((v: { title?: string; video_url?: string }, i: number) => {
            const fallback = SHOW_VIDEOS[i % SHOW_VIDEOS.length]?.src || '';
            const src = resolveVideoSrc(v.video_url || '', fallback);
            return { title: v.title || SHOW_VIDEOS[i % SHOW_VIDEOS.length]?.title || 'Show', src };
          })
          .filter((c: Clip) => Boolean(c.src));
        if (!cancelled && mapped.length) setClips(mapped);
      } catch {
        /* keep static fallback */
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
    pausedRef.current = paused || Boolean(lightbox);
  }, [paused, lightbox]);

  useEffect(() => {
    return () => clearResumeTimer();
  }, [clearResumeTimer]);

  useEffect(() => {
    if (reduceMotion || total < 2) return;

    const tick = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(0.042, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      if (!document.hidden) {
        if (dragRef.current?.active) {
          // live drag handled in pointermove
        } else if (targetRef.current != null) {
          const current = progressRef.current;
          const target = targetRef.current;
          const diff = shortestDiff(current, target, total);
          if (Math.abs(diff) < 0.004) {
            progressRef.current = ((target % total) + total) % total;
            targetRef.current = null;
            velocityRef.current = 0;
          } else {
            const step = diff * Math.min(1, EASE_TO_TARGET * dt);
            progressRef.current = (current + step + total) % total;
          }
        } else if (Math.abs(velocityRef.current) > 0.02) {
          progressRef.current = (progressRef.current + velocityRef.current * dt + total) % total;
          const decay = Math.exp(-DRAG_FRICTION * dt);
          velocityRef.current *= decay;
          if (Math.abs(velocityRef.current) < 0.05) {
            velocityRef.current = 0;
            const nearest = Math.round(progressRef.current);
            targetRef.current = ((nearest % total) + total) % total;
          }
        } else if (!pausedRef.current) {
          progressRef.current = (progressRef.current + SPEED * dt) % total;
        }
        setProgress(progressRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [total, reduceMotion]);

  useEffect(() => {
    if (total === 0) return;
    videoRefs.current.forEach((video, index) => {
      const offset = Math.abs(wrapOffset(index - progress, total));
      if (offset < 0.85) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [progress, total, clips]);

  const activeIndex = ((Math.round(progress) % total) + total) % total;

  const goTo = useCallback(
    (index: number) => {
      if (total < 2) return;
      velocityRef.current = 0;
      targetRef.current = ((index % total) + total) % total;
    },
    [total]
  );

  const nudge = useCallback(
    (dir: -1 | 1) => {
      if (total < 2) return;
      const nearest = Math.round(progressRef.current);
      goTo(nearest + dir);
    },
    [goTo, total]
  );

  const openClip = useCallback(
    (clip: Clip, index: number) => {
      const src = resolveVideoSrc(clip.src, clip.src);
      if (!src) return;
      goTo(index);
      setLightbox({ type: 'video', src, title: clip.title });
    },
    [goTo]
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    clearResumeTimer();
    setPaused(true);
    targetRef.current = null;
    velocityRef.current = 0;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startProgress: progressRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      moved: false,
      pointerId: e.pointerId,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag?.active || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 6) drag.moved = true;
    const deltaCards = -dx / spacing;
    progressRef.current = (drag.startProgress + deltaCards + total * 8) % total;
    setProgress(progressRef.current);

    const now = performance.now();
    const dt = Math.max(0.008, (now - drag.lastT) / 1000);
    const vx = (e.clientX - drag.lastX) / dt;
    // Convert px/s drag into cards/s
    velocityRef.current = -vx / spacing;
    drag.lastX = e.clientX;
    drag.lastT = now;
  };

  const endDrag = (e: React.PointerEvent, clip?: Clip, index?: number) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    drag.active = false;
    dragRef.current = null;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (!drag.moved) {
      if (clip != null && index != null) openClip(clip, index);
      scheduleResume(400);
      return;
    }

    // Fling or settle to nearest card
    if (Math.abs(velocityRef.current) > 0.9) {
      // keep inertia; resume autoplay after settle
      scheduleResume(1800);
    } else {
      velocityRef.current = 0;
      const nearest = Math.round(progressRef.current);
      targetRef.current = ((nearest % total) + total) % total;
      scheduleResume(1400);
    }
  };

  const cardW = isMobile ? 248 : 340;

  return (
    <section className="relative isolate overflow-x-clip border-b border-white/10 bg-black py-14 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[48%] mx-auto h-[45%] max-w-5xl rounded-full bg-[#3A8FB8]/12 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3A8FB8]/40 to-transparent"
      />

      <div className="relative z-20 mx-auto mb-8 max-w-7xl px-4 sm:mb-10 sm:px-6 md:mb-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="mb-4 flex items-center justify-center gap-3 md:justify-start">
            <span className="h-px w-8 bg-[#3A8FB8]" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3A8FB8] md:text-xs md:tracking-[0.22em]">
              Parth Production
            </p>
            <span className="h-px w-8 bg-[#3A8FB8]" aria-hidden />
          </div>
          <h2 className="text-center font-display text-[clamp(1.85rem,4.8vw,3rem)] font-bold uppercase leading-[1.08] tracking-tight text-white md:text-left md:text-5xl">
            <span className="block">Beyond Events.</span>
            <span className="mt-1.5 block whitespace-nowrap font-serif text-[clamp(1.2rem,3.9vw,2.5rem)] font-medium normal-case italic leading-[1.2] tracking-normal text-[#3A8FB8] md:mt-2 md:text-[2.65rem]">
              We Create Experiences
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-white/70 md:mx-0 md:text-left md:text-lg">
            Experience our finest DJ, lighting, stage, and event productions.
          </p>
        </motion.div>
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-1 sm:px-4 md:px-8"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e)}
        onPointerCancel={(e) => endDrag(e)}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-3 z-20 hidden h-3 items-center justify-between sm:flex md:inset-x-10"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="h-2 w-2 rounded-[2px] bg-white/15" />
          ))}
        </div>

        <div
          className="relative mx-auto h-[560px] w-full overflow-hidden touch-pan-y sm:h-[580px] md:h-[720px]"
          style={{ perspective: isMobile ? '1100px' : '1700px' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-6 bg-gradient-to-r from-black via-black/75 to-transparent sm:w-14 md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-30 w-6 bg-gradient-to-l from-black via-black/75 to-transparent sm:w-14 md:w-24"
          />

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {clips.map((clip, i) => {
              const offset = wrapOffset(i - progress, total);
              if (Math.abs(offset) > FADE_END) return null;

              const t = laneTransform(offset, isMobile, progress);
              const isCenter = i === activeIndex;

              return (
                <article
                  key={`${clip.src}-${i}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${clip.title} video`}
                  className="absolute left-1/2 top-1/2 aspect-[9/16] cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_32px_70px_rgba(0,0,0,0.6)] will-change-transform touch-manipulation active:cursor-grabbing sm:rounded-3xl"
                  style={{
                    width: cardW,
                    marginLeft: -cardW / 2,
                    marginTop: isMobile ? -222 : -304,
                    transformStyle: 'preserve-3d',
                    zIndex: t.zIndex,
                    opacity: t.opacity,
                    transform: `translate3d(${t.x}px, ${t.y}px, ${t.z}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onPointerDown(e);
                  }}
                  onPointerMove={(e) => {
                    e.stopPropagation();
                    onPointerMove(e);
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    endDrag(e, clip, i);
                  }}
                  onPointerCancel={(e) => {
                    e.stopPropagation();
                    endDrag(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openClip(clip, i);
                    }
                  }}
                  aria-current={isCenter ? 'true' : undefined}
                >
                  <OptimizedVideo
                    ref={(el) => {
                      if (el) videoRefs.current.set(i, el);
                      else videoRefs.current.delete(i);
                    }}
                    src={clip.src}
                    muted
                    loop
                    playsInline
                    preload={isCenter ? 'auto' : 'metadata'}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    style={{ filter: `brightness(${t.brightness})` }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25" />

                  {isCenter && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#3A8FB8]/55 sm:rounded-3xl"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3A8FB8] sm:text-[10px]">
                      {isCenter ? 'Tap to open' : 'Clip'}
                    </p>
                    <p className="mt-1 font-display text-base font-bold uppercase tracking-tight text-white sm:text-lg md:text-xl">
                      {clip.title}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-7 hidden items-center justify-center gap-3 md:mt-9 md:flex">
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            nudge(-1);
            scheduleResume(1400);
          }}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Previous videos"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            nudge(1);
            scheduleResume(1400);
          }}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Next videos"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-20 mt-4 flex flex-wrap justify-center gap-2 px-4 sm:mt-5">
        {clips.map((clip, i) => (
          <button
            key={`dot-${clip.src}-${i}`}
            type="button"
            aria-label={`Show ${clip.title}`}
            onClick={() => {
              setPaused(true);
              goTo(i);
              scheduleResume(1400);
            }}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? 'w-7 bg-accent' : 'w-2 bg-white/25'
            }`}
          />
        ))}
      </div>

      <MediaLightbox media={lightbox} onClose={closeLightbox} />
    </section>
  );
}
