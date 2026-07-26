'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import MediaImage from '@/components/MediaImage';
import { CRAFT } from '@/utils/media';

export default function HomeServicesGrid() {
  return (
    <section className="relative -mt-6 md:-mt-10 bg-black rounded-t-[40px] border-t border-white/10 py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-3 uppercase tracking-tight"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-white/55 max-w-xl mx-auto leading-relaxed"
          >
            Sound, light, SFX, truss, fireworks, and DJ — built for every stage.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {CRAFT.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative group rounded-3xl overflow-hidden border border-white/15 bg-black transition-all duration-300 ease-out hover:-translate-y-2 hover:border-accent/50"
            >
              {/* Image-first card — larger visual area */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <MediaImage
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <span className="absolute top-4 right-4 inline-flex p-2 rounded-full bg-accent text-black">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed line-clamp-2">
                    {service.copy}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary inline-flex items-center justify-center min-h-[44px]">
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
