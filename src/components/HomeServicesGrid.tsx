'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { CRAFT } from '@/utils/media';

export default function HomeServicesGrid() {
  return (
    <section className="relative bg-[#0A0E27] py-20 md:py-28 px-4 md:px-8 overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 site-grid opacity-25" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-3"
          >
            Capability stack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-semibold text-white uppercase tracking-tight"
          >
            Designed For Every Celebration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            Modular production systems — pick a craft, or stack the full floor.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`saas-card group overflow-hidden ${
                i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <MediaImage
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/40 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-300 bg-cyan-400/10 border border-cyan-400/25 rounded-full px-2.5 py-1">
                  0{i + 1}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{service.copy}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary inline-flex min-h-[44px]">
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
