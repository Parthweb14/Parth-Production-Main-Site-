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
  const spacing = isMobile ? 164 : 232;
  const depth = isMobile ? 80 : 120;

  const x = offset * spacing;
  const float = Math.sin(offset * 1.05 + progress * 1.15) * (isMobile ? 3.5 : 6.5);
  const y = abs * abs * (isMobile ? 2.5 : 4.5) + float;
  const rotateY = offset * (isMobile ? -12 : -17);
  const scale = 1 - Math.min(abs, 2.5) * (isMobile ? 0.055 : 0.07);
  const z = -abs * depth;
  const opacity = 0.22 + 0.78 * edgeFade(abs);
  const zIndex = Math.round(40 - abs * 10);
  const brightness = 1 - Math.min(abs, 2) * 0.2;

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

  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    didSwipe.current = false;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) > 40) {
      didSwipe.current = true;
      nudge(delta < 0 ? 1 : -1);
      window.setTimeout(() => {
        didSwipe.current = false;
      }, 400);
    }
    window.setTimeout(() => setPaused(false), 2200);
  };

  const handleClipClick = useCallback(
    (clip: Clip, index: number) => {
      if (didSwipe.current) {
        didSwipe.current = false;
        return;
      }
      openClip(clip, index);
    },
    [openClip]
  );

  const cardW = isMobile ? 148 : 220;

  return (
    <section className="relative isolate overflow-x-clip border-b border-white/10 bg-black py-14 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[48%] mx-auto h-[40%] max-w-4xl rounded-full bg-[#3A8FB8]/10 blur-[110px]"
      />

      <div className="relative z-20 mx-auto mb-8 max-w-7xl px-4 sm:mb-10 sm:px-6 md:mb-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Parth Production
          </p>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
            Beyond Events. We Create Experiences
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Experience our finest DJ, lighting, stage, and event productions.
          </p>
        </motion.div>
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-2 sm:px-4 md:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="relative mx-auto h-[360px] w-full overflow-hidden sm:h-[430px] md:h-[510px]"
          style={{ perspective: isMobile ? '950px' : '1500px' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-10 bg-gradient-to-r from-black via-black/80 to-transparent sm:w-16 md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-30 w-10 bg-gradient-to-l from-black via-black/80 to-transparent sm:w-16 md:w-24"
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
                  className="absolute left-1/2 top-1/2 aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_28px_60px_rgba(0,0,0,0.55)] will-change-transform sm:rounded-3xl"
                  style={{
                    width: cardW,
                    marginLeft: -cardW / 2,
                    marginTop: isMobile ? -132 : -196,
                    transformStyle: 'preserve-3d',
                    zIndex: t.zIndex,
                    opacity: t.opacity,
                    transform: `translate3d(${t.x}px, ${t.y}px, ${t.z}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                  }}
                  onClick={() => handleClipClick(clip, i)}
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
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: `brightness(${t.brightness})` }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity duration-300 ${
                      isCenter ? 'opacity-100 ring-1 ring-[#3A8FB8]/45' : 'opacity-0'
                    }`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3A8FB8] sm:text-[10px]">
                      {isCenter ? 'Now playing' : 'Clip'}
                    </p>
                    <p className="mt-0.5 font-display text-sm font-bold uppercase tracking-tight text-white sm:text-base md:text-lg">
                      {clip.title}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-7 flex items-center justify-center gap-3 sm:mt-9">
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
