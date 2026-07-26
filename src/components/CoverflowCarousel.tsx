'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Palette, Zap } from 'lucide-react';
import { STAGE_IMAGES } from '@/utils/media';

const CARDS = [
  { id: 1, category: 'Concerts', src: STAGE_IMAGES[1].src, title: 'LED Mainstage' },
  { id: 2, category: 'Weddings', src: STAGE_IMAGES[0].src, title: 'Elegant Lighting' },
  { id: 3, category: 'Festivals', src: STAGE_IMAGES[2].src, title: 'Festival Floor' },
  { id: 4, category: 'Corporate', src: STAGE_IMAGES[3].src, title: 'Brand Stage' },
  { id: 5, category: 'Road Shows', src: STAGE_IMAGES[4].src, title: 'Mobile Rig' },
  { id: 6, category: 'DJ Booth', src: STAGE_IMAGES[5].src, title: 'Neon DJ Desk' },
  { id: 7, category: 'SFX', src: STAGE_IMAGES[6].src, title: 'Fog & Lasers' },
  { id: 8, category: 'Truss', src: STAGE_IMAGES[7].src, title: 'Overhead Rig' },
];

const LOOP = [...CARDS, ...CARDS];

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning-Fast Setup',
    description:
      'From concept to execution in record time. Our expert crew transforms venues into stunning stages within hours, not days.',
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.1)',
  },
  {
    icon: Palette,
    title: 'Multiple Styles & Customization',
    description:
      "From intimate weddings to massive festivals. Pick your vibe — elegant, energetic, or explosive — and we'll bring it to life.",
    color: '#FF00E5',
    glow: 'rgba(255, 0, 229, 0.1)',
  },
  {
    icon: Monitor,
    title: 'High-Impact Productions',
    description:
      'Crystal-clear sound, breathtaking visuals, and effects that leave lasting impressions. Professional quality guaranteed.',
    color: '#7000FF',
    glow: 'rgba(112, 0, 255, 0.1)',
  },
];

export default function CoverflowCarousel() {
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const running = !paused && !hidden;

  return (
    <section className="relative w-full overflow-hidden bg-black py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[42%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00F0FF]/[0.05] blur-3xl animate-pulse" />
        <div className="absolute left-[30%] top-[50%] h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-[#FF00E5]/[0.05] blur-3xl" />
        <div className="absolute right-[25%] top-[48%] h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-[#7000FF]/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 font-display text-3xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            Create Stunning Events with Just a Vision
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mx-auto mb-10 max-w-2xl text-base text-white/60 md:text-lg"
          >
            Turn your ideas into unforgettable experiences in seconds — no event planning stress
            needed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-[#00F0FF]/60 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(0,240,255,0.25)]"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Infinite 3D carousel */}
        <div
          className="relative mb-20 h-[380px] md:h-[500px] lg:h-[600px]"
          style={{ perspective: '2000px' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute left-1/2 top-0 z-40 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#00F0FF]/70 to-transparent opacity-60" />

          <div className="absolute inset-0 flex items-center overflow-hidden">
            <motion.div
              className="flex will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
              animate={running ? { x: ['0%', '-50%'] } : undefined}
              transition={
                running
                  ? { duration: 40, repeat: Infinity, ease: 'linear', repeatType: 'loop' }
                  : undefined
              }
            >
              {LOOP.map((card, i) => (
                <div
                  key={`${card.id}-${i}`}
                  className="relative mx-3 h-[350px] w-[280px] flex-shrink-0 md:mx-4 md:h-[500px] md:w-[400px]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <article className="infinite-3d-card group relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:border-[#00F0FF]/60 hover:shadow-[0_0_60px_rgba(0,240,255,0.3)]">
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      loading="lazy"
                      sizes="(max-width:768px) 280px, 400px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-[#00F0FF] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black">
                      {card.category}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                        {card.title}
                      </h3>
                    </div>
                  </article>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-2 md:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/[0.05]"
                style={{
                  // hover border via box-shadow using feature color
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = feature.color;
                  e.currentTarget.style.boxShadow = `0 0 28px ${feature.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="mb-5 inline-flex rounded-2xl p-4"
                  style={{ background: feature.glow }}
                >
                  <Icon className="h-12 w-12" style={{ color: feature.color }} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
