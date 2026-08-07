'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { resolveGallerySrc } from '@/utils/media';
import { fetchPublicData } from '@/utils/publicDataCache';
import { DEFAULT_CRAFT, type CraftContent } from '@/utils/craftDefaults';

const ease = [0.22, 1, 0.36, 1] as const;
const IDLE_ADVANCE_MS = 5600;
const RESUME_AFTER_MS = 3200;
const LOCK_PX = 10;

/**
 * Editorial craft strip — featured wide image + three tall panels.
 * Mobile: transform carousel (not overflow-x) so page scroll on images stays native-smooth.
 * Horizontal swipe still changes Sound / Lighting / DJ. Dots remain as backup.
 * Admin tab: Bringing
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const userActiveRef = useRef(false);
  const activeCardRef = useRef(0);
  const stepRef = useRef(300);
  const dragRef = useRef({
    active: false,
    mode: 'undecided' as 'undecided' | 'h' | 'v',
    startX: 0,
    startY: 0,
    deltaX: 0,
    pointerId: -1,
  });
  const [craft, setCraft] = useState<CraftContent>(DEFAULT_CRAFT);
  const [activeCard, setActiveCard] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(300);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPublicData();
        if (!data.craft) return;
        const craftData = data.craft as CraftContent;
        setCraft({
          ...DEFAULT_CRAFT,
          ...craftData,
          featured_image_url: resolveGallerySrc(
            craftData.featured_image_url || '',
            DEFAULT_CRAFT.featured_image_url
          ),
          cards:
            Array.isArray(craftData.cards) && craftData.cards.length
              ? craftData.cards.map(
                  (
                    c: {
                      id: string;
                      title: string;
                      copy: string;
                      image_url: string;
                      order_index: number;
                    },
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

  const measureStep = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const first = viewport.querySelector<HTMLElement>('[data-craft-card]');
    if (!first) return;
    const track = viewport.querySelector<HTMLElement>('[data-craft-track]');
    const gapRaw = track ? window.getComputedStyle(track).gap || '16px' : '16px';
    const gap = parseFloat(gapRaw) || 16;
    const next = first.offsetWidth + gap;
    stepRef.current = next;
    setStep(next);
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      measureStep();
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [measureStep, cards.length]);

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

  const markUserActive = useCallback(() => {
    userActiveRef.current = true;
    if (resumeTimerRef.current != null) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      userActiveRef.current = false;
      resumeTimerRef.current = null;
    }, RESUME_AFTER_MS);
  }, []);

  const goToCard = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(cards.length - 1, index));
      activeCardRef.current = next;
      setActiveCard(next);
      setDragX(0);
      setDragging(false);
    },
    [cards.length]
  );

  useEffect(() => {
    if (reduceMotion) return;

    const advance = () => {
      if (userActiveRef.current || document.hidden || dragRef.current.active) return;
      if (window.innerWidth >= 768) return;
      const count = Math.max(cards.length, 1);
      goToCard((activeCardRef.current + 1) % count);
    };

    idleTimerRef.current = window.setInterval(advance, IDLE_ADVANCE_MS);
    return () => clearTimers();
  }, [reduceMotion, cards.length, goToCard, clearTimers]);

  /**
   * Mobile gestures:
   * - Vertical → release immediately so native page scroll stays smooth (touch-action: pan-y)
   * - Horizontal → translate the card track (no overflow-x, no window.scrollBy)
   */
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onPointerDown = (e: PointerEvent) => {
      if (window.innerWidth >= 768) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragRef.current = {
        active: true,
        mode: 'undecided',
        startX: e.clientX,
        startY: e.clientY,
        deltaX: 0,
        pointerId: e.pointerId,
      };
      markUserActive();
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active || d.pointerId !== e.pointerId) return;
      if (window.innerWidth >= 768) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (d.mode === 'undecided') {
        if (Math.abs(dx) < LOCK_PX && Math.abs(dy) < LOCK_PX) return;
        // Prefer vertical when close — page scroll must stay smooth
        d.mode = Math.abs(dx) > Math.abs(dy) * 1.25 ? 'h' : 'v';
        if (d.mode === 'h') {
          try {
            viewport.setPointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
          setDragging(true);
        } else {
          // Hand vertical back to the browser — do not preventDefault
          d.active = false;
          setDragging(false);
          setDragX(0);
          return;
        }
      }

      if (d.mode === 'h') {
        e.preventDefault();
        d.deltaX = dx;
        const atStart = activeCardRef.current === 0 && dx > 0;
        const atEnd = activeCardRef.current >= cards.length - 1 && dx < 0;
        setDragX(atStart || atEnd ? dx * 0.35 : dx);
      }
    };

    const endDrag = (e: PointerEvent) => {
      const d = dragRef.current;
      if (d.pointerId !== e.pointerId) return;
      if (!d.active && d.mode !== 'h') {
        dragRef.current.active = false;
        dragRef.current.mode = 'undecided';
        return;
      }

      if (d.mode === 'h') {
        const width = stepRef.current || 300;
        const threshold = Math.min(72, width * 0.22);
        let next = activeCardRef.current;
        if (d.deltaX <= -threshold) next += 1;
        else if (d.deltaX >= threshold) next -= 1;
        goToCard(next);
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      } else {
        setDragX(0);
        setDragging(false);
      }
      dragRef.current.active = false;
      dragRef.current.mode = 'undecided';
    };

    viewport.addEventListener('pointerdown', onPointerDown, { passive: true });
    viewport.addEventListener('pointermove', onPointerMove, { passive: false });
    viewport.addEventListener('pointerup', endDrag, { passive: true });
    viewport.addEventListener('pointercancel', endDrag, { passive: true });

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', endDrag);
      viewport.removeEventListener('pointercancel', endDrag);
    };
  }, [cards.length, goToCard, markUserActive]);

  const trackStyle = isMobile
    ? {
        transform: `translate3d(${-activeCard * step + dragX}px, 0, 0)`,
        transition: dragging ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }
    : undefined;

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
              priority
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
          ref={viewportRef}
          className="relative -mx-1 overflow-hidden px-1 md:mx-0 md:overflow-visible md:px-0"
          style={{ touchAction: 'pan-y' }}
        >
          <div
            data-craft-track
            className="flex gap-4 will-change-transform md:grid md:grid-cols-3 md:gap-5 md:!transform-none lg:gap-6"
            style={trackStyle}
          >
            {cards.map((service, i) => (
              <article
                key={service.id}
                data-craft-card
                className="group relative h-[420px] w-[82vw] max-w-[340px] flex-shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-black sm:h-[460px] sm:w-[70vw] md:h-[520px] md:w-auto md:max-w-none lg:h-[560px]"
              >
                <MediaImage
                  src={service.image_url}
                  alt={service.title}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover [-webkit-user-drag:none] md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-[1.05]"
                  priority={i < 2}
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
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          {cards.map((service, i) => (
            <button
              key={`dot-${service.id}`}
              type="button"
              aria-label={`Show ${service.title}`}
              onClick={() => {
                markUserActive();
                goToCard(i);
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
