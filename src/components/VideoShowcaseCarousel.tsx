'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOW_VIDEOS, resolveVideoSrc } from '@/utils/media';

type Clip = { title: string; src: string };

const ease = [0.22, 1, 0.36, 1] as const;

function wrapIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

function useViewport() {
  const [vp, setVp] = useState({ w: 1024, narrow: false });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVp({ w, narrow: w < 640 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return vp;
}

export default function VideoShowcaseCarousel() {
  const reduceMotion = useReducedMotion();
  const { narrow } = useViewport();
  const [clips, setClips] = useState<Clip[]>(SHOW_VIDEOS);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const touchStartX = useRef<number | null>(null);

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

  const len = clips.length;
  const go = useCallback(
    (dir: number) => {
      setActive((a) => wrapIndex(a + dir, len));
    },
    [len]
  );

  useEffect(() => {
    if (paused || reduceMotion || len < 2) return;
    const id = window.setInterval(() => go(1), 4200);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, len, go]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      const dist = Math.min(
        Math.abs(index - active),
        Math.abs(index - active + len),
        Math.abs(index - active - len)
      );
      if (dist <= 1) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    });
  }, [active, len, clips]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) > 48) go(delta < 0 ? 1 : -1);
    window.setTimeout(() => setPaused(false), 1800);
  };

  const relativeOffset = (index: number) => {
    let d = index - active;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;
    return d;
  };

  const stepPx = narrow ? 150 : 220;

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-black py-14 sm:py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[42%] max-w-4xl rounded-full bg-[#3A8FB8]/10 blur-[90px]"
      />

      <div className="relative mx-auto mb-8 max-w-7xl px-4 sm:px-6 md:mb-12 md:px-8">
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
        className="relative mx-auto h-[min(72vw,400px)] w-full max-w-7xl px-2 sm:h-[min(58vw,460px)] sm:px-4 md:h-[520px] md:px-8"
        style={{ perspective: '1400px' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
          {clips.map((clip, i) => {
            const offset = relativeOffset(i);
            if (Math.abs(offset) > 2) return null;
            const abs = Math.abs(offset);
            const isCenter = offset === 0;
            const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.62;
            const rotateY = reduceMotion ? 0 : offset * -16;
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.58 : 0.25;
            const z = abs === 0 ? 40 : abs === 1 ? 12 : 2;

            return (
              <motion.article
                key={`${clip.src}-${i}`}
                className="absolute left-1/2 top-1/2 aspect-[9/16] w-[min(68vw,260px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:w-[min(42vw,290px)] sm:rounded-3xl md:w-[310px]"
                style={{ transformStyle: 'preserve-3d', zIndex: z }}
                animate={{
                  x: offset * stepPx,
                  scale,
                  rotateY,
                  opacity,
                }}
                transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.8 }}
                onClick={() => {
                  if (!isCenter) setActive(i);
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
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: abs === 0 ? 'brightness(1)' : 'brightness(0.55)' }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <AnimatePresence>
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.35, ease }}
                      className="absolute inset-x-0 bottom-0 p-4 sm:p-5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3A8FB8]">
                        Now playing
                      </p>
                      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
                        {clip.title}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {isCenter && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#3A8FB8]/35 sm:rounded-3xl"
                  />
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
        <button
          type="button"
          onClick={() => go(-1)}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Previous videos"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Next videos"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2 px-4">
        {clips.map((clip, i) => (
          <button
            key={`dot-${clip.src}-${i}`}
            type="button"
            aria-label={`Show ${clip.title}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-7 bg-accent' : 'w-2 bg-white/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
