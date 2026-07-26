'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';
import { CRAFT } from '@/utils/media';

const BENTO: Array<{ span: string; tall?: boolean }> = [
  { span: 'md:col-span-2 md:row-span-2', tall: true },
  { span: 'md:col-span-1' },
  { span: 'md:col-span-1' },
  { span: 'md:col-span-1' },
  { span: 'md:col-span-2' },
  { span: 'md:col-span-1' },
];

export default function HomeServicesGrid() {
  return (
    <section className="relative bg-[#0A0E27] py-20 md:py-28 px-4 md:px-8 overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 site-grid opacity-25" />
      <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label mb-3"
            >
              Capability board
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-semibold text-white uppercase tracking-tight max-w-xl"
            >
              Designed For Every Celebration
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-slate-400 max-w-sm leading-relaxed md:text-right"
          >
            Stack modules like a product suite — sound, light, SFX, structure, pyro, and DJ
            artistry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[220px] gap-3 md:gap-4">
          {CRAFT.map((service, i) => {
            const layout = BENTO[i] || { span: 'md:col-span-1' };
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827] group ${layout.span} ${
                  layout.tall ? 'min-h-[280px] md:min-h-0' : 'min-h-[220px]'
                }`}
              >
                <MediaImage
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/55 to-transparent" />
                <div className="scan-line absolute inset-x-0 h-px top-0 opacity-0 group-hover:opacity-100" />
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
                  <span className="self-start text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-300 bg-cyan-400/10 border border-cyan-400/25 rounded-full px-2.5 py-1">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-tight text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-300/90 leading-relaxed max-w-sm">
                      {service.copy}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
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
