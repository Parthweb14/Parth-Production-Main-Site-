'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import CoverflowCarousel from '@/components/CoverflowCarousel';
import VideoShowcaseCarousel from '@/components/VideoShowcaseCarousel';
import HomeServicesGrid from '@/components/HomeServicesGrid';
import QuoteCta from '@/components/QuoteCta';
import { useAuth } from '@/context/AuthContext';
import { HERO_VIDEO } from '@/utils/media';

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
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    const a = setTimeout(() => setMinTimeElapsed(true), 1600);
    const b = setTimeout(() => setVideoLoaded(true), 4500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const isReady = videoLoaded && minTimeElapsed;

  return (
    <>
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} isReady={isReady} />
      )}
      <div className="film-grain" />
      <SpotlightNavbar />

      <main className="relative overflow-x-hidden bg-black">
        {/* HERO — cinematic full-bleed stage */}
        <section
          ref={heroRef}
          className="relative flex h-[78svh] min-h-[520px] items-end overflow-hidden bg-black md:h-[100svh] md:min-h-[640px]"
        >
          {/* Full-bleed video plane */}
          <motion.div style={{ y, scale }} className="absolute inset-0 origin-center">
            <video
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Cinematic atmosphere — vignette + steel wash (not flat black) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.82)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/25 md:from-black/80 md:via-black/40 md:to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-1/4 top-1/3 h-[50%] w-[70%] rounded-full bg-[#3A8FB8]/12 blur-[120px]"
            animate={{ opacity: [0.35, 0.55, 0.35], x: [0, 24, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Thin stage rail — visual craft, not a badge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[96px] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:top-[104px]"
          />

          <div className="relative z-10 w-full pb-14 pt-28 md:flex md:min-h-[100svh] md:items-center md:pb-24 md:pt-32">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
              <div className="relative max-w-3xl md:max-w-4xl">
                {/* Vertical accent rule */}
                <motion.span
                  aria-hidden
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -left-1 top-1 hidden h-[88%] w-px origin-top bg-gradient-to-b from-[#3A8FB8] via-[#3A8FB8]/40 to-transparent md:block lg:-left-4"
                />

                <motion.p
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-5 text-[11px] font-semibold uppercase tracking-[0.36em] text-[#3A8FB8] md:mb-6 md:text-xs md:tracking-[0.42em]"
                >
                  Parth Production
                </motion.p>

                <motion.h1
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="font-display text-[clamp(2.55rem,7.6vw,6.2rem)] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-white"
                >
                  One stop solution
                  <span className="mt-2 block md:mt-3">
                    <span className="font-serif text-[clamp(2.1rem,6.4vw,5.1rem)] font-medium normal-case italic leading-[1.05] tracking-normal text-[#3A8FB8]">
                      For unforgatable moments
                    </span>
                  </span>
                </motion.h1>

                <motion.div
                  aria-hidden
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 h-px w-24 origin-left bg-gradient-to-r from-[#3A8FB8] to-transparent md:mt-8 md:w-32"
                />

                <motion.p
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/72 md:mt-6 md:text-lg md:leading-[1.7]"
                >
                  Sound, light, SFX, truss, fireworks, and DJ artistry — built for weddings,
                  festivals, concerts, and nights that stay loud in memory.
                </motion.p>

                <motion.div
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Book a production
                  </a>
                  <Link href="/services" className="btn-ghost">
                    Services
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">
              Scroll
            </span>
            <motion.span
              className="block h-8 w-px bg-gradient-to-b from-[#3A8FB8] to-transparent"
              animate={{ scaleY: [0.55, 1, 0.55], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </section>

        <div className="overflow-hidden border-y border-white/10 bg-black py-4">
          <div className="marquee-track flex w-max gap-16 md:gap-24 whitespace-nowrap text-sm md:text-base uppercase tracking-[0.22em] text-white/65">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex gap-16 md:gap-24 px-8">
                {[
                  'Sound Systems',
                  'Stage Lighting',
                  'Cold Sparklers',
                  'Heavy Truss',
                  'Firework Finales',
                  'DJ Artistic Sets',
                  'LED Walls',
                  'Laser Beams',
                  'Generator Power',
                  'Wedding Entries',
                  'Festival Arenas',
                  'Concert Arrays',
                  'Corporate Keynotes',
                  'Road Show Rigs',
                  'Fog & CO2',
                  'Moving Heads',
                  'Live Mix',
                  'Pyro Cues',
                ].map((item) => (
                  <span key={`${loop}-${item}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div id="video-showcase">
          <VideoShowcaseCarousel />
        </div>

        <HomeServicesGrid />

        {/* Coverflow after Designed For Every Celebration */}
        <CoverflowCarousel />

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
