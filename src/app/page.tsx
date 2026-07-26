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
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { HERO_VIDEO, STAGE_IMAGES } from '@/utils/media';

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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

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
        {/* HERO */}
        <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-end md:items-center overflow-hidden bg-black">
          <motion.div style={{ y }} className="absolute inset-0">
            <video
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover brightness-[0.72]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/50" />
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
              className="font-display text-[clamp(2.4rem,7.2vw,5.8rem)] leading-[0.95] tracking-tight uppercase font-bold max-w-5xl"
            >
              One stop solution
              <br />
              <span className="text-accent">For unforgatable moments</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 max-w-xl text-white/70 text-base md:text-lg leading-relaxed"
            >
              Sound, light, SFX, truss, fireworks, and DJ artistry — built for weddings, festivals, concerts, and nights that stay loud in memory.
            </motion.p>
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Book a production
              </a>
              <Link href="/services" className="btn-ghost">
                Services
              </Link>
            </motion.div>
          </div>
        </section>

        <div className="border-y border-white/10 bg-black overflow-hidden py-4">
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-sm md:text-base uppercase tracking-[0.22em] text-white/65">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex gap-10">
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
                  <span key={`${loop}-${item}`} className="flex items-center gap-10">
                    <span>{item}</span>
                    <span className="text-accent">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div id="video-showcase">
          <VideoShowcaseCarousel />
        </div>

        <CoverflowCarousel />

        <HomeServicesGrid />

        {/* Extra still mosaic */}
        <section className="bg-black py-16 md:py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-accent mb-3 font-bold">Still Frames</p>
              <h2 className="font-display text-2xl md:text-4xl tracking-tight uppercase font-bold">
                Where Every Event Comes Alive
              </h2>
            </div>
            <Link href="/gallery" className="text-sm uppercase tracking-[0.18em] text-white/60 hover:text-accent transition-colors font-semibold">
              Open gallery →
            </Link>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {STAGE_IMAGES.slice(0, 6).map((img, i) => (
              <motion.figure
                key={img.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05 }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 group ${
                  i === 0 || i === 5 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto md:min-h-[420px]' : 'aspect-[4/3]'
                }`}
              >
                <MediaImage
                  src={img.src}
                  alt={img.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-accent mb-1">{img.tag}</p>
                  <p className="font-display text-xl">{img.title}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <div className="flex justify-center mt-10 md:mt-12">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Book your event
            </a>
          </div>
        </section>

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
