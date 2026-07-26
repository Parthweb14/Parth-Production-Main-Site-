'use client';

import { motion } from 'framer-motion';
import LiquidGlassBackdrop from '@/components/LiquidGlassBackdrop';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageHero({
  eyebrow = 'Parth Production',
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="relative flex items-center justify-center px-6 md:px-10 pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden border-b border-white/10">
      <LiquidGlassBackdrop tone="cool" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 mb-5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-cyan-300 font-semibold">
            {eyebrow}
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-tight leading-[0.98] glass-heading"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
