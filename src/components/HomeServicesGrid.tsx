'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT } from '@/utils/media';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Production Chapters — full-bleed craft showcase.
 * Completely different from the previous split + 3-card grid.
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const craft = CRAFT[active] || CRAFT[0];

  return (
    <section className="relative w-full overflow-hidden bg-black py-14 sm:py-16 md:py-24">
      {/* Oversized watermark */}
      <p
        aria-hidden
        className="pointer-events-none absolute -right-4 top-8 select-none font-serif text-[clamp(5rem,22vw,14rem)] italic leading-none text-white/[0.035] md:top-4"
      >
        To Life.
      </p>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[50%] w-[70%] -translate-x-1/2 rounded-full bg-[#3A8FB8]/08 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-10">
        {/* Intro */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:mb-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#3A8FB8]" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3A8FB8] md:text-[12px]">
                Designed For Every Celebration
              </p>
            </div>
            <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Bringing Every Moment
              <br />
              <span className="font-serif italic font-normal text-[#3A8FB8]">To Life.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="lg:col-span-5 lg:pb-1"
          >
            <p className="max-w-md text-[14px] leading-[1.75] text-white/70 md:text-[15px] lg:ml-auto lg:text-right">
              Sound, lighting, and professional DJs delivering unforgettable experiences for
              weddings, concerts, festivals, and corporate events.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-book-btn inline-flex h-11 items-center justify-center rounded-full px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-[450ms] ease-out hover:scale-[1.03] md:text-xs"
              >
                Book a production
              </a>
              <Link
                href="/services"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-black transition-all duration-[450ms] ease-out hover:scale-[1.03] hover:bg-[#f5f5f5] md:text-xs"
              >
                View services
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Chapter index + immersive stage */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.45fr)] lg:gap-7">
          {/* Chapter selectors — horizontal on mobile, stacked on desktop */}
          <div
            className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
            role="tablist"
            aria-label="Craft chapters"
          >
            {CRAFT.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`group relative min-w-[78%] flex-shrink-0 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 sm:min-w-[46%] lg:min-w-0 lg:p-5 ${
                    isActive
                      ? 'border-[#3A8FB8]/55 bg-[#3A8FB8]/12'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-3xl font-bold tabular-nums leading-none text-white/20 transition-colors group-hover:text-white/35 lg:text-4xl">
                      0{i + 1}
                    </p>
                    {isActive && (
                      <motion.span
                        layoutId="craft-chapter-dot"
                        className="mt-1 h-2 w-2 rounded-full bg-[#3A8FB8]"
                      />
                    )}
                  </div>
                  <p className="mt-3 font-display text-xl font-bold uppercase tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/55 sm:text-[13px]">
                    {item.copy}
                  </p>
                  {isActive && (
                    <motion.span
                      layoutId="craft-chapter-line"
                      className="absolute inset-y-0 left-0 w-px bg-[#3A8FB8]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immersive canvas */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[360px] overflow-hidden rounded-[26px] border border-white/10 bg-black sm:min-h-[440px] md:min-h-[520px] lg:min-h-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={craft.title}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease }}
                className="absolute inset-0"
              >
                <MediaImage
                  src={craft.image}
                  alt={craft.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                {!reduceMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute -inset-y-10 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                    animate={{ x: ['-130%', '260%'] }}
                    transition={{
                      duration: 5.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatDelay: 2.2,
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3A8FB8]">
                Chapter 0{active + 1}
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-8">
              <p
                aria-hidden
                className="mb-2 font-display text-[clamp(3.5rem,12vw,6rem)] font-bold leading-none text-white/[0.08]"
              >
                0{active + 1}
              </p>
              <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
                {craft.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                {craft.copy}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
