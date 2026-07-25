'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import PageLoader from '@/components/PageLoader';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const reel = [
  { title: 'Weddings', video: 'https://assets.parthproduction.in/Video%201%20.mp4' },
  { title: 'Concerts', video: 'https://assets.parthproduction.in/Video%202%20.mp4' },
  { title: 'Festivals', video: 'https://assets.parthproduction.in/Video%203.mp4' },
  { title: 'Corporate', video: 'https://assets.parthproduction.in/Video%204.mp4' },
  { title: 'Road Shows', video: 'https://assets.parthproduction.in/Video%205.mp4' },
  { title: 'SFX', video: 'https://assets.parthproduction.in/Video%206.mp4' },
  { title: 'VIP Nights', video: 'https://assets.parthproduction.in/Video%207.mp4' },
];

export default function HomePage() {
  const { siteSettings } = useAuth();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), 1800);
    const fallbackTimer = setTimeout(() => setVideoLoaded(true), 5000);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame = 0;
    let paused = false;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    const tick = () => {
      if (!paused) {
        el.scrollLeft += 0.45;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollLeft = 0;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
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

      <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
        {/* Hero — brand + one line + one CTA + full-bleed video */}
        <section ref={heroRef} className="relative h-[100svh] min-h-[560px] flex items-end md:items-center overflow-hidden">
          <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
            <video
              src="https://assets.parthproduction.in/Hero%20Background%20video%20-%20Trim.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover brightness-[0.72]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50" />
          </motion.div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-0 pt-28">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-white max-w-5xl"
            >
              Parth Production
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
              className="mt-5 max-w-xl text-base md:text-lg text-white/70 font-light leading-relaxed"
            >
              Sound, light, and stage systems built for weddings, festivals, and live shows across India.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="mt-9"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase hover:bg-accent/90 transition-colors"
              >
                Book a production
              </a>
            </motion.div>
          </div>
        </section>

        {/* One job: show the work */}
        <section id="showcase" className="relative border-t border-white/10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white">
                Recent stages
              </h2>
              <p className="mt-3 text-sm md:text-base text-white/55 max-w-md">
                Live systems from intimate ceremonies to arena-scale festivals.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-sm uppercase tracking-[0.18em] text-accent hover:text-white transition-colors"
            >
              View gallery →
            </Link>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory px-6 md:px-12"
          >
            {reel.map((item) => (
              <article
                key={item.title}
                className="relative flex-shrink-0 w-[42vw] sm:w-[28vw] md:w-[18vw] aspect-[9/16] snap-start overflow-hidden bg-neutral-950 group"
              >
                <video
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 font-display text-lg md:text-xl tracking-tight">
                  {item.title}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* One job: close the loop */}
        <section className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white leading-[1.05]">
                Ready when the lights go up.
              </h2>
              <p className="mt-4 text-white/55 text-sm md:text-base max-w-lg">
                Tell us the date, venue, and scale — we design the audio, lighting, and stage plan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase hover:bg-accent/90 transition-colors"
              >
                WhatsApp us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-white/25 text-white text-sm font-semibold tracking-wide uppercase hover:border-white hover:bg-white/5 transition-colors"
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
