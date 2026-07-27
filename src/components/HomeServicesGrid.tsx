'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, STAGE_IMAGES } from '@/utils/media';

const FEATURED_IMAGE = STAGE_IMAGES[1]?.src || CRAFT[0].image;
const ease = [0.22, 1, 0.36, 1] as const;

export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Soft atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#3A8FB8]/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-[#3A8FB8]/08 blur-[120px]"
      />

      {/* INTRO + FEATURED — cinematic split, full-bleed image on large screens */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:min-h-[min(78vh,720px)]">
        <div className="relative z-10 flex flex-col justify-center px-5 py-14 sm:px-8 sm:py-16 md:px-10 md:py-20 lg:py-24 lg:pl-14 xl:pl-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="mb-5 flex items-center gap-3">
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

            <p className="mt-5 max-w-md text-[14px] leading-[1.75] text-white/70 md:text-[15px]">
              Sound, lighting, and professional DJs delivering unforgettable experiences for
              weddings, concerts, festivals, and corporate events.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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

        {/* Featured visual — edge-to-edge on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="relative min-h-[260px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-full"
        >
          <MediaImage
            src={FEATURED_IMAGE}
            alt="Concert stage with LED walls, truss, and live lighting"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-black/20 lg:to-black/55" />
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="absolute -inset-y-10 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
              animate={{ x: ['-130%', '260%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.4 }}
            />
          )}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
              Live production
            </p>
            <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
              Stage ready
            </span>
          </div>
        </motion.div>
      </div>

      {/* CRAFT panels — same Sound / Lighting / DJ data */}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-14 sm:px-6 sm:pb-16 md:px-10 md:pb-24">
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              className="group relative isolate overflow-hidden rounded-[22px] border border-white/10 bg-black sm:rounded-[24px]"
            >
              <div className="relative aspect-[4/5] sm:aspect-[3/4] md:h-[340px] md:aspect-auto">
                <MediaImage
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3A8FB8]">
                    0{i + 1}
                  </p>
                  <h3 className="font-display text-lg font-bold uppercase leading-none tracking-tight text-white md:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/75 md:text-sm">
                    {service.copy}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
