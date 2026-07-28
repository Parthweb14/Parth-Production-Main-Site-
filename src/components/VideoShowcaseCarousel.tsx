'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { SHOW_VIDEOS, resolveVideoSrc } from '@/utils/media';
import MediaLightbox, { type LightboxMedia } from '@/components/MediaLightbox';

type Clip = { title: string; src: string };

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Director's Monitor — featured reel + vertical clip rail.
 * Completely different from the previous 3D cinema lane.
 */
export default function VideoShowcaseCarousel() {
  const reduceMotion = useReducedMotion();
  const [clips, setClips] = useState<Clip[]>(SHOW_VIDEOS);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null);
  const [paused, setPaused] = useState(false);
  const featureRef = useRef<HTMLVideoElement>(null);
  const total = clips.length;
  const safeActive = total > 0 ? Math.min(active, total - 1) : 0;
  const current = clips[safeActive] || clips[0];

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
        /* keep fallback */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance featured clip
  useEffect(() => {
    if (paused || reduceMotion || total < 2 || lightbox) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % total);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, total, lightbox]);

  useEffect(() => {
    const el = featureRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => undefined);
  }, [safeActive, current?.src]);

  const openActive = useCallback(() => {
    if (!current?.src) return;
    setLightbox({ type: 'video', src: current.src, title: current.title });
  }, [current]);

  const go = (dir: number) => {
    if (total < 2) return;
    setActive((a) => (a + dir + total) % total);
  };

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-black py-14 sm:py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[50%] max-w-5xl -translate-y-1/2 rounded-full bg-[#3A8FB8]/08 blur-[120px]"
      />

      <div className="relative mx-auto mb-8 max-w-7xl px-4 sm:mb-10 sm:px-6 md:mb-12 md:px-8">
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 md:gap-6 md:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.75fr)]">
        {/* Featured monitor */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="relative"
        >
          <button
            type="button"
            onClick={openActive}
            className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-white/10 bg-black text-left shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-[28px] md:aspect-[16/9]"
            aria-label={`Open ${current?.title || 'video'}`}
          >
            <AnimatePresence mode="wait">
              <motion.video
                key={current?.src || 'empty'}
                ref={featureRef}
                src={current?.src}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                initial={{ opacity: 0.4, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-md">
                <Play className="h-7 w-7 fill-white" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3A8FB8]">
                  Now featuring
                </p>
                <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-white sm:text-2xl md:text-3xl">
                  {current?.title}
                </p>
              </div>
              <p className="font-display text-sm font-semibold text-white/50">
                {String(safeActive + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>
          </button>

          <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
              aria-label="Previous video"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
              aria-label="Next video"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Clip rail */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease }}
          className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[min(62vh,560px)] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1"
        >
          {clips.map((clip, i) => {
            const isActive = i === safeActive;
            return (
              <button
                key={`${clip.src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                onDoubleClick={() =>
                  setLightbox({ type: 'video', src: clip.src, title: clip.title })
                }
                className={`relative flex min-w-[72%] flex-shrink-0 items-stretch overflow-hidden rounded-2xl border text-left transition-all sm:min-w-[46%] lg:min-w-0 lg:w-full ${
                  isActive
                    ? 'border-[#3A8FB8]/55 bg-[#3A8FB8]/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
              >
                <div className="relative aspect-[9/14] w-[88px] flex-shrink-0 sm:w-[100px]">
                  <video
                    src={clip.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-3 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3A8FB8]">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold uppercase tracking-tight text-white sm:text-base">
                    {clip.title}
                  </p>
                  <p className="mt-1 text-[11px] text-white/45">
                    {isActive ? 'Playing · tap main to open' : 'Select clip'}
                  </p>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

      <MediaLightbox media={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
