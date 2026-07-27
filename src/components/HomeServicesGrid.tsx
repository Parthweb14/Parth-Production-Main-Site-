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
    <section className="relative w-full overflow-hidden bg-black py-14 sm:py-16 md:py-24">
      {/* Atmospheric stage backdrop — full bleed, same featured image */}
      <div className="pointer-events-none absolute inset-0">
        <MediaImage
          src={FEATURED_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black" />
        <div
          aria-hidden
          className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#3A8FB8]/12 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-[#3A8FB8]/08 blur-[110px]"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-10">
        {/* Intro band */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease }}
            className="order-2 lg:order-1"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#3A8FB8]" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3A8FB8] md:text-[12px]">
                Designed For Every Celebration
              </p>
            </div>

            <h2 className="font-display text-[clamp(1.85rem,4.2vw,3.1rem)] font-extrabold leading-[1.05] tracking-tight text-white">
              Bringing Every Moment
              <br />
              <span className="font-serif italic font-normal text-[#3A8FB8]">To Life.</span>
            </h2>

            <p className="mt-4 max-w-md text-[14px] leading-[1.7] text-[#b8b8b8] md:text-[15px]">
              Sound, lighting, and professional DJs delivering unforgettable experiences for
              weddings, concerts, festivals, and corporate events.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

          {/* Featured frame — same image, new cinematic crop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="order-1 lg:order-2"
          >
            <div className="relative mx-auto aspect-[16/11] w-full max-w-xl overflow-hidden rounded-[22px] border border-white/10 shadow-[0_28px_70px_rgba(0,0,0,0.55)] sm:rounded-[28px] lg:max-w-none">
              <MediaImage
                src={FEATURED_IMAGE}
                alt="Concert stage with LED walls, truss, and live lighting"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-transparent to-[#3A8FB8]/15" />
              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  className="absolute -inset-y-8 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-120%', '280%'] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.2 }}
                />
              )}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-sm">
                  Live production
                </p>
                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                  Stage ready
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service panels — same CRAFT data, new staggered stage layout */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className={`group relative isolate overflow-hidden rounded-[22px] border border-white/10 bg-black sm:rounded-[24px] ${
                i === 1 ? 'lg:translate-y-6' : i === 2 ? 'lg:translate-y-3' : ''
              }`}
            >
              <div className="relative h-[280px] overflow-hidden sm:h-[300px] md:h-[340px]">
                <MediaImage
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3A8FB8]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

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
