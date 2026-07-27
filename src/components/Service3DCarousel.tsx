'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import MediaImage from '@/components/MediaImage';
import { STAGE_IMAGES, CRAFT } from '@/utils/media';

type ServiceCard = {
  id: number;
  badge: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  href: string;
};

const SERVICES: ServiceCard[] = [
  {
    id: 1,
    badge: 'Popular',
    title: 'Concerts',
    description:
      'Line arrays, heavy truss, and cue-mapped lighting built for festival-scale energy and crystal-clear FOH mix.',
    image: STAGE_IMAGES[1].src,
    ctaLabel: 'Learn More',
    href: '/services#concerts',
  },
  {
    id: 2,
    badge: 'Premium',
    title: 'Weddings',
    description:
      'Ceremony-to-reception systems — bridal entries, varmala cues, dance-floor light, and cold sparkler finales.',
    image: STAGE_IMAGES[0].src,
    ctaLabel: 'Learn More',
    href: '/services#weddings',
  },
  {
    id: 3,
    badge: 'Outdoor',
    title: 'Festivals',
    description:
      'Wide-coverage sound, laser skies, and generator-backed nights engineered for long sets that never drop.',
    image: STAGE_IMAGES[2].src,
    ctaLabel: 'Learn More',
    href: '/services#festivals',
  },
  {
    id: 4,
    badge: 'Polished',
    title: 'Corporate',
    description:
      'Clean speech, LED canvases, and silent power for launches, keynotes, and brand-forward stage moments.',
    image: STAGE_IMAGES[3].src,
    ctaLabel: 'Learn More',
    href: '/services#corporate',
  },
  {
    id: 5,
    badge: 'Touring',
    title: 'Road Shows',
    description:
      'Mobile LED, touring audio, and quick-deploy rigs that travel with the campaign from day stage to night finale.',
    image: STAGE_IMAGES[4].src,
    ctaLabel: 'Learn More',
    href: '/services#road-shows',
  },
  {
    id: 6,
    badge: 'Core',
    title: 'Sound',
    description: CRAFT[0].copy,
    image: CRAFT[0].image,
    ctaLabel: 'Learn More',
    href: '/services',
  },
  {
    id: 7,
    badge: 'Visual',
    title: 'Lighting',
    description: CRAFT[1].copy,
    image: CRAFT[1].image,
    ctaLabel: 'Learn More',
    href: '/services',
  },
  {
    id: 8,
    badge: 'Live',
    title: 'DJ Artists',
    description: CRAFT[2].copy,
    image: CRAFT[2].image,
    ctaLabel: 'Learn More',
    href: '/services',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function wrapIndex(i: number, total: number) {
  return ((i % total) + total) % total;
}

function slotStyle(offset: number, isWide: boolean) {
  const x = offset * (isWide ? 300 : 240);
  const rotateY = offset * -28;
  const z = offset === 0 ? 80 : -180;
  const scale = offset === 0 ? 1 : 0.82;
  const opacity = offset === 0 ? 1 : 0.7;
  return { x, rotateY, z, scale, opacity };
}

export default function Service3DCarousel() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const total = SERVICES.length;

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setIsWide(window.innerWidth >= 1024);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => wrapIndex(i + dir, total));
    },
    [total]
  );

  const current = SERVICES[active];

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,85,255,0.18) 0%, transparent 58%), radial-gradient(ellipse 40% 35% at 20% 80%, rgba(0,194,255,0.08) 0%, transparent 50%), linear-gradient(180deg, #000 0%, #050b14 50%, #000 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[45%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00C2FF]/12 blur-[100px] md:h-[420px] md:w-[420px]"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-10">
        <div className="mb-10 text-center md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00C2FF]"
          >
            Production systems
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-[1.85rem] font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            Systems in depth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-[15px]"
          >
            Interactive glass cards in true perspective — active system front and center, neighbors
            at depth with a natural tilt.
          </motion.p>
        </div>

        {!isMobile ? (
          <div
            className="relative mx-auto mb-10 h-[460px] md:h-[520px]"
            style={{ perspective: '1600px', perspectiveOrigin: '50% 45%' }}
          >
            <div
              className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {([-1, 0, 1] as const).map((offset) => {
                const index = wrapIndex(active + offset, total);
                const card = SERVICES[index];
                const s = slotStyle(offset, isWide);
                return (
                  <motion.div
                    key={`${card.id}-${offset === 0 ? 'c' : offset}`}
                    className={`absolute w-[260px] md:w-[320px] lg:w-[340px] ${
                      offset === 0 ? 'z-20' : 'z-10 pointer-events-none'
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{
                      x: s.x,
                      rotateY: s.rotateY,
                      z: s.z,
                      scale: s.scale,
                      opacity: s.opacity,
                    }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <GlassServiceCard card={card} featured={offset === 0} dimmed={offset !== 0} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative mx-auto mb-8 max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.35, ease }}
              >
                <GlassServiceCard card={current} featured />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous service"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00C2FF]/35 bg-[#001A33]/60 text-white backdrop-blur transition-all hover:border-[#00C2FF]/70 hover:shadow-[0_0_24px_rgba(0,194,255,0.35)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {SERVICES.map((card, i) => (
              <button
                key={card.id}
                type="button"
                aria-label={`Go to ${card.title}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-6 bg-[#00C2FF] shadow-[0_0_12px_rgba(0,194,255,0.65)]'
                    : 'w-1.5 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next service"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00C2FF]/35 bg-[#001A33]/60 text-white backdrop-blur transition-all hover:border-[#00C2FF]/70 hover:shadow-[0_0_24px_rgba(0,194,255,0.35)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function GlassServiceCard({
  card,
  featured = false,
  dimmed = false,
}: {
  card: ServiceCard;
  featured?: boolean;
  dimmed?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[24px] border transition-shadow duration-400 ${
        featured
          ? 'border-[#00C2FF]/45 shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(0,194,255,0.22)]'
          : 'border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.45)]'
      } ${dimmed ? 'pointer-events-none' : ''}`}
      style={{
        background:
          'linear-gradient(160deg, rgba(0,40,90,0.55) 0%, rgba(0,20,45,0.72) 45%, rgba(0,8,20,0.88) 100%)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[24px]"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,194,255,0.12), inset 1px 0 0 rgba(0,194,255,0.08)',
        }}
      />

      <div className="relative aspect-[16/11] overflow-hidden">
        <MediaImage
          src={card.image}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-black/25 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-[#00C2FF]/40 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#00C2FF] backdrop-blur">
          {card.badge}
        </span>
      </div>

      <div className="relative p-5 md:p-6">
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white md:text-2xl">
          {card.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60 line-clamp-3">{card.description}</p>
        <Link
          href={card.href}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#00C2FF]/40 bg-[#00C2FF]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#00C2FF] transition-all hover:border-[#00C2FF]/70 hover:bg-[#00C2FF]/20 hover:shadow-[0_0_20px_rgba(0,194,255,0.35)]"
        >
          {card.ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
