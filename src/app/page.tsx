'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, HERO_VIDEO, SHOW_VIDEOS, STAGE_IMAGES } from '@/utils/media';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HomePage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [page, setPage] = useState(0);
  const [craftIndex, setCraftIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  const pages = [SHOW_VIDEOS.slice(0, 3), SHOW_VIDEOS.slice(3, 6)];

  useEffect(() => {
    const a = setTimeout(() => setMinTimeElapsed(true), 1600);
    const b = setTimeout(() => setVideoLoaded(true), 4500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCraftIndex((i) => (i + 1) % CRAFT.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: page * width, behavior: 'smooth' });
  }, [page]);

  const isReady = videoLoaded && minTimeElapsed;

  return (
    <>
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} isReady={isReady} />
      )}
      <div className="film-grain" />
      <SpotlightNavbar />

      <main className="relative overflow-x-hidden">
        {/* HERO */}
        <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-end md:items-center overflow-hidden">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
            <video
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/45" />
          </motion.div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-0 pt-28">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-xs uppercase tracking-[0.28em] text-accent mb-5"
            >
              Parth Production
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(2.4rem,7.2vw,5.8rem)] leading-[0.95] tracking-[-0.03em] max-w-5xl"
            >
              One stop solution
              <br />
              <span className="text-shimmer">For unforgatable moments</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 max-w-xl text-white/70 text-base md:text-lg font-light"
            >
              Sound, light, SFX, truss, fireworks, and DJ artistry — engineered for weddings, festivals, concerts, and nights that stay loud in memory.
            </motion.p>
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase hover:bg-accent/90 transition-colors"
              >
                Book a production
              </a>
              <a
                href="#showreel"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/25 text-white text-sm font-semibold tracking-wide uppercase hover:border-white hover:bg-white/5 transition-colors"
              >
                Watch reels
              </a>
            </motion.div>
          </div>
        </section>

        {/* Infinite craft marquee */}
        <section className="border-y border-white/10 bg-black/60 overflow-hidden py-4">
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-sm md:text-base uppercase tracking-[0.22em] text-white/70">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex gap-10">
                {['Sound', 'Light', 'SFX', 'Truss', 'Firework', 'DJ Artistic', 'Stage', 'LED Walls'].map((item) => (
                  <span key={`${loop}-${item}`} className="flex items-center gap-10">
                    <span>{item}</span>
                    <span className="text-accent">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* 6 videos — 3 per view, slide for next 3 */}
        <section id="showreel" className="relative py-16 md:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs uppercase tracking-[0.22em] text-accent mb-3"
              >
                Live reels
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl md:text-5xl tracking-tight"
              >
                Six stages. One swipe.
              </motion.h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label="Previous videos"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="w-11 h-11 border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors disabled:opacity-30"
                disabled={page === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next videos"
                onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
                className="w-11 h-11 border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors disabled:opacity-30"
                disabled={page === pages.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xs tracking-[0.18em] uppercase text-white/45 ml-2">
                {page + 1} / {pages.length}
              </span>
            </div>
          </div>

          <div
            ref={deckRef}
            className="max-w-7xl mx-auto px-6 md:px-10 overflow-x-auto snap-x-mandatory scrollbar-none"
            onScroll={(e) => {
              const el = e.currentTarget;
              const next = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
              if (next !== page) setPage(next);
            }}
          >
            <div className="flex w-full">
              {pages.map((group, gi) => (
                <div
                  key={gi}
                  className="w-full flex-shrink-0 snap-start grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
                >
                  {group.map((clip, i) => (
                    <motion.article
                      key={clip.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="relative aspect-[9/16] overflow-hidden bg-neutral-950 border border-white/10 group"
                    >
                      <video
                        src={clip.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <p className="font-display text-xl tracking-tight">{clip.title}</p>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-accent">Live</span>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Craft carousel — sound/light/sfx/truss/firework/dj */}
        <section className="relative py-16 md:py-24 border-b border-white/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3">What we build</p>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-6">
                Production craft, on cue.
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {CRAFT.map((item, i) => (
                  <button
                    key={item.title}
                    onClick={() => setCraftIndex(i)}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] border transition-colors ${
                      craftIndex === i
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-white/15 text-white/55 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <AnimateCraft index={craftIndex} />
              <Link
                href="/services"
                className="inline-flex items-center gap-2 mt-8 text-sm uppercase tracking-[0.18em] text-accent hover:text-white transition-colors"
              >
                Explore services <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden border border-white/10">
              {CRAFT.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={false}
                  animate={{ opacity: craftIndex === i ? 1 : 0, scale: craftIndex === i ? 1 : 1.04 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <MediaImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <p className="absolute bottom-6 left-6 font-display text-3xl">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Image mosaic */}
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3">Still frames</p>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight">Moments under our lights</h2>
            </div>
            <Link href="/gallery" className="text-sm uppercase tracking-[0.18em] text-white/60 hover:text-accent transition-colors">
              Open gallery →
            </Link>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {STAGE_IMAGES.slice(0, 6).map((img, i) => (
              <motion.figure
                key={img.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05 }}
                className={`relative overflow-hidden border border-white/10 group ${
                  i === 0 || i === 5 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto md:min-h-[420px]' : 'aspect-[4/3]'
                }`}
              >
                <MediaImage
                  src={img.src}
                  alt={img.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-90" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-accent mb-1">{img.tag}</p>
                  <p className="font-display text-xl">{img.title}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl tracking-tight max-w-2xl leading-[1.05]"
            >
              Ready for a night that feels unforgettable?
            </motion.h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase"
              >
                WhatsApp us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-white/25 text-sm font-semibold tracking-wide uppercase hover:border-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function AnimateCraft({ index }: { index: number }) {
  const item = CRAFT[index];
  return (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h3 className="font-display text-2xl md:text-3xl mb-3">{item.title}</h3>
      <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">{item.copy}</p>
    </motion.div>
  );
}
