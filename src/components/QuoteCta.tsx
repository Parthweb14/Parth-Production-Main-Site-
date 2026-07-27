'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
  buttonLabel = 'Book Event',
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
            'radial-gradient(ellipse 70% 55% at 50% 110%, rgba(58,143,184,0.12) 0%, transparent 58%), linear-gradient(180deg, #03070e 0%, #050a12 55%, #000 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3A8FB8]/45 to-transparent"
      />

      <div className="relative overflow-hidden border-b border-white/10 bg-black/40 py-2 md:py-2.5">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40 md:gap-10 md:text-[11px]">
          {[0, 1].map((loop) => (
            <div key={loop} className="flex gap-8 md:gap-10">
              {RIBBON.map((item) => (
                <span key={`${loop}-${item}`} className="inline-flex items-center gap-8 md:gap-10">
                  <span>{item}</span>
                  <span className="text-[#3A8FB8]/70">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-tight · Desktop roomy — same content, better PC scale */}
      <div className="relative mx-auto w-full max-w-[1100px] px-5 py-9 sm:px-8 md:px-10 md:py-16 lg:py-20">
        <div className="mx-auto max-w-xl text-center md:max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease }}
            className="mb-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#3A8FB8] md:mb-4 md:text-[11px] md:tracking-[0.34em]"
          >
            Lock the night
          </motion.p>

          {lines ? (
            <h2 className="font-display font-bold uppercase tracking-tight text-white leading-[1.12] md:leading-[1.08]">
              {lines.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: 0.04 + i * 0.06, ease }}
                  className={`block text-lg sm:text-xl md:text-4xl lg:text-5xl ${
                    i === lines.length - 1 ? 'text-[#3A8FB8]' : ''
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
              className="font-display text-lg font-bold uppercase leading-[1.12] tracking-tight text-white sm:text-xl md:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h2>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
            className="mx-auto mt-2.5 max-w-md text-[11px] leading-relaxed text-white/55 md:mt-5 md:max-w-xl md:text-base md:text-white/65"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.28, ease }}
            className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3 md:mt-8 md:gap-4"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-book-btn inline-flex min-h-[42px] items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform duration-300 hover:scale-[1.03] md:min-h-[48px] md:px-8 md:text-[13px]"
            >
              {buttonLabel}
            </a>
            <Link
              href="/services"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:border-white/40 hover:bg-white/[0.07] md:min-h-[48px] md:px-7 md:text-[13px]"
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
          className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-0 border-t border-white/10 pt-4 divide-x divide-white/10 md:mt-10 md:max-w-2xl md:pt-6"
        >
          {[
            { n: '01', label: 'Date locked' },
            { n: '02', label: 'System planned' },
            { n: '03', label: 'Crew on site' },
          ].map((item) => (
            <div key={item.n} className="px-2 text-center md:px-4">
              <p className="font-display text-[10px] font-semibold tracking-[0.18em] text-[#3A8FB8] md:text-xs">
                {item.n}
              </p>
              <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70 md:mt-1.5 md:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
