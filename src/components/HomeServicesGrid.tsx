'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, STAGE_IMAGES } from '@/utils/media';

const ease = [0.22, 1, 0.36, 1] as const;
const FEATURED_WIDE = STAGE_IMAGES[1]?.src || CRAFT[0].image;
const AUTO_MS = 3400;

function CraftCard({
  service,
  index,
  reduceMotion,
}: {
  service: (typeof CRAFT)[number];
  index: number;
  reduceMotion: boolean | null;
}) {
  return (
    <article className="group relative h-[420px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-black sm:h-[460px] md:h-[520px] lg:h-[560px]">
      <MediaImage
        src={service.image}
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3A8FB8]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {!reduceMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0"
        />
      )}

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
        <p className="font-display text-sm font-semibold tabular-nums tracking-[0.2em] text-white/35">
          0{index + 1}
        </p>
        <span className="h-px w-10 bg-[#3A8FB8]/60" aria-hidden />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white md:text-[1.65rem]">
          {service.title}
        </h3>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/72 md:text-sm">
          {service.copy}
        </p>
      </div>
    </article>
  );
}

/**
 * Mobile: CSS transform slider (no native overflow scroll = no snap/jitter).
 * Desktop: 3-column grid.
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const startXRef = useRef(0);
  const resumeTimer = useRef<number | null>(null);
  const total = CRAFT.length;

  const pauseBriefly = useCallback((ms = 5000) => {
    setPaused(true);
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimer.current = null;
    }, ms);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % total) + total) % total);
      setDragX(0);
    },
    [total]
  );

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      if (paused || document.hidden || dragging) return;
      if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
      setActive((i) => (i + 1) % total);
      setDragX(0);
    }, AUTO_MS);
    return () => {
      window.clearInterval(id);
      if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    };
  }, [paused, reduceMotion, total, dragging]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pauseBriefly(6000);
    startXRef.current = e.clientX;
    setDragging(true);
    setDragX(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragX(e.clientX - startXRef.current);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startXRef.current;
    setDragging(false);
    const threshold = Math.min(64, window.innerWidth * 0.16);
    if (dx <= -threshold) goTo(active + 1);
    else if (dx >= threshold) goTo(active - 1);
    else setDragX(0);
    pauseBriefly(5000);
  };

  return (
    <section className="relative w-full overflow-hidden bg-black py-14 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3A8FB8]/35 to-transparent"
      />

      <div className="relative mx-auto w-[92%] max-w-[1260px] px-0 sm:w-[90%] md:w-[90%]">
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#3A8FB8]" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3A8FB8] md:text-[12px]">
                Designed For Every Celebration
              </p>
              <span className="h-px w-8 bg-[#3A8FB8]" aria-hidden />
            </div>

            <h2 className="font-display text-[clamp(1.55rem,5.2vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-white">
              <span className="block whitespace-nowrap">Bringing Every Moment</span>
              <span className="mt-1.5 block whitespace-nowrap font-serif text-[clamp(1.45rem,4.8vw,2.9rem)] font-medium italic leading-[1.2] tracking-normal text-[#3A8FB8] md:mt-2">
                To Life.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.75] text-white/65 md:text-[15px]">
              Sound, lighting, and professional DJs delivering unforgettable experiences for
              weddings, concerts, festivals, and corporate events.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-book-btn inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-[450ms] ease-out hover:scale-[1.03] sm:w-auto md:text-xs"
              >
                Book a production
              </a>
              <Link
                href="/services"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-black transition-all duration-[450ms] ease-out hover:scale-[1.03] hover:bg-[#f5f5f5] sm:w-auto md:text-xs"
              >
                View services
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease }}
          className="relative mb-5 overflow-hidden rounded-[22px] border border-white/10 sm:mb-6 md:mb-7 md:rounded-[26px]"
        >
          <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] md:aspect-[2.6/1] md:min-h-[240px]">
            <MediaImage
              src={FEATURED_WIDE}
              alt="Live production stage"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
                Live production
              </p>
              <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
                Stage ready
              </span>
            </div>
          </div>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-5 lg:gap-6">
          {CRAFT.map((service, i) => (
            <CraftCard key={service.title} service={service} index={i} reduceMotion={reduceMotion} />
          ))}
        </div>

        {/* Mobile transform slider */}
        <div className="md:hidden">
          <div
            className="relative w-full overflow-hidden touch-pan-y"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{ touchAction: 'pan-y' }}
          >
            <div
              className="flex w-full will-change-transform"
              style={{
                transform: `translate3d(calc(${-active * 100}% + ${dragX}px), 0, 0)`,
                transition: dragging ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {CRAFT.map((service, i) => (
                <div key={service.title} className="w-full shrink-0 px-1">
                  <div className="mx-auto w-[86vw] max-w-[340px]">
                    <CraftCard service={service} index={i} reduceMotion={reduceMotion} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {CRAFT.map((service, i) => (
              <button
                key={`dot-${service.title}`}
                type="button"
                aria-label={`Show ${service.title}`}
                onClick={() => {
                  goTo(i);
                  pauseBriefly(5000);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === active ? 'w-7 bg-[#3A8FB8]' : 'w-2 bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
