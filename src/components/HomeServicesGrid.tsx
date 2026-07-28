'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT } from '@/utils/media';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial craft strip — three equal tall panels.
 * Cleaner than chapter switchboards / card grids.
 */
export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const reduceMotion = useReducedMotion();

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

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-10">
        {/* Intro — mirrors hero type system */}
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
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

            <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              <span className="block">Bringing Every Moment</span>
              <span className="mt-2 block font-serif text-[clamp(1.7rem,4.2vw,2.9rem)] font-medium italic leading-[1.2] tracking-normal text-[#3A8FB8]">
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

        {/* Three craft panels — snap scroll on mobile, equal columns on desktop */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:gap-6">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease }}
              className="group relative h-[420px] w-[82vw] max-w-[340px] flex-shrink-0 snap-center overflow-hidden rounded-[24px] border border-white/10 bg-black sm:h-[460px] sm:w-[70vw] md:h-[520px] md:w-auto md:max-w-none lg:h-[560px]"
            >
              <MediaImage
                src={service.image}
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A8FB8]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-y-8 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ['-120%', '240%'] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 3,
                  }}
                />
              )}

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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
