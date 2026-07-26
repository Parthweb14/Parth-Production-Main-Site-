'use client';

import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, STAGE_IMAGES } from '@/utils/media';

const stats = [
  { label: 'Disciplines', value: '06' },
  { label: 'Event types', value: '05+' },
  { label: 'Crew focus', value: 'Live' },
];

export default function AboutPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="pt-20">
        <section className="relative min-h-[70vh] flex items-end overflow-hidden border-b border-white/10">
          <MediaImage
            src={STAGE_IMAGES[7].src}
            alt="Parth Production stage"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 w-full">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
              About
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl leading-[0.95]"
            >
              We turn empty rooms into
              <span className="text-shimmer"> living stages</span>
            </motion.h1>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-5">
              Surat-based. Built for unforgettable nights.
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Parth Production is a live-event crew for sound, lighting, SFX, truss, fireworks, and DJ artistry.
              We design systems that feel intentional — from intimate weddings to festival-scale arenas.
            </p>
            <p className="text-white/60 leading-relaxed">
              Every show gets the same obsession: clean audio, sharp cues, safe structures, and a finale people talk about on the way home.
            </p>
          </motion.div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-white/10 p-4 md:p-5 bg-white/[0.02]"
              >
                <p className="font-display text-3xl md:text-4xl text-accent">{stat.value}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-10">The craft stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CRAFT.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative overflow-hidden border border-white/10 min-h-[260px]"
                >
                  <MediaImage
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-colors" />
                  <div className="relative p-6 flex flex-col h-full min-h-[260px] justify-end">
                    <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{item.copy}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight max-w-xl">
            Let’s design your next unforgettable moment.
          </h2>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-7 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase"
          >
            Talk to the team
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
