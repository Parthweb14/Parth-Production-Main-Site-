'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { MoreHorizontal, Plus, Share2, Trash2 } from 'lucide-react';
import { STAGE_IMAGES } from '@/utils/media';

type JournalCard = {
  id: number;
  title: string;
  category: string;
  images: string[];
  layout: 'duo' | 'trio' | 'quad';
};

const CARDS: JournalCard[] = [
  {
    id: 1,
    title: 'Concert Stage',
    category: 'Large Scale',
    layout: 'trio',
    images: [STAGE_IMAGES[1].src, STAGE_IMAGES[7].src, STAGE_IMAGES[6].src],
  },
  {
    id: 2,
    title: 'Wedding Venue',
    category: 'Premium',
    layout: 'duo',
    images: [STAGE_IMAGES[0].src, STAGE_IMAGES[5].src],
  },
  {
    id: 3,
    title: 'Corporate LED',
    category: 'Brand Events',
    layout: 'quad',
    images: [STAGE_IMAGES[3].src, STAGE_IMAGES[7].src, STAGE_IMAGES[4].src, STAGE_IMAGES[1].src],
  },
  {
    id: 4,
    title: 'Festival Floor',
    category: 'Outdoor',
    layout: 'trio',
    images: [STAGE_IMAGES[2].src, STAGE_IMAGES[6].src, STAGE_IMAGES[8].src],
  },
  {
    id: 5,
    title: 'Road Show Rig',
    category: 'Mobile',
    layout: 'duo',
    images: [STAGE_IMAGES[4].src, STAGE_IMAGES[8].src],
  },
  {
    id: 6,
    title: 'Reception Night',
    category: 'DJ Artistic',
    layout: 'trio',
    images: [STAGE_IMAGES[5].src, STAGE_IMAGES[0].src, STAGE_IMAGES[6].src],
  },
  {
    id: 7,
    title: 'Laser Arena',
    category: 'SFX & Lights',
    layout: 'quad',
    images: [STAGE_IMAGES[6].src, STAGE_IMAGES[2].src, STAGE_IMAGES[1].src, STAGE_IMAGES[7].src],
  },
  {
    id: 8,
    title: 'Mainstage Array',
    category: 'Live Sound',
    layout: 'duo',
    images: [STAGE_IMAGES[7].src, STAGE_IMAGES[1].src],
  },
  {
    id: 9,
    title: 'Campaign Build',
    category: 'Fireworks Ready',
    layout: 'trio',
    images: [STAGE_IMAGES[8].src, STAGE_IMAGES[4].src, STAGE_IMAGES[3].src],
  },
];

const SWIPE_THRESHOLD = 60;
const AUTO_MS = 5000;

function getStackStyle(offset: number, isMobile: boolean) {
  const abs = Math.abs(offset);
  if (abs > 3) {
    return {
      opacity: 0,
      scale: 0.82,
      x: offset > 0 ? 160 : -160,
      rotateY: offset > 0 ? -18 : 18,
      z: -220,
      zIndex: 0,
      filter: 'brightness(0.55)',
    };
  }

  const rotate = isMobile ? 10 : 15;
  const shift = isMobile ? 56 : 80;
  const depth = isMobile ? 70 : 100;

  if (offset === 0) {
    return {
      opacity: 1,
      scale: 1,
      x: 0,
      rotateY: 0,
      z: 0,
      zIndex: 10,
      filter: 'brightness(1)',
    };
  }

  const dir = offset < 0 ? -1 : 1;
  return {
    opacity: abs === 1 ? 0.6 : abs === 2 ? 0.4 : 0.25,
    scale: abs === 1 ? 0.9 : abs === 2 ? 0.84 : 0.78,
    x: dir * (shift + (abs - 1) * (isMobile ? 28 : 40)),
    rotateY: -dir * (rotate + (abs - 1) * 4),
    z: -(depth + (abs - 1) * 55),
    zIndex: 10 - abs,
    filter: `brightness(${Math.max(0.55, 1 - abs * 0.12)})`,
  };
}

