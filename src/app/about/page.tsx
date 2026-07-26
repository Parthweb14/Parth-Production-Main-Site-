'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, Sparkles, Settings2 } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import PageHero from '@/components/PageHero';
import { OWNER_IMAGE, STAGE_IMAGES } from '@/utils/media';

const journey = [
  {
    year: '2018',
    title: 'How We Started',
    description:
      'Started with a simple DJ setup and a passion for music — learning every cue, every crowd, and every dance floor in Surat.',
  },
  {
    year: '2020',
    title: 'Growing Our Services',
    description:
      'Added professional lighting and SFX to our offerings so nights could look as sharp as they sounded.',
  },
  {
    year: '2022',
    title: '500+ Events Completed',
    description:
      'Reached a major milestone serving weddings, festivals, concerts, and corporate stages across Gujarat.',
  },
  {
    year: '2025',
    title: 'Latest Technology',
    description:
      'Invested in cutting-edge sound systems and programmed lighting looks built for bigger rooms and louder memories.',
  },
];

const values = [
  {
    icon: Sparkles,
    title: 'Top-Tier Equipment',
    description: 'Industry-leading sound systems and lighting that stay clean under pressure.',
  },
  {
    icon: Users,
    title: 'Professional Crew',
    description: 'Experienced DJs and technical experts who treat every cue like it matters.',
  },
  {
    icon: Settings2,
    title: 'Tailored Experience',
    description: 'Every event uniquely designed for your venue, vibe, and guest journey.',
  },
];

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(0);
  const milestone = journey[activeYear];

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <main className="relative overflow-x-hidden bg-[#0A0E27]">
        <PageHero
          title="About Us"
          description="Full-stack live production. From first mic check to final firework — sound, light, SFX, truss, and DJ artistry under one crew."
        />

        <section className="relative py-14 md:py-20 px-4 sm:px-6 md:px-10 overflow-hidden border-t border-white/10">
          <MediaImage
            src={STAGE_IMAGES[2].src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0A0E27]/85 to-[#0A0E27]" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto text-center saas-card px-6 py-10 md:px-12 md:py-14"
          >
            <p className="section-label mb-5">Operating principle</p>
            <p className="font-serif italic text-2xl md:text-4xl text-white leading-snug">
              “We don&apos;t just play music — we create moments that last forever.”
            </p>
          </motion.div>
        </section>

        <section className="relative border-t border-white/10 py-14 md:py-20 px-4 sm:px-6 md:px-10 overflow-hidden">
          <div className="absolute inset-0 site-grid opacity-20" />
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
              <div>
                <p className="section-label mb-3">Changelog</p>
                <h2 className="font-display text-3xl md:text-5xl font-semibold uppercase tracking-tight text-white">
                  Our Journey
                </h2>
              </div>
              <p className="text-slate-400 text-sm md:text-base max-w-sm leading-relaxed">
                Version history of the brand — tap a year to load that release.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
              {journey.map((item, i) => {
                const selected = i === activeYear;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => setActiveYear(i)}
                    className={`min-h-[56px] rounded-2xl border px-3 py-3 text-left transition-all ${
                      selected
                        ? 'border-cyan-400 bg-cyan-400/15 shadow-[0_0_24px_rgba(34,211,238,0.15)]'
                        : 'border-white/10 bg-[#111827]/60 hover:border-white/25'
                    }`}
                  >
                    <p className="font-display text-2xl font-semibold text-white">{item.year}</p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 mt-1 truncate">
                      {item.title}
                    </p>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="saas-card p-6 md:p-10 relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
                <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300 font-semibold mb-3">
                  Release {milestone.year}
                </p>
                <h3 className="font-display text-2xl md:text-4xl font-semibold text-white uppercase tracking-tight mb-4">
                  {milestone.title}
                </h3>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-3xl">
                  {milestone.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="relative border-t border-white/10 py-14 md:py-20 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-cyan-400/25 shadow-[0_0_40px_rgba(34,211,238,0.12)] group h-full min-h-[420px]">
                <MediaImage
                  src={OWNER_IMAGE}
                  alt="Parth — Founder of Parth Production"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-[#0A0E27]/25" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 font-bold mb-1">
                    Founder profile
                  </p>
                  <p className="font-display text-3xl font-semibold text-white uppercase tracking-tight">
                    Parth
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="lg:col-span-7 saas-card p-6 md:p-10 flex flex-col justify-center"
            >
              <span className="inline-flex self-start items-center min-h-[32px] px-3 py-1 rounded-full bg-cyan-400 text-[#0A0E27] text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
                Founder & CEO
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Parth
              </h2>
              <p className="mt-2 text-lg text-slate-400">Lead DJ & Creative Director</p>
              <p className="font-serif italic text-xl md:text-2xl text-slate-200 mt-6 leading-snug">
                “Music is not just what I do — it&apos;s who I am. Every event is a canvas, and
                together we paint memories.”
              </p>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-400 max-w-xl">
                Built from late-night sets and studios in Surat, Parth Production grew from a single
                DJ desk into a full crew for sound, light, SFX, truss, and finales.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="relative border-t border-white/10 py-14 md:py-20 px-4 sm:px-6 md:px-10 overflow-hidden">
          <div className="absolute inset-0 site-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-semibold uppercase tracking-tight text-center mb-10 md:mb-12"
            >
              Why Choose Us
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.article
                    key={value.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/80 p-6 md:p-8 group"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/25">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <QuoteCta
          title="Ready to take your event to the next level?"
          subtitle="Get professional DJ, lighting, and sound for your next event."
          buttonLabel="Book your event"
        />
      </main>

      <Footer />
    </>
  );
}
