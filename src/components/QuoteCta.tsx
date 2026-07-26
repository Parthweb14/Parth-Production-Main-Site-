'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function QuoteCta() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <section className="relative py-16 md:py-24 bg-black border-t border-white/10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,95,31,0.12),transparent_55%)]" />
      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-6 text-accent">
          <Sparkles className="w-5 h-5 animate-pulse-soft" />
          <span className="text-[10px] uppercase tracking-[0.22em]">Parth Production</span>
          <Sparkles className="w-5 h-5 animate-pulse-soft" />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-4xl font-bold leading-snug"
        >
          Keep{' '}
          <span className="inline-block px-3 py-1 rounded-full bg-accent text-black mx-1">creating</span>{' '}
          until the night finds its own{' '}
          <span className="inline-block px-3 py-1 rounded-full bg-white text-black mx-1">audience</span>
        </motion.h2>
        <p className="mt-4 text-sm md:text-base text-white/60">— Parth Production</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex mt-8 min-h-[44px]"
        >
          Book your night
        </a>
      </div>
    </section>
  );
}
