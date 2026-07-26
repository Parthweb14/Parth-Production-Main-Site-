'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type QuoteCtaProps = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
};

const DEFAULT_TITLE = 'Your date. Our system. One crew.';
const DEFAULT_LINES = ['Your date.', 'Our system.', 'One crew.'] as const;

const RIBBON = [
  'Sound',
  'Lighting',
  'SFX',
  'Truss',
  'Fireworks',
  'DJ Artists',
  'LED Walls',
  'Concerts',
  'Weddings',
  'Festivals',
  'Corporate',
  'Road Shows',
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function QuoteCta({
  title = DEFAULT_TITLE,
  subtitle = 'Tell us the venue and vibe — we lock sound, light, SFX, truss, and DJ into one production plan.',
  buttonLabel = 'Book your event',
}: QuoteCtaProps) {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const normalized = title.replace(/\?$/, '').trim();
  const isDefault =
    normalized.toLowerCase() === DEFAULT_TITLE.toLowerCase() ||
    normalized.toLowerCase() === 'your date. our system. one crew';
  const lines = isDefault ? DEFAULT_LINES : null;

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black">
      {/* Stage atmosphere — not a flat slab */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 110%, rgba(255,90,60,0.28) 0%, transparent 58%), radial-gradient(ellipse 45% 40% at 15% 20%, rgba(255,95,31,0.08) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 85% 25%, rgba(255,180,80,0.06) 0%, transparent 50%), linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #000 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff5a3c]/50 to-transparent"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5a3c]/20 blur-[100px] md:h-[420px] md:w-[420px]"
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top production ribbon */}
      <div className="relative border-b border-white/10 bg-black/40 py-3 overflow-hidden">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap px-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
          {[0, 1].map((loop) => (
            <div key={loop} className="flex gap-10">
              {RIBBON.map((item) => (
                <span key={`${loop}-${item}`} className="inline-flex items-center gap-10">
                  <span>{item}</span>
                  <span className="text-[#ff5a3c]/80">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease }}
            className="mb-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#ff5a3c]"
          >
            Lock the night
          </motion.p>

          {lines ? (
            <h2 className="font-display font-bold uppercase tracking-tight text-white leading-[0.92]">
              {lines.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: 0.08 + i * 0.12, ease }}
                  className={`block text-[clamp(2.4rem,8vw,5.75rem)] ${
                    i === lines.length - 1 ? 'text-[#ff5a3c]' : ''
                  }`}
                >
                  {line}
                </motion.span>
              ))}
            </h2>
          ) : (
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, ease }}
              className="font-display text-[clamp(2rem,6vw,4.25rem)] font-bold uppercase tracking-tight text-white leading-[0.95]"
            >
              {title}
            </motion.h2>
          )}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.35, ease }}
            className="mx-auto mt-6 max-w-xl text-sm md:text-base leading-relaxed text-white/60"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.45, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-book-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#ff5a3c] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              {buttonLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/services"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:border-white/40 hover:bg-white/[0.07]"
            >
              Explore systems
            </Link>
          </motion.div>
        </div>

        {/* Editorial beats — typography only, not cards */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.55, ease }}
          className="mx-auto mt-14 md:mt-16 grid max-w-3xl grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10"
        >
          {[
            { n: '01', label: 'Date locked' },
            { n: '02', label: 'System planned' },
            { n: '03', label: 'Crew on site' },
          ].map((item) => (
            <div key={item.n} className="text-center px-4">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-[#ff5a3c]">
                {item.n}
              </p>
              <p className="mt-2 font-display text-sm md:text-base font-semibold uppercase tracking-[0.14em] text-white/80">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
