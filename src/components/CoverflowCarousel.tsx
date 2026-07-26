'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GalleryHorizontal, Languages, Menu, Search, X } from 'lucide-react';
import { LOGO_PNG, STAGE_IMAGES } from '@/utils/media';

type GallerySlide = {
  id: string;
  title: string;
  description: string;
  category: string;
  src: string;
  size: 'large' | 'medium' | 'small';
};

const CATEGORIES = ['Weddings', 'Concerts', 'Corporate Events', 'Live Shows', 'Festivals'] as const;

const SLIDE_META: Array<Pick<GallerySlide, 'title' | 'description' | 'category' | 'size'>> = [
  {
    title: 'Luxury Wedding Stage',
    description:
      'Immersive lighting, premium sound systems, LED walls, synchronized effects, and flawless execution for unforgettable celebrations.',
    category: 'Weddings',
    size: 'large',
  },
  {
    title: 'Concert Production',
    description:
      'Arena-ready arrays, heavy truss, and cue-mapped lighting designed for festival-scale energy and crystal-clear FOH mixes.',
    category: 'Concerts',
    size: 'medium',
  },
  {
    title: 'Festival Lighting Design',
    description:
      'Wide-coverage lighting, laser skies, and generator-backed systems built for long nights that never drop.',
    category: 'Festivals',
    size: 'small',
  },
  {
    title: 'Corporate LED Experience',
    description:
      'Polished stages, LED canvases, and speech-first audio for launches, keynotes, and brand moments.',
    category: 'Corporate Events',
    size: 'large',
  },
  {
    title: 'Live Stage Performance',
    description:
      'Touring rigs and mobile spectacle engineered for road shows, campaigns, and high-energy live activations.',
    category: 'Live Shows',
    size: 'medium',
  },
  {
    title: 'Premium DJ Setup',
    description:
      'Reception floors with artistic DJ sets, dance lighting, and cue-timed SFX that keep every guest in the feeling.',
    category: 'Weddings',
    size: 'small',
  },
  {
    title: 'SFX Arena Night',
    description:
      'Cold sparklers, lasers, haze, and atmospheric hits programmed to the beat for immersive live rooms.',
    category: 'Live Shows',
    size: 'medium',
  },
  {
    title: 'Mainstage Sound System',
    description:
      'Line arrays, monitors, and digital consoles tuned for concerts and festival main stages.',
    category: 'Concerts',
    size: 'large',
  },
  {
    title: 'Fireworks Finale Build',
    description:
      'Indoor and outdoor pyrotechnics staged for finales that close the night with lasting impact.',
    category: 'Festivals',
    size: 'small',
  },
];

const BASE_SLIDES: GallerySlide[] = SLIDE_META.map((meta, i) => ({
  id: `stage-${i}`,
  ...meta,
  src: STAGE_IMAGES[i % STAGE_IMAGES.length].src,
}));