function CardCollage({ card }: { card: JournalCard }) {
  const imgs = card.images;

  if (card.layout === 'duo') {
    return (
      <div className="grid h-full grid-rows-2 gap-1.5 p-2.5">
        {imgs.slice(0, 2).map((src, i) => (
          <div key={`${card.id}-d-${i}`} className="relative overflow-hidden rounded-xl">
            <Image src={src} alt="" fill className="object-cover" sizes="400px" loading="lazy" />
          </div>
        ))}
      </div>
    );
  }

  if (card.layout === 'trio') {
    return (
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5 p-2.5">
        <div className="relative col-span-2 row-span-1 overflow-hidden rounded-xl">
          <Image src={imgs[0]} alt="" fill className="object-cover" sizes="400px" loading="lazy" />
        </div>
        <div className="relative overflow-hidden rounded-xl">
          <Image src={imgs[1]} alt="" fill className="object-cover" sizes="200px" loading="lazy" />
        </div>
        <div className="relative overflow-hidden rounded-xl">
          <Image src={imgs[2]} alt="" fill className="object-cover" sizes="200px" loading="lazy" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5 p-2.5">
      {imgs.slice(0, 4).map((src, i) => (
        <div key={`${card.id}-q-${i}`} className="relative overflow-hidden rounded-xl">
          <Image src={src} alt="" fill className="object-cover" sizes="200px" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

export default function CoverflowCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const total = CARDS.length;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const goTo = useCallback(
    (index: number, dir = 0) => {
      const next = ((index % total) + total) % total;
      setDirection(dir);
      setCurrentIndex(next);
    },
    [total]
  );

  const next = useCallback(() => goTo(currentIndex + 1, 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1, -1), [currentIndex, goTo]);

  useEffect(() => {
    if (paused || dragging) return;
    const id = window.setInterval(() => {
      setCurrentIndex((i) => (i + 1) % total);
      setDirection(1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, dragging, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -400) next();
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 400) prev();
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-20 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_65%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5a3c]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-4 font-display text-4xl font-bold text-white md:text-6xl"
          >
            Built for the big night
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mx-auto mb-0 max-w-2xl text-base text-white/70 md:text-lg"
          >
            Drag through real stages — LED walls, corporate sets, and wedding builds from the Parth
            Production floor.
          </motion.p>
        </div>

        <div
          className="relative mx-auto flex h-[400px] items-center justify-center md:h-[500px] lg:h-[600px]"
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence initial={false} custom={direction}>
            {CARDS.map((card, index) => {
              let offset = index - currentIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
              if (Math.abs(offset) > 3) return null;

              const style = getStackStyle(offset, isMobile);
              const isActive = offset === 0;

              return (
                <motion.article
                  key={card.id}
                  className={`absolute transform-gpu cursor-grab active:cursor-grabbing ${
                    isActive
                      ? 'w-[280px] h-[350px] sm:w-[300px] sm:h-[400px] md:w-[400px] md:h-[500px]'
                      : 'w-[260px] h-[330px] sm:w-[280px] sm:h-[380px] md:w-[360px] md:h-[460px]'
                  }`}
                  style={{ transformStyle: 'preserve-3d', zIndex: style.zIndex }}
                  initial={false}
                  animate={{
                    opacity: style.opacity,
                    scale: style.scale,
                    x: style.x,
                    rotateY: style.rotateY,
                    z: style.z,
                    filter: style.filter,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  drag={isActive ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragStart={() => {
                    setDragging(true);
                    setPaused(true);
                  }}
                  onDragEnd={onDragEnd}
                  whileHover={
                    isActive
                      ? {
                          scale: 1.02,
                          boxShadow:
                            '0 25px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,90,60,0.45), 0 0 28px rgba(255,90,60,0.25)',
                        }
                      : undefined
                  }
                  onClick={() => {
                    if (!isActive) goTo(index, index > currentIndex ? 1 : -1);
                  }}
                >
                  <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#F9FAFB] shadow-2xl md:rounded-3xl">
                    <div className="relative min-h-0 flex-1 bg-neutral-200">
                      <CardCollage card={card} />
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-black/5 px-4 py-3 md:px-5 md:py-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          {card.category}
                        </p>
                        <h3 className="font-display text-lg font-bold tracking-tight text-neutral-900 md:text-xl">
                          {card.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-neutral-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2 md:mt-12">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Go to ${card.title}`}
              onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-7 bg-[#ff5a3c] shadow-[0_0_12px_rgba(255,90,60,0.55)]'
                  : 'bg-white/30 hover:bg-white/55'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 md:mt-8 md:gap-4">
          <button
            type="button"
            aria-label="More options"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20 md:h-12 md:w-12"
          >
            <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            type="button"
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20 md:h-12 md:w-12"
          >
            <Share2 className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            type="button"
            aria-label="Remove"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20 md:h-12 md:w-12"
          >
            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <Link
            href="/gallery"
            aria-label="Add new / view gallery"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20 md:h-12 md:w-12"
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
