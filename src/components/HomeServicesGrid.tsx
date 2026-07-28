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
const SCROLL_SETTLE_MS = 520;

/**
 * Editorial craft strip — featured wide image + three tall panels.
 * Mobile: discrete card autoplay (no RAF vs snap jitter).
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const pausedRef = useRef(false);
  const programmaticRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);

  const setActiveIndex = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const n = CRAFT.length;
      const next = ((index % n) + n) % n;
      const target = cardRefs.current[next];
      if (!target) return;

      programmaticRef.current = true;
      scroller.style.scrollSnapType = 'none';

      const left = target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2;
      scroller.scrollTo({
        left: Math.max(0, left),
        behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
      });
      setActiveIndex(next);

      if (settleTimer.current != null) window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        scroller.style.scrollSnapType = '';
        programmaticRef.current = false;
        settleTimer.current = null;
      }, smooth && !reduceMotion ? SCROLL_SETTLE_MS : 40);
    },
    [reduceMotion, setActiveIndex]
  );

  const pauseAuto = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimer.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
    if (reduceMotion || !isMobile || !inView) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || programmaticRef.current || document.hidden) return;
      scrollToIndex((activeRef.current + 1) % CRAFT.length, true);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [inView, isMobile, reduceMotion, scrollToIndex]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
      if (settleTimer.current != null) window.clearTimeout(settleTimer.current);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !isMobile) return;
    let ticking = false;
    const onScroll = () => {
      if (programmaticRef.current || ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        if (programmaticRef.current) return;
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const mid = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(mid - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        if (best !== activeRef.current) setActiveIndex(best);
      });
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [isMobile, setActiveIndex]);

  return (
    <section className="relative w-full overflow-hidden bg-black py-14 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3A8FB8]/35 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] h-[42%] w-[72%] -translate-x-1/2 rounded-full bg-[#3A8FB8]/07 blur-[130px]"
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
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

        <div
          ref={scrollerRef}
          onPointerDown={pauseAuto}
          onTouchStart={pauseAuto}
          className="flex gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-3 scrollbar-none [-webkit-overflow-scrolling:touch] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:[scroll-snap-type:none] lg:gap-6"
          style={{ scrollPaddingInline: isMobile ? '11vw' : undefined }}
        >
          {CRAFT.map((service, i) => (
            <article
              key={service.title}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className={`group relative h-[400px] w-[78vw] max-w-[320px] flex-shrink-0 snap-center overflow-hidden rounded-[24px] border bg-black transition-[border-color] duration-300 sm:h-[440px] sm:w-[70vw] md:h-[520px] md:w-auto md:max-w-none lg:h-[560px] ${
                isMobile && active === i ? 'border-[#3A8FB8]/50' : 'border-white/10'
              }`}
            >
              <MediaImage
                src={service.image}
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A8FB8]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
                <p className="font-display text-sm font-semibold tabular-nums tracking-[0.2em] text-white/35">
                  0{i + 1}
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
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          {CRAFT.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show ${item.title}`}
              onClick={() => {
                pauseAuto();
                scrollToIndex(i, true);
              }}
              className={`h-2 rounded-full transition-all ${
                active === i ? 'w-7 bg-[#3A8FB8]' : 'w-2 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
