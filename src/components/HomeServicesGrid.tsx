'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { resolveGallerySrc } from '@/utils/media';
import { DEFAULT_CRAFT, type CraftContent } from '@/utils/craftDefaults';

const ease = [0.22, 1, 0.36, 1] as const;
const IDLE_ADVANCE_MS = 5200;
const RESUME_AFTER_MS = 2800;

/**
 * Editorial craft strip — featured wide image + three tall panels.
 * Mobile: vertical page scroll always works on card images; horizontal swipe is direction-locked.
 * Admin tab: Bringing
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const idleTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const userActiveRef = useRef(false);
  const activeCardRef = useRef(0);
  const [craft, setCraft] = useState<CraftContent>(DEFAULT_CRAFT);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/data');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.craft) return;
        setCraft({
          ...DEFAULT_CRAFT,
          ...data.craft,
          featured_image_url: resolveGallerySrc(
            data.craft.featured_image_url || '',
            DEFAULT_CRAFT.featured_image_url
          ),
          cards:
            Array.isArray(data.craft.cards) && data.craft.cards.length
              ? data.craft.cards.map(
                  (
                    c: { id: string; title: string; copy: string; image_url: string; order_index: number },
                    i: number
                  ) => ({
                    id: c.id || `craft-${i + 1}`,
                    title: c.title || DEFAULT_CRAFT.cards[i % 3]?.title || 'Craft',
                    copy: c.copy || DEFAULT_CRAFT.cards[i % 3]?.copy || '',
                    image_url: resolveGallerySrc(
                      c.image_url || '',
                      DEFAULT_CRAFT.cards[i % 3]?.image_url || DEFAULT_CRAFT.featured_image_url
                    ),
                    order_index: c.order_index ?? i,
                  })
                )
              : DEFAULT_CRAFT.cards,
        });
      } catch {
        // keep defaults
      }
    }
    load();
  }, []);

  const cards = [...craft.cards].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current != null) {
      window.clearInterval(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!el || !card) return;
    const left = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior });
    activeCardRef.current = index;
    setActiveCard(index);
  }, []);

  const markUserActive = useCallback(() => {
    userActiveRef.current = true;
    if (resumeTimerRef.current != null) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      userActiveRef.current = false;
      resumeTimerRef.current = null;
    }, RESUME_AFTER_MS);
  }, []);

  // Idle auto-advance: snap to next card with scrollTo — never write scrollLeft per frame
  useEffect(() => {
    if (reduceMotion) return;

    const advance = () => {
      if (userActiveRef.current || document.hidden) return;
      if (window.innerWidth >= 768) return;
      const count = Math.max(cardRefs.current.filter(Boolean).length, 1);
      const next = (activeCardRef.current + 1) % count;
      scrollToCard(next, 'smooth');
    };

    idleTimerRef.current = window.setInterval(advance, IDLE_ADVANCE_MS);
    return () => clearTimers();
  }, [reduceMotion, cards.length, scrollToCard, clearTimers]);

  /**
   * Mobile gesture lock:
   * - Vertical drag on Sound/Lighting/DJ cards must scroll the PAGE (never get stuck)
   * - Horizontal drag still slides between cards
   * touch-action: pan-y hands vertical to the browser; we only hijack clear horizontal swipes.
   */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let mode: 'undecided' | 'h' | 'v' = 'undecided';
    let settleTimer: number | null = null;

    const nearestIndex = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const center = card.offsetLeft + card.clientWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    const syncActive = () => {
      const best = nearestIndex();
      activeCardRef.current = best;
      setActiveCard(best);
    };

    const onScroll = () => {
      markUserActive();
      if (settleTimer != null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(syncActive, 80);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      startScroll = el.scrollLeft;
      mode = 'undecided';
      markUserActive();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (mode === 'undecided') {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        mode = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'h' : 'v';
      }

      if (mode === 'h') {
        // Own the horizontal gesture so cards can slide
        e.preventDefault();
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        el.scrollLeft = Math.min(max, Math.max(0, startScroll - dx));
      }
      // mode === 'v': do nothing — touch-action:pan-y lets the page scroll
    };

    const onTouchEnd = () => {
      if (window.innerWidth >= 768) return;
      if (mode === 'h') {
        scrollToCard(nearestIndex(), 'smooth');
      }
      mode = 'undecided';
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      if (settleTimer != null) window.clearTimeout(settleTimer);
    };
  }, [markUserActive, scrollToCard, cards.length]);

  return (
    <section className="relative w-full overflow-x-clip bg-black py-14 sm:py-16 md:py-24">
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
                {craft.eyebrow}
              </p>
              <span className="h-px w-8 bg-[#3A8FB8]" aria-hidden />
            </div>

            <h2 className="font-display text-[clamp(1.55rem,5.2vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-white">
              <span className="block whitespace-nowrap">{craft.heading}</span>
              <span className="mt-1.5 block whitespace-nowrap font-serif text-[clamp(1.45rem,4.8vw,2.9rem)] font-medium italic leading-[1.2] tracking-normal text-[#3A8FB8] md:mt-2">
                {craft.italic_line}
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.75] text-white/65 md:text-[15px]">
              {craft.description}
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
              src={craft.featured_image_url}
              alt={craft.featured_title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-y-8 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-130%', '250%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
                {craft.featured_title}
              </p>
              <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
                {craft.featured_badge}
              </span>
            </div>
          </div>
        </motion.div>

        <div
          ref={scrollerRef}
          className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 pb-2 scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:overscroll-auto md:px-0 md:pb-0 lg:gap-6"
          style={{
            // Vertical page scroll always wins on the card images; horizontal is handled in JS
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {cards.map((service, i) => (
            <article
              key={service.id}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className="group relative h-[420px] w-[82vw] max-w-[340px] flex-shrink-0 snap-center overflow-hidden rounded-[24px] border border-white/10 bg-black sm:h-[460px] sm:w-[70vw] md:h-[520px] md:w-auto md:max-w-none lg:h-[560px]"
              style={{ scrollSnapStop: 'always' }}
            >
              <MediaImage
                src={service.image_url}
                alt={service.title}
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover [-webkit-user-drag:none] md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-[1.05]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#3A8FB8]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 md:group-hover:opacity-100" />

              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
                <p className="font-display text-sm font-semibold tabular-nums tracking-[0.2em] text-white/35">
                  0{i + 1}
                </p>
                <span className="h-px w-10 bg-[#3A8FB8]/60" aria-hidden />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-6">
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
          {cards.map((service, i) => (
            <button
              key={`dot-${service.id}`}
              type="button"
              aria-label={`Show ${service.title}`}
              onClick={() => {
                markUserActive();
                scrollToCard(i, 'smooth');
              }}
              className={`h-2 rounded-full transition-all ${
                i === activeCard ? 'w-7 bg-[#3A8FB8]' : 'w-2 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
