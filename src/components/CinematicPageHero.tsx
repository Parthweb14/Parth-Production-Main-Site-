'use client';

import { motion } from 'framer-motion';
import MediaImage from '@/components/MediaImage';

type Chip = {
  label: string;
  href: string;
};

type CinematicPageHeroProps = {
  eyebrow: string;
  title: string;
  italicLine: string;
  description: string;
  image: string;
  chips?: Chip[];
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Shared cinematic hero matching the Services page treatment. */
export default function CinematicPageHero({
  eyebrow,
  title,
  italicLine,
  description,
  image,
  chips,
}: CinematicPageHeroProps) {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <MediaImage
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-28"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/92 to-black/75"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,rgba(0,0,0,0.65),transparent_55%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-36 pb-16 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] uppercase tracking-[0.32em] text-[#00C2FF] font-semibold mb-4"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight text-white max-w-4xl leading-[0.95]"
        >
          {title}
          <br />
          <span className="font-serif italic font-normal normal-case text-[#00C2FF]">
            {italicLine}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="mt-5 max-w-xl text-sm md:text-base text-white/65 leading-relaxed"
        >
          {description}
        </motion.p>

        {chips && chips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {chips.map((chip) => (
              <a
                key={chip.label}
                href={chip.href}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/70 transition-all hover:border-[#00C2FF]/50 hover:text-white"
              >
                {chip.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
