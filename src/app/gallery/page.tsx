'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import MediaImage from '@/components/MediaImage';
import CinematicPageHero from '@/components/CinematicPageHero';
import { STAGE_IMAGES, resolveGallerySrc } from '@/utils/media';

type GalleryItem = {
  id: string | number;
  category: string;
  title: string;
  src: string;
};

const defaults: GalleryItem[] = STAGE_IMAGES.map((img, i) => ({
  id: i + 1,
  category: img.title,
  title: img.tag,
  src: img.src,
}));

const filters = ['All', 'Weddings', 'Festivals', 'Concerts', 'Corporate', 'Road Shows'];

const SIZE_CYCLE = [
  'md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[420px]',
  'md:col-span-1 min-h-[220px] md:min-h-[200px]',
  'md:col-span-1 min-h-[220px] md:min-h-[200px]',
  'md:col-span-1 min-h-[220px] md:min-h-[240px]',
  'md:col-span-2 min-h-[220px] md:min-h-[240px]',
  'md:col-span-1 min-h-[220px] md:min-h-[240px]',
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(defaults);
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/data');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.images?.length) return;
        const mapped: GalleryItem[] = data.images.map(
          (item: { id: string; category: string; image_url: string }, idx: number) => {
            const fallback = defaults[idx % defaults.length].src;
            return {
              id: item.id || idx,
              category: item.category || 'Events',
              title: item.category || 'Live stage',
              src: resolveGallerySrc(item.image_url, fallback),
            };
          }
        );
        setItems(mapped.length ? mapped : defaults);
      } catch {
        // keep defaults
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return items;
    return items.filter((item) => {
      const cat = item.category.toLowerCase();
      const f = filter.toLowerCase();
      return cat === f || cat.includes(f.replace(/s$/, '')) || f.includes(cat.replace(/s$/, ''));
    });
  }, [filter, items]);

  useEffect(() => {
    if (!filtered.length) return;
    const id = window.setInterval(() => {
      setFeatured((i) => (i + 1) % Math.min(filtered.length, 6));
    }, 3200);
    return () => window.clearInterval(id);
  }, [filtered.length]);

  const spotlight = filtered[featured % Math.max(filtered.length, 1)] || filtered[0];
  const reel = [...filtered, ...filtered].slice(0, Math.max(12, filtered.length * 2));

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="relative overflow-x-hidden bg-black">
        <CinematicPageHero
          eyebrow="Live archive"
          title="Frames from"
          italicLine="the production floor."
          description="Weddings, festivals, concerts, corporate stages, and road shows — captured under Parth Production systems."
          image={STAGE_IMAGES[1].src}
          chips={filters.map((f) => ({
            label: f,
            href: `#gallery-grid`,
          }))}
        />

        {/* Cinematic spotlight + floating reel */}
        <section className="relative border-b border-white/10 py-12 md:py-16 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5a3c]/15 blur-[120px]" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-10">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#ff5a3c] font-semibold mb-2">
                  Spotlight reel
                </p>
                <h2 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
                  Motion from the floor
                </h2>
              </div>
              <p className="hidden md:block text-sm text-white/45 max-w-xs text-right">
                Auto-cycling featured frames with an infinite image ribbon underneath.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-8">
              <AnimatePresence mode="wait">
                {spotlight && (
                  <motion.button
                    key={String(spotlight.id) + spotlight.src}
                    type="button"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45 }}
                    onClick={() => {
                      const idx = filtered.findIndex((f) => f.id === spotlight.id);
                      setActive(idx >= 0 ? idx : 0);
                    }}
                    className="relative lg:col-span-8 aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 text-left group"
                  >
                    <MediaImage
                      src={spotlight.src}
                      alt={spotlight.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-[#ff5a3c]" />
                      Now featuring
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#ff5a3c] font-semibold">
                        {spotlight.category}
                      </p>
                      <h3 className="mt-2 font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
                        {spotlight.title}
                      </h3>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                {filtered.slice(0, 4).map((item, i) => (
                  <motion.button
                    key={`side-${item.id}`}
                    type="button"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => {
                      setFeatured(i);
                      const idx = filtered.findIndex((f) => f.id === item.id);
                      setActive(idx >= 0 ? idx : 0);
                    }}
                    className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[92px] overflow-hidden rounded-2xl border text-left transition-all ${
                      featured % Math.max(filtered.length, 1) === i
                        ? 'border-[#ff5a3c]/60 shadow-[0_0_24px_rgba(255,90,60,0.25)]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <MediaImage
                      src={item.src}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/80">
                        {item.category}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] py-4">
              <motion.div
                className="flex w-max gap-3"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                {reel.map((item, i) => (
                  <button
                    key={`reel-${item.id}-${i}`}
                    type="button"
                    onClick={() => {
                      const idx = filtered.findIndex((f) => f.id === item.id);
                      setActive(idx >= 0 ? idx : 0);
                    }}
                    className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 md:h-28 md:w-48"
                  >
                    <MediaImage
                      src={item.src}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters + mosaic */}
        <section
          id="gallery-grid"
          className="sticky top-[88px] md:top-[96px] z-30 border-b border-white/10 bg-black/75 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex gap-2 overflow-x-auto scrollbar-none justify-start md:justify-center">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 min-h-[44px] rounded-full border px-4 md:px-5 text-xs md:text-sm uppercase tracking-[0.14em] font-semibold transition-all ${
                  filter === f
                    ? 'border-[#ff5a3c] bg-[#ff5a3c]/15 text-white shadow-[0_0_20px_rgba(255,90,60,0.2)]'
                    : 'border-white/10 text-white/55 hover:border-white/30 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((image, idx) => (
                <motion.button
                  layout
                  key={`${image.id}-${image.src}`}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                  onClick={() => setActive(idx)}
                  className={`group relative overflow-hidden rounded-[22px] border border-white/10 text-left ${
                    SIZE_CYCLE[idx % SIZE_CYCLE.length]
                  }`}
                >
                  <MediaImage
                    src={image.src}
                    alt={image.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,90,60,0.18),transparent_60%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#ff5a3c] font-semibold">
                      {image.category}
                    </p>
                    <p className="font-display text-lg md:text-xl mt-1 font-semibold text-white">
                      {image.title}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>

      <AnimatePresence>
        {active !== null && filtered[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center px-4"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-6 right-6 p-2 border border-white/15 hover:border-white min-h-[44px] min-w-[44px] rounded-full"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length))
              }
              className="absolute left-4 md:left-8 p-3 border border-white/15 hover:border-[#ff5a3c] min-h-[44px] min-w-[44px] rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.div
              key={filtered[active].src}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative max-w-5xl w-full"
            >
              <img
                src={filtered[active].src}
                alt={filtered[active].title}
                className="max-w-full max-h-[78vh] mx-auto object-contain rounded-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#ff5a3c]">
                  {filtered[active].category}
                </p>
                <p className="font-display text-xl text-white mt-1">{filtered[active].title}</p>
              </div>
            </motion.div>
            <button
              onClick={() => setActive((i) => (i === null ? i : (i + 1) % filtered.length))}
              className="absolute right-4 md:right-8 p-3 border border-white/15 hover:border-[#ff5a3c] min-h-[44px] min-w-[44px] rounded-full"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
