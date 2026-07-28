'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, STAGE_IMAGES } from '@/utils/media';

const FEATURED_IMAGE = STAGE_IMAGES[1]?.src || CRAFT[0].image;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Craft Switchboard — interactive Sound / Lighting / DJ showcase.
 * Completely different from the previous split+grid layout.
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const craft = CRAFT[active] || CRAFT[0];

  return (
    <section className="relative w-full overflow-hidden bg-black py-14 sm:py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(58,143,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,143,184,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-10">
        <div className="mb-8 max-w-2xl md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
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
            <p className="mt-4 max-w-md text-[14px] leading-[1.75] text-white/70 md:text-[15px]">
              Sound, lighting, and professional DJs delivering unforgettable experiences for
              weddings, concerts, festivals, and corporate events.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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

        {/* Switchboard stage */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-8">
          {/* Craft selectors */}
          <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {CRAFT.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative min-w-[78%] flex-shrink-0 overflow-hidden rounded-2xl border p-4 text-left transition-all sm:min-w-[46%] lg:min-w-0 lg:p-5 ${
                    isActive
                      ? 'border-[#3A8FB8]/55 bg-[#3A8FB8]/12'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3A8FB8]">
                    0{i + 1}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/60 sm:text-[13px]">
                    {item.copy}
                  </p>
                  {isActive && (
                    <motion.span
                      layoutId="craft-active"
                      className="absolute inset-y-0 left-0 w-px bg-[#3A8FB8]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active craft canvas */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-black sm:min-h-[400px] md:min-h-[480px] lg:min-h-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={craft.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="absolute inset-0"
              >
                <MediaImage
                  src={craft.image || FEATURED_IMAGE}
                  alt={craft.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
                {!reduceMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute -inset-y-8 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-120%', '260%'] }}
                    transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3A8FB8]">
                Live production · 0{active + 1}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
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
