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
    <section className="relative w-full bg-black py-16 md:py-20 px-6 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* HERO AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center mb-12 md:mb-14">
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
            <p className="text-[11px] md:text-[12px] uppercase tracking-[2px] text-[#00C2FF] font-semibold mb-3">
              Designed For Every Celebration
            </p>

            <h2 className="font-display font-extrabold text-white leading-[1.1] tracking-tight text-[clamp(1.75rem,3.6vw,2.75rem)]">
              Bringing Every Moment
              <br />
              <span className="font-serif italic font-normal text-[#00C2FF]">To Life.</span>
            </h2>

            <p className="mt-4 max-w-md text-[14px] md:text-[15px] leading-[1.65] text-[#b8b8b8]">
              Sound, lighting, and professional DJs delivering unforgettable experiences for
              weddings, concerts, festivals, and corporate events.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-book-btn inline-flex items-center justify-center h-11 px-6 rounded-full text-white text-[11px] md:text-xs font-bold tracking-[0.1em] uppercase transition-all duration-[450ms] ease-out hover:scale-[1.03]"
              >
                Book a production
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-white text-black text-[11px] md:text-xs font-bold tracking-[0.1em] uppercase transition-all duration-[450ms] ease-out hover:bg-[#f5f5f5] hover:scale-[1.03]"
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
              className="celebration-card group relative h-[290px] md:h-[330px] overflow-hidden rounded-[24px] border border-[#1d1d1d] bg-black"
            >
              <MediaImage
                src={service.image}
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transition-transform duration-[450ms] ease-out group-hover:-translate-y-1">
                <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-white leading-none">
                  {service.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
