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
const DEFAULT_LINES = ['Your date. Our system.', 'One crew.'] as const;

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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 115%, rgba(0,194,255,0.16) 0%, transparent 55%), linear-gradient(180deg, #050505 0%, #050b14 55%, #000 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/40 to-transparent"
      />

      <div className="relative border-b border-white/10 bg-black/40 py-2 overflow-hidden">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
          {[0, 1].map((loop) => (
            <div key={loop} className="flex gap-8">
              {RIBBON.map((item) => (
                <span key={`${loop}-${item}`} className="inline-flex items-center gap-8">
                  <span>{item}</span>
                  <span className="text-[#00C2FF]/70">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[900px] px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease }}
            className="mb-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#00C2FF]"
          >
            Lock the night
          </motion.p>

          {lines ? (
            <h2 className="font-display font-bold uppercase tracking-tight text-white leading-[1.15]">
              {lines.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: 0.04 + i * 0.06, ease }}
                  className={`block text-lg md:text-xl ${
                    i === lines.length - 1 ? 'text-[#00C2FF]' : ''
                  }`}
                >
                  {line}
                </motion.span>
              ))}
            </h2>
          ) : (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease }}
              className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-white leading-[1.15]"
            >
              {title}
            </motion.h2>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
            className="mx-auto mt-2.5 max-w-md text-[11px] md:text-xs leading-relaxed text-white/55"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.28, ease }}
            className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-book-btn inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              {buttonLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/services"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:border-white/40 hover:bg-white/[0.07]"
            >
              Explore systems
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35, ease }}
          className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-0 border-t border-white/10 pt-4 divide-x divide-white/10"
        >
          {[
            { n: '01', label: 'Date locked' },
            { n: '02', label: 'System planned' },
            { n: '03', label: 'Crew on site' },
          ].map((item) => (
            <div key={item.n} className="text-center px-2">
              <p className="font-display text-[10px] font-semibold tracking-[0.18em] text-[#00C2FF]">
                {item.n}
              </p>
              <p className="mt-1 font-display text-[10px] md:text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
