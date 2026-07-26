'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Users, Sparkles, Settings2 } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import CinematicPageHero from '@/components/CinematicPageHero';
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#ff5a3c]"
        style={{ scaleX: progress }}
      />

      <main className="relative overflow-x-hidden bg-black">
        <CinematicPageHero
          eyebrow="The crew story"
          title="About the brand"
          italicLine="built for every night."
          description="Full-stack live production. From first mic check to final firework — sound, light, SFX, truss, and DJ artistry under one crew."
          image={STAGE_IMAGES[2].src}
        />

        <section className="relative py-14 md:py-20 px-4 sm:px-6 md:px-10 overflow-hidden border-t border-white/10">
          <MediaImage
            src={STAGE_IMAGES[6].src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6 text-[#ff5a3c]">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">
                Our philosophy
              </span>
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-serif italic text-2xl md:text-4xl lg:text-5xl text-white leading-snug">
              “We don&apos;t just play music — we create moments that last forever.”
            </p>
          </motion.div>
        </section>

        <section
          id="journey"
          className="relative border-t border-white/10 py-14 md:py-20 px-4 sm:px-6 md:px-10 scroll-mt-28"
        >
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-center mb-10 md:mb-14"
            >
              Our Journey
            </motion.h2>

            <div className="relative">
              <div
                className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
                style={{
                  background:
                    'linear-gradient(180deg, transparent, rgba(255,90,60,0.7), rgba(255,255,255,0.2), transparent)',
                }}
              />

              <div className="space-y-10 md:space-y-14">
                {journey.map((item, i) => {
                  const onRight = i % 2 === 0;
                  return (
                    <motion.article
                      key={item.year}
                      initial={{ opacity: 0, x: onRight ? 28 : -28 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5 }}
                      className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12"
                    >
                      <span className="absolute left-[11px] md:left-1/2 top-8 md:top-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ff5a3c] shadow-[0_0_16px_rgba(255,90,60,0.85)] z-10" />

                      {onRight ? (
                        <>
                          <div className="hidden md:block" />
                          <div className="glass-card rounded-2xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-2 md:ml-6">
                            <p className="font-display text-4xl font-bold text-[#ff5a3c] mb-3">
                              {item.year}
                            </p>
                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="glass-card rounded-2xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-2 md:mr-6 md:text-right">
                            <p className="font-display text-4xl font-bold text-[#ff5a3c] mb-3">
                              {item.year}
                            </p>
                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                          </div>
                          <div className="hidden md:block" />
                        </>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="founder"
          className="relative border-t border-white/10 py-14 md:py-20 px-4 sm:px-6 md:px-10 scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/25 shadow-[0_0_40px_rgba(255,90,60,0.12)] group">
                <div className="relative aspect-[4/5]">
                  <MediaImage
                    src={OWNER_IMAGE}
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
              <span className="inline-flex items-center min-h-[32px] px-3 py-1 rounded-full bg-[#ff5a3c] text-black text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
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
                single DJ desk into a full crew for sound, light, SFX, truss, and finales.
              </p>
            </motion.div>
          </div>
        </section>

        <section
          id="why-us"
          className="relative border-t border-white/10 py-14 md:py-20 px-4 sm:px-6 md:px-10 scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-center mb-10 md:mb-12"
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
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff5a3c]/15 border border-[#ff5a3c]/30">
                      <Icon className="h-5 w-5 text-[#ff5a3c]" />
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

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