const SIZE_CLASS: Record<GallerySlide['size'], string> = {
  large: 'w-[86vw] sm:w-[70vw] md:w-[48%] lg:w-[46%]',
  medium: 'w-[86vw] sm:w-[58vw] md:w-[36%] lg:w-[34%]',
  small: 'w-[86vw] sm:w-[50vw] md:w-[28%] lg:w-[26%]',
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function CoverflowCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Weddings');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const matches = BASE_SLIDES.filter((slide) => slide.category === category);
    return matches.length ? matches : BASE_SLIDES;
  }, [category]);

  // Triple for infinite loop feel
  const loopSlides = useMemo(
    () => [...filtered, ...filtered, ...filtered].map((slide, i) => ({
      ...slide,
      key: `${slide.id}-${i}`,
      loopIndex: i,
    })),
    [filtered]
  );

  const segmentLength = filtered.length;

  const jumpToMiddle = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || segmentLength === 0) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-stage-card]');
    const midStart = segmentLength;
    const target = cards[midStart];
    if (!target) return;
    el.scrollLeft = target.offsetLeft - 8;
    setActiveIndex(0);
  }, [segmentLength]);

  useEffect(() => {
    jumpToMiddle();
  }, [jumpToMiddle, category]);

  const updateActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || segmentLength === 0) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-stage-card]'));
    if (!cards.length) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let nearestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });

    // Infinite loop reposition near edges
    if (nearest < segmentLength * 0.5) {
      const twin = cards[nearest + segmentLength];
      if (twin) {
        el.scrollLeft += twin.offsetLeft - cards[nearest].offsetLeft;
        nearest += segmentLength;
      }
    } else if (nearest >= segmentLength * 2.5) {
      const twin = cards[nearest - segmentLength];
      if (twin) {
        el.scrollLeft -= cards[nearest].offsetLeft - twin.offsetLeft;
        nearest -= segmentLength;
      }
    }

    setActiveIndex(((nearest % segmentLength) + segmentLength) % segmentLength);
  }, [segmentLength]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateActive();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [updateActive]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-stage-card]');
    if (!cards.length) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let nearestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    const next = Math.max(0, Math.min(cards.length - 1, nearest + dir));
    cards[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.scrollLeft - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current.active = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByCard(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease }}
      className="relative w-full overflow-hidden bg-black py-20 px-6 md:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.02]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay stage-noise" />

      <div className="relative mx-auto w-full max-w-[1400px]">
        {/* TOP NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-6 md:mb-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 backdrop-blur-[20px] md:px-4"
        >
          <button
            type="button"
            aria-label={filtersOpen ? 'Close filters' : 'Open filters'}
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 hover:border-[#ff5a3c]/50 hover:text-[#ff5a3c] md:hidden"
          >
            {filtersOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label="Toggle category filters"
            onClick={() => setFiltersOpen((v) => !v)}
            className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 hover:border-[#ff5a3c]/50 hover:text-[#ff5a3c] md:flex"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div
            className={`${
              filtersOpen ? 'flex' : 'hidden md:flex'
            } absolute left-4 right-4 top-[calc(100%+10px)] z-20 flex-col gap-2 rounded-3xl border border-white/10 bg-black/90 p-3 backdrop-blur-xl md:static md:flex-1 md:flex-row md:items-center md:justify-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none`}
          >
            {CATEGORIES.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setFiltersOpen(false);
                  }}
                  className={`min-h-[40px] whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 md:px-4 ${
                    active
                      ? 'border-[#ff5a3c] bg-[#ff5a3c] text-white shadow-[0_0_22px_rgba(255,90,60,0.35)]'
                      : 'border-white/15 bg-transparent text-white/70 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2">
            <button
              type="button"
              aria-label="Search projects"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition-all duration-300 hover:border-[#ff5a3c]/50 hover:text-[#ff5a3c]"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/gallery"
              aria-label="Open gallery"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition-all duration-300 hover:border-[#ff5a3c]/50 hover:text-[#ff5a3c]"
            >
              <GalleryHorizontal className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Language English"
              className="hidden h-11 items-center gap-1.5 rounded-full border border-white/10 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 transition-all duration-300 hover:border-[#ff5a3c]/50 hover:text-[#ff5a3c] sm:inline-flex"
            >
              <Languages className="h-3.5 w-3.5" />
              EN
            </button>
          </div>
        </motion.div>

        {/* MAIN SHOWCASE PANEL */}
        <div className="rounded-[32px] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-[20px] md:p-8">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="max-w-3xl"
            >
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ff5a3c]">
                Live Event Showcase
              </p>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
                Stage Gallery
              </h2>
              <p className="mt-2 font-serif italic text-2xl text-[#ff5a3c] md:text-3xl">
                Built for the Big Night.
              </p>
              <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#b8b8b8] md:text-[20px]">
                Drag through real stages — LED walls, corporate sets, wedding productions, concerts,
                lighting setups, DJ performances, and custom builds from the Parth Production floor.
              </p>
            </motion.div>

            <Link
              href="/gallery"
              className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-white px-7 text-sm font-bold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-[#ff5a3c] hover:text-white hover:shadow-[0_0_28px_rgba(255,90,60,0.35)]"
            >
              View All Projects
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="relative"
          >
            <div
              ref={scrollerRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Stage gallery carousel"
              tabIndex={0}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="flex cursor-grab gap-4 overflow-x-auto pb-2 scrollbar-none active:cursor-grabbing md:gap-5 snap-x snap-mandatory select-none"
              style={{ scrollBehavior: 'smooth' }}
            >
              {loopSlides.map((slide, i) => {
                const logical = i % segmentLength;
                const isActive = logical === activeIndex;
                return (
                  <article
                    key={slide.key}
                    data-stage-card
                    className={`stage-gallery-card group relative h-[380px] flex-shrink-0 snap-center overflow-hidden rounded-[28px] border border-white/[0.08] md:h-[520px] ${SIZE_CLASS[slide.size]} ${
                      isActive ? 'opacity-100' : 'opacity-70'
                    }`}
                    style={{
                      transition: 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out, border-color 0.45s ease, box-shadow 0.45s ease',
                      transform: isActive ? 'scale(1.03)' : 'scale(0.97)',
                    }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.title}
                      fill
                      loading="lazy"
                      sizes="(max-width:768px) 86vw, (max-width:1024px) 50vw, 40vw"
                      className="object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.08]"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-90 transition-opacity duration-450 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 transition-transform duration-[450ms] ease-out group-hover:-translate-y-1">
                      <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl lg:text-[2rem]">
                        {slide.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#b8b8b8] line-clamp-2 md:text-[15px]">
                        {slide.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM INFORMATION BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.12 }}
          className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2.5 backdrop-blur-[20px] md:mt-8 md:gap-5 md:px-5 md:py-3"
        >
          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-white/15 bg-black md:h-12 md:w-12">
            <Image src={LOGO_PNG} alt="Parth Production" fill className="object-contain p-1.5" />
          </div>
          <p className="min-w-0 flex-1 font-serif italic text-sm leading-snug text-[#b8b8b8] md:text-center md:text-lg md:text-white/85">
            &ldquo;Every stage tells a different story. Every production leaves a lasting
            impression.&rdquo;
          </p>
          <button
            type="button"
            aria-label="Next stage"
            onClick={() => scrollByCard(1)}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white text-black transition-all duration-300 hover:border-[#ff5a3c] hover:bg-[#ff5a3c] hover:text-white hover:shadow-[0_0_24px_rgba(255,90,60,0.35)] md:h-12 md:w-12"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
