'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type QuoteCtaProps = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
};

export default function QuoteCta({
  title = 'Your date. Our system. One crew?',
  subtitle = 'Tell us the venue and vibe — we lock sound, light, SFX, truss, and DJ into one production plan.',
  buttonLabel = 'Book your event',
}: QuoteCtaProps) {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <section className="relative bg-black border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative w-full px-6 py-16 md:px-12 md:py-24 text-center"
        style={{
          background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 55%, #111111 100%)',
        }}
      >
        <h2 className="relative font-display text-3xl md:text-5xl font-bold text-white text-center leading-tight">
          {title}
        </h2>
        <p className="relative mt-4 text-sm md:text-base text-white/60 text-center max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-book-btn relative inline-flex mt-8 items-center justify-center min-h-[44px] px-8 py-3 rounded-full bg-accent text-white font-semibold transition-transform duration-300 hover:scale-105"
        >
          {buttonLabel}
        </a>
      </motion.div>
    </section>
  );
}
