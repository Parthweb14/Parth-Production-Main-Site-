'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, STAGE_IMAGES } from '@/utils/media';

const FEATURED_IMAGE = STAGE_IMAGES[1]?.src || CRAFT[0].image;

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomeServicesGrid() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <section className="relative w-full bg-black py-20 px-6 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* HERO AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="relative w-full aspect-[16/10] overflow-hidden rounded-[28px] border border-[#1d1d1d] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
          >
            <MediaImage
              src={FEATURED_IMAGE}
              alt="Concert stage with LED walls, truss, and live lighting"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="flex flex-col justify-center lg:pl-4"
          >
            <p className="text-[14px] uppercase tracking-[2px] text-[#ff5a3c] font-semibold mb-5">
              Designed For Every Celebration
            </p>

            <h2 className="font-display font-extrabold text-white leading-[1.05] tracking-tight text-[clamp(2.4rem,5.5vw,4.5rem)]">
              Bringing Every Moment
              <br />
              <span className="font-serif italic font-normal text-[#ff5a3c]">To Life.</span>
            </h2>

            <p className="mt-6 max-w-xl text-[18px] md:text-[22px] leading-[1.7] text-[#b8b8b8]">
              Sound, lighting, SFX, truss, fireworks, and professional DJs delivering unforgettable
              experiences for weddings, concerts, festivals, and corporate events.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[56px] md:h-[68px] px-8 md:px-[42px] rounded-full bg-[#ff5a3c] text-white text-sm md:text-base font-bold tracking-[0.08em] uppercase transition-all duration-[450ms] ease-out hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(255,90,60,0.35)]"
              >
                Book a production
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center h-[56px] md:h-[68px] px-8 md:px-[42px] rounded-full bg-white text-black text-sm md:text-base font-bold tracking-[0.08em] uppercase transition-all duration-[450ms] ease-out hover:bg-[#f5f5f5] hover:scale-[1.03]"
              >
                View services
              </Link>
            </div>
          </motion.div>
        </div>

        {/* SERVICES SHOWCASE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] md:gap-[22px]">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.45, ease }}
              className="celebration-card group relative h-[240px] md:h-[270px] overflow-hidden rounded-[24px] border border-[#1d1d1d] bg-black"
            >
              <MediaImage
                src={service.image}
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-[22px] md:p-[26px] transition-transform duration-[450ms] ease-out group-hover:-translate-y-1">
                <h3 className="font-display text-[26px] md:text-[32px] font-bold uppercase tracking-tight text-white leading-none mb-2">
                  {service.title}
                </h3>
                <p className="text-[15px] md:text-[18px] leading-snug text-[#b8b8b8] line-clamp-2">
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
