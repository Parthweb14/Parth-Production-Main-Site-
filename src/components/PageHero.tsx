'use client';

import { motion } from 'framer-motion';
import LiquidGlassBackdrop from '@/components/LiquidGlassBackdrop';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

/** Shared inner-page hero: centered copy + cool infinite liquid-glass background. */
export default function PageHero({
  eyebrow = 'Parth Production',
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="relative flex items-center justify-center px-6 md:px-10 pt-36 md:pt-44 pb-16 md:pb-20 overflow-hidden border-b border-white/10">
      <LiquidGlassBackdrop tone="cool" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] uppercase tracking-[0.35em] text-white/50 font-semibold mb-3"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-tight leading-[0.95] text-white"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-white/65 text-sm md:text-base leading-relaxed max-w-xl mx-auto"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
