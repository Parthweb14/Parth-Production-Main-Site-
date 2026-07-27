'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SHOW_VIDEOS, resolveVideoSrc } from '@/utils/media';

type Clip = { title: string; src: string };

const ease = [0.22, 1, 0.36, 1] as const;

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1100) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

export default function VideoShowcaseCarousel() {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [clips, setClips] = useState<Clip[]>(SHOW_VIDEOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const visible = useVisibleCount();
  const pageCount = Math.max(1, Math.ceil(clips.length / visible));

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
    const id = window.setTimeout(() => {
      setPage((p) => Math.min(p, pageCount - 1));
    }, 0);
    return () => window.clearTimeout(id);
  }, [pageCount]);

  // Play videos that are mostly visible in the scroller
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const videos = Array.from(root.querySelectorAll('video'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const idx = Number(video.dataset.index || 0);
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            void video.play().catch(() => undefined);
            setActiveIndex(idx);
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: [0.4, 0.65] }
    );

    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [clips, visible]);

  // Gentle auto-advance pages on desktop/tablet
  useEffect(() => {
    if (reduceMotion || pageCount < 2) return;
    const id = window.setInterval(() => {
      setPage((p) => {
        const next = (p + 1) % pageCount;
        const el = scrollerRef.current;
        if (el) el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
        return next;
      });
    }, 5500);
    return () => window.clearInterval(id);
  }, [pageCount, reduceMotion, clips.length]);

  const goToPage = (next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(pageCount - 1, next));
    setPage(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  const gap = visible === 1 ? 0 : visible === 2 ? 'gap-3 sm:gap-4' : 'gap-3 md:gap-5';
  const cardWidth =
    visible === 1
      ? 'w-[85%] mx-[7.5%]'
      : visible === 2
        ? 'w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1rem)/2)]'
        : 'w-[calc((100%-1.5rem)/3)] md:w-[calc((100%-2.5rem)/3)]';

  return (
    <section className="relative isolate overflow-x-clip border-b border-white/10 bg-black py-14 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[45%] mx-auto h-[36%] max-w-5xl rounded-full bg-[#3A8FB8]/08 blur-[100px]"
      />

      {/* Header — own stacking context, never overlapped by video stage */}
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

      {/* Multi-video stage — clipped so cards cannot bleed into header */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="overflow-hidden rounded-none">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className={`flex ${gap} snap-x snap-mandatory overflow-x-auto scrollbar-none pb-1`}
          >
            {clips.map((clip, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.article
                  key={`${clip.src}-${i}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: (i % visible) * 0.07, duration: 0.45, ease }}
                  className={`relative ${cardWidth} aspect-[9/16] flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:snap-start`}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: reduceMotion ? 1 : isActive ? 1.04 : 1,
                    }}
                    transition={{ duration: 0.7, ease }}
                  >
                    <video
                      data-index={i}
                      src={clip.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </motion.div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />

                  {/* Soft accent rim on active */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 sm:rounded-3xl ${
                      isActive ? 'opacity-100 ring-1 ring-[#3A8FB8]/40' : 'opacity-0'
                    }`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 md:p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3A8FB8] sm:text-[10px]">
                      {isActive ? 'Now playing' : 'Clip'}
                    </p>
                    <p className="mt-1 font-display text-base font-bold uppercase tracking-tight text-white sm:text-lg md:text-xl">
                      {clip.title}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-7 flex items-center justify-center gap-3 sm:mt-9">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Previous videos"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent"
          aria-label="Next videos"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-20 mt-4 flex justify-center gap-2 px-4 sm:mt-5">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Jump to video page ${i + 1}`}
            onClick={() => goToPage(i)}
            className={`h-2 rounded-full transition-all ${
              i === page ? 'w-7 bg-accent' : 'w-2 bg-white/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
