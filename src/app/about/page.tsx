'use client';

import { motion } from 'framer-motion';
import { Music, Calendar, Users, Award, Sparkles, Settings2 } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import LiquidGlassBackdrop from '@/components/LiquidGlassBackdrop';
import CountUp from '@/components/CountUp';
import { STAGE_IMAGES } from '@/utils/media';

const stats = [
  { label: 'Years of Excellence', end: 5, suffix: '+', icon: Music },
  { label: 'Events Executed', end: 500, suffix: '+', icon: Calendar },
  { label: 'Equipment Setups', end: 50, suffix: '+', icon: Users },
  { label: 'Satisfaction Guarantee', end: 100, suffix: '%', icon: Award },
];

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
  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <main className="relative overflow-x-hidden bg-black">
        {/* SECTION 1: Hero */}
        <section className="relative min-h-[70svh] md:min-h-[100svh] flex items-center justify-center px-6 md:px-10 py-28 md:py-32 overflow-hidden">
          <LiquidGlassBackdrop />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-accent font-semibold mb-5"
            >
              Parth Production
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.95] glass-heading"
            >
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 md:mt-8 text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Full-stack live production. From first mic check to final firework — sound, light,
              SFX, truss, and DJ artistry under one crew.
            </motion.p>
          </div>
        </section>

        {/* SECTION 2A: Stats */}
        <section className="relative border-t border-white/10 py-16 md:py-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-3xl p-5 md:p-8 text-center transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-accent">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.16em] text-white/55">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2B: Philosophy quote */}
        <section className="relative py-16 md:py-24 px-4 sm:px-6 md:px-10 overflow-hidden border-t border-white/10">
          <MediaImage
            src={STAGE_IMAGES[2].src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6 text-accent">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Our philosophy</span>
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-serif italic text-2xl md:text-4xl lg:text-5xl text-white leading-snug">
              “We don&apos;t just play music — we create moments that last forever.”
            </p>
          </motion.div>
        </section>

        {/* SECTION 3: Journey timeline */}
        <section className="relative border-t border-white/10 py-16 md:py-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-center mb-12 md:mb-16"
            >
              Our Journey
            </motion.h2>

            <div className="relative">
              {/* Vertical timeline line */}
              <div
                className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
                style={{
                  background:
                    'linear-gradient(180deg, transparent, rgba(255,95,31,0.8), rgba(255,179,71,0.6), transparent)',
                  boxShadow: '0 0 12px rgba(255,95,31,0.45)',
                }}
              />

              <div className="space-y-10 md:space-y-16">
                {journey.map((item, i) => {
                  const left = i % 2 === 0;
                  return (
                    <motion.article
                      key={item.year}
                      initial={{ opacity: 0, x: left ? -28 : 28 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5 }}
                      className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${
                        left ? '' : 'md:[&>*:first-child]:order-2'
                      }`}
                    >
                      {/* Connector dot */}
                      <span className="absolute left-[11px] md:left-1/2 top-8 md:top-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_16px_rgba(255,95,31,0.8)] z-10" />

                      <div
                        className={`glass-card rounded-2xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-2 ${
                          left ? 'md:text-right md:mr-6' : 'md:ml-6'
                        }`}
                      >
                        <p className="font-display text-4xl font-bold text-accent mb-3">{item.year}</p>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="hidden md:block" />
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Founder */}
        <section className="relative border-t border-white/10 py-16 md:py-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="relative rounded-3xl overflow-hidden border border-accent/40 shadow-[0_0_40px_rgba(255,95,31,0.25)] group">
                <div className="relative aspect-[4/5]">
                  <MediaImage
                    src={STAGE_IMAGES[7].src}
                    alt="Parth — Founder of Parth Production"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center min-h-[32px] px-3 py-1 rounded-full bg-accent text-black text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
                Founder & CEO
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
                Parth
              </h2>
              <p className="mt-2 text-lg text-white/70">Lead DJ & Creative Director</p>
              <p className="font-serif italic text-xl md:text-2xl text-white/90 mt-6 leading-snug">
                “Music is not just what I do — it&apos;s who I am. Every event is a canvas, and
                together we paint memories.”
              </p>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-white/80 max-w-xl mx-auto lg:mx-0">
                Built from late-night sets and early load-ins in Surat, Parth Production grew from a
                single DJ desk into a full crew for sound, light, SFX, truss, and finales. The vision
                stays simple: every date gets a system, a look, and a feeling guests remember on the
                way home.
              </p>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://www.instagram.com/parthproduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-accent hover:border-accent hover:shadow-[0_0_20px_rgba(255,95,31,0.45)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-accent hover:border-accent hover:shadow-[0_0_20px_rgba(255,95,31,0.45)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-accent hover:border-accent hover:shadow-[0_0_20px_rgba(255,95,31,0.45)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12.2c0-2-.2-3.4-.5-4.2-.3-.8-.9-1.4-1.7-1.7C18.5 6 12 6 12 6s-6.5 0-7.8.3c-.8.3-1.4.9-1.7 1.7C2.2 8.8 2 10.2 2 12.2s.2 3.4.5 4.2c.3.8.9 1.4 1.7 1.7C5.5 18.4 12 18.4 12 18.4s6.5 0 7.8-.3c.8-.3 1.4-.9 1.7-1.7.3-.8.5-2.2.5-4.2zM10 15.2V9.2l5.2 3-5.2 3z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: Values */}
        <section className="relative border-t border-white/10 py-16 md:py-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-center mb-10 md:mb-14"
            >
              Why Choose Us
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.article
                    key={value.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-3xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/65 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 6: CTA */}
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
