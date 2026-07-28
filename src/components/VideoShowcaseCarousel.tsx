'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOW_VIDEOS, resolveVideoSrc } from '@/utils/media';
import MediaLightbox, { type LightboxMedia } from '@/components/MediaLightbox';

type Clip = { title: string; src: string };

const ease = [0.22, 1, 0.36, 1] as const;

/** Continuous cinema-lane drift — slower/smoother than stage gallery */
const SPEED = 0.26;
const EASE_TO_TARGET = 5.2;
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

/**
 * Cinema spotlight lane — different from stage gallery's circular arc.
 * Perspective aisle (rotateY + depth), soft center lift, gentle float.
 */
function laneTransform(offset: number, isMobile: boolean, progress: number) {
  const abs = Math.abs(offset);
  const spacing = isMobile ? 248 : 360;
  const depth = isMobile ? 105 : 155;

  const x = offset * spacing;
  const float = Math.sin(offset * 1.05 + progress * 1.15) * (isMobile ? 4 : 8);
  const y = abs * abs * (isMobile ? 3 : 5.5) + float;
  const rotateY = offset * (isMobile ? -14 : -16);
  const scale = 1 - Math.min(abs, 2.5) * (isMobile ? 0.045 : 0.055);
  const z = -abs * depth;
  const opacity = 0.22 + 0.78 * edgeFade(abs);
  const zIndex = Math.round(40 - abs * 10);
  const brightness = 1 - Math.min(abs, 2) * 0.18;

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
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const total = clips.length;

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
  }, []);

  useEffect(() => {
    if (reduceMotion || total < 2) return;

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
      if (offset < 0.9) {
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

  // Pointer-based tap detection — reliable on iOS/Android (click often fails on 3D transforms)
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const resumeTimer = useRef<number | null>(null);

  const clearResumeTimer = () => {
    if (resumeTimer.current != null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  const scheduleResume = (ms = 900) => {
    clearResumeTimer();
    resumeTimer.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimer.current = null;
    }, ms);
  };

  const onStagePointerDown = (e: React.PointerEvent) => {
    // Do not pause autoplay on touch-down — vertical page scroll was leaving it paused forever
    // when browsers fire pointercancel instead of pointerup.
    if (e.pointerType !== 'touch') setPaused(true);
    pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };

  const onStagePointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== e.pointerId) {
      scheduleResume(200);
      return;
    }
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 36) {
      // Horizontal swipe → nudge; vertical scroll → ignore (page scroll)
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
        setPaused(true);
        nudge(dx < 0 ? 1 : -1);
        scheduleResume(1600);
        return;
      }
      scheduleResume(120);
      return;
    }

    scheduleResume(200);
  };

  const onCardPointerUp = (e: React.PointerEvent, clip: Clip, index: number) => {
    e.stopPropagation();
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) {
      openClip(clip, index);
      return;
    }
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 36) {
      openClip(clip, index);
      scheduleResume(400);
    } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
      setPaused(true);
      nudge(dx < 0 ? 1 : -1);
      scheduleResume(1600);
    } else {
      scheduleResume(120);
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
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onStagePointerDown}
        onPointerUp={onStagePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
          scheduleResume(80);
        }}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Film-frame marks */}
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
                  className="absolute left-1/2 top-1/2 aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_32px_70px_rgba(0,0,0,0.6)] will-change-transform touch-manipulation sm:rounded-3xl"
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
                    pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
                  }}
                  onPointerUp={(e) => onCardPointerUp(e, clip, i)}
                  onPointerCancel={() => {
                    pointerStart.current = null;
                    scheduleResume(80);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openClip(clip, i);
                    }
                  }}
                  aria-current={isCenter ? 'true' : undefined}
                >
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(i, el);
                      else videoRefs.current.delete(i);
                    }}
                    src={clip.src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
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
          onClick={() => nudge(-1)}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Previous videos"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
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
            onClick={() => goTo(i)}
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
