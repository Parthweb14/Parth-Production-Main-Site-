'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import MediaImage from '@/components/MediaImage';
import { CRAFT } from '@/utils/media';

export default function HomeServicesGrid() {
  return (
    <section className="relative -mt-6 md:-mt-10 bg-white/5 rounded-t-[40px] border-t border-white/10 py-20 md:py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Sound, light, SFX, truss, fireworks, and DJ artistry — modular packages for every stage size.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative group rounded-3xl p-6 md:p-8 bg-black/40 backdrop-blur-md border border-white/20 transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-black/60 hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(255,95,31,0.18)]"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white">{service.title}</h3>
                <span className="inline-flex p-2 rounded-full bg-accent text-black shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
              <div className="my-4 h-px bg-gradient-to-r from-white/20 via-accent/50 to-transparent" />
              <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6">{service.copy}</p>
              <div className="rounded-xl overflow-hidden aspect-[16/10] border border-white/10">
                <MediaImage
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="btn-primary inline-flex items-center justify-center min-h-[44px]"
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
