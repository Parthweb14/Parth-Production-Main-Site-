'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type QuoteCtaProps = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
};

export default function QuoteCta({
  title = 'Ready to lock your production plan?',
  subtitle = 'Tell us the venue and vibe — we sync sound, light, SFX, truss, and DJ into one system.',
  buttonLabel = 'Book your event',
}: QuoteCtaProps) {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <section className="relative border-t border-white/10 bg-[#0A0E27] overflow-hidden">
      <div className="absolute inset-0 site-grid opacity-30" />
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative max-w-5xl mx-4 md:mx-auto my-12 md:my-16 px-6 py-14 md:px-12 md:py-20 text-center saas-card"
      >
        <p className="section-label mb-4">Next show</p>
        <h2 className="relative font-display text-3xl md:text-5xl font-semibold text-white text-center leading-tight">
          {title}
        </h2>
        <p className="relative mt-4 text-sm md:text-base text-slate-400 text-center max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-book-btn relative inline-flex mt-8 items-center justify-center min-h-[44px] px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 text-[#0A0E27] font-semibold transition-transform duration-300 hover:scale-105"
        >
          {buttonLabel}
        </a>
      </motion.div>
    </section>
  );
}
