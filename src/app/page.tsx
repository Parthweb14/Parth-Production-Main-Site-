'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import VideoShowcaseCarousel from '@/components/VideoShowcaseCarousel';
import HomeServicesGrid from '@/components/HomeServicesGrid';
import { useAuth } from '@/context/AuthContext';
import { HERO_VIDEO, HERO_POSTER } from '@/utils/media';
import { prioritizeHomepageVideos } from '@/utils/videoPriority';

// Below-fold / non-video sections stay code-split; videos load first.
const CoverflowCarousel = dynamic(() => import('@/components/CoverflowCarousel'), {
  loading: () => <div className="min-h-[560px] bg-black" aria-hidden />,
});
const QuoteCta = dynamic(() => import('@/components/QuoteCta'), {
  loading: () => <div className="min-h-[280px] bg-black" aria-hidden />,
});
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="min-h-[200px] bg-black" aria-hidden />,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + 0.1 * i, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HomePage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [loadingComplete, setLoadingComplete] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('shot');
  });
  const [minTimeElapsed, setMinTimeElapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('shot');
  });
  const [posterReady, setPosterReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('shot');
  });
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    // Highest priority: start buffering hero + Beyond Events clips immediately.
    prioritizeHomepageVideos();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('shot')) {
      return;
    }
    // Fast gate: don't wait on full hero MP4 decode
    const a = setTimeout(() => setMinTimeElapsed(true), 380);
    const b = setTimeout(() => setPosterReady(true), 520);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  // Play after loader; source is attached immediately so download starts during loader.
  useEffect(() => {
    if (!loadingComplete) return;
    const video = heroVideoRef.current;
    if (!video) return;
    void video.play().catch(() => undefined);
  }, [loadingComplete]);

  const isReady = posterReady && minTimeElapsed;

  return (
    <>
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} isReady={isReady} />
      )}
      <div className="film-grain max-md:hidden motion-reduce:hidden" />
      <SpotlightNavbar />

      <main className="relative overflow-x-hidden bg-black">
        <section
          ref={heroRef}
          className="relative flex h-[85svh] min-h-[560px] items-end bg-black md:h-[100svh] md:min-h-[680px]"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div style={{ y, scale: videoScale }} className="absolute inset-0 origin-center">
              <video
                ref={heroVideoRef}
                muted
                loop
                playsInline
                preload="auto"
                poster={HERO_POSTER}
                onLoadedData={() => setPosterReady(true)}
                className="h-full w-full object-cover"
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/55" />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-[-10%] top-[30%] h-[45%] w-[55%] rounded-full bg-[#3A8FB8]/10 blur-[100px]"
            />
          </div>

          <div className="relative z-10 w-full px-5 pb-12 pt-[9.5rem] sm:px-8 sm:pb-14 md:px-10 md:pb-20 md:pt-36 lg:px-14">
            <div className="mx-auto w-full max-w-7xl">
              <div className="max-w-[40rem] md:max-w-[46rem]">
                <motion.div
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-5 flex items-center gap-3 md:mb-6"
                >
                  <span className="h-px w-8 bg-[#3A8FB8] sm:w-10" aria-hidden />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#3A8FB8] md:text-xs md:tracking-[0.36em]">
                    Parth Production
                  </p>
                </motion.div>

                <motion.h1
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="font-display text-[clamp(2.15rem,5.2vw,4.6rem)] font-semibold uppercase leading-[1.05] tracking-tight text-white"
                >
                  <span className="block">One stop solution</span>
                  <span className="mt-2 block font-serif text-[clamp(1.85rem,4.4vw,3.6rem)] font-medium normal-case italic leading-[1.2] tracking-normal text-[#3A8FB8] md:mt-3">
                    For unforgatable moments
                  </span>
                </motion.h1>

                <motion.p
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/75 md:mt-6 md:text-lg md:leading-[1.7]"
                >
                  Sound, light, SFX, truss, fireworks, and DJ artistry — built for weddings,
                  festivals, concerts, and nights that stay loud in memory.
                </motion.p>

                <motion.div
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
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
        </section>

        <div className="overflow-hidden border-y border-white/10 bg-black py-4">
          <div className="marquee-track flex w-max gap-16 whitespace-nowrap px-8 text-sm uppercase tracking-[0.22em] text-white/65 md:gap-24 md:text-base">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex gap-16 md:gap-24">
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

        <CoverflowCarousel />

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
