'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function QuoteCta() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <section className="relative bg-black border-t border-white/10 py-16 md:py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden px-6 py-16 md:px-12 md:py-24 text-center"
        style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0c05 45%, #3d1608 100%)',
          boxShadow: '0 0 0 1px rgba(255,95,31,0.25), 0 0 60px rgba(255,95,31,0.18)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

        <h2 className="relative font-display text-3xl md:text-5xl font-bold text-white text-center leading-tight">
          Your date. Our system. One crew?
        </h2>
        <p className="relative mt-4 text-sm md:text-base text-white/60 text-center max-w-md mx-auto leading-relaxed">
          Tell us the venue and vibe — we lock sound, light, SFX, truss, and DJ into one production plan.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-book-btn relative inline-flex mt-8 items-center justify-center px-8 py-3 rounded-full bg-white text-black font-semibold transition-transform duration-300 hover:scale-105"
        >
          Book your event
        </a>
      </motion.div>
    </section>
  );
}
