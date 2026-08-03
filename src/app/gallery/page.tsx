'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import CinematicPageHero from '@/components/CinematicPageHero';
import { STAGE_IMAGES, resolveGallerySrc } from '@/utils/media';
import { canonicalizeCategory } from '@/utils/servicesCatalog';

type GalleryItem = {
  id: string | number;
  category: string;
  title: string;
  src: string;
};

const defaults: GalleryItem[] = STAGE_IMAGES.slice(0, 5).map((img, i) => ({
  id: i + 1,
  category: canonicalizeCategory(img.title),
  title: img.tag,
  src: img.src,
}));

const DEFAULT_CATS = [
  'Weddings',
  'Festivals',
  'Concerts',
  'Road Shows',
  'Corporate Events',
];

function firstOfCategory(items: GalleryItem[], cat: string): GalleryItem | null {
  return (
    items.find((i) => canonicalizeCategory(i.category) === canonicalizeCategory(cat)) || null
  );
}

function uniqueCategories(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const cat = canonicalizeCategory(raw);
    const key = cat.toLowerCase();
    if (!cat || seen.has(key)) continue;
    seen.add(key);
    out.push(cat);
  }
  return out;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(defaults);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATS);
  const [filter, setFilter] = useState<string>(DEFAULT_CATS[0]);
  const [active, setActive] = useState<number | null>(null);
  const [slideCategory, setSlideCategory] = useState<string | null>(null);
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/data');
        if (!res.ok) return;
        const data = await res.json();

        // Services are the source of truth for gallery categories
        const serviceCats: string[] =
          data.services?.length > 0
            ? data.services.map((s: { service_title: string }) =>
                canonicalizeCategory(s.service_title)
              )
            : DEFAULT_CATS;

        const finalCats = uniqueCategories(serviceCats);
        const cats = finalCats.length ? finalCats : DEFAULT_CATS;
        setCategories(cats);
        setFilter((prev) =>
          cats.some((c) => c.toLowerCase() === prev.toLowerCase()) ? prev : cats[0]
        );

        let mapped: GalleryItem[] = [];
        if (data.images?.length) {
          mapped = data.images.map(
            (item: { id: string; category: string; image_url: string }, idx: number) => {
              const fallback = defaults[idx % defaults.length].src;
              const cat = canonicalizeCategory(item.category || 'Events');
              return {
                id: item.id || idx,
                category: cat,
                title: cat,
                src: resolveGallerySrc(item.image_url, fallback),
              };
            }
          );
        }

        // Keep only images for known service categories (drops orphan "Corporate")
        const serviceKeys = new Set(finalCats.map((c) => c.toLowerCase()));
        const ensured = mapped.filter((img) =>
          serviceKeys.has(canonicalizeCategory(img.category).toLowerCase())
        );

        finalCats.forEach((cat, i) => {
          if (
            !ensured.some(
              (img) => canonicalizeCategory(img.category).toLowerCase() === cat.toLowerCase()
            )
          ) {
            const serviceMatch = data.services?.find(
              (s: { service_title: string; image_url: string }) =>
                canonicalizeCategory(s.service_title).toLowerCase() === cat.toLowerCase()
            );
            const src = serviceMatch?.image_url
              ? resolveGallerySrc(serviceMatch.image_url, defaults[i % defaults.length].src)
              : defaults[i % defaults.length].src;
            ensured.push({
              id: `seed-${cat}`,
              category: cat,
              title: cat,
              src,
            });
          }
        });

        setItems(ensured.length ? ensured : defaults);
      } catch {
        // keep defaults
      }
    }
    load();
  }, []);

  const featuredCats = useMemo(() => categories.slice(0, 4), [categories]);
  const overflowCats = useMemo(() => categories.slice(4), [categories]);

  const featuredSideCards = useMemo(() => {
    return featuredCats
      .map((cat) => firstOfCategory(items, cat))
      .filter(Boolean) as GalleryItem[];
  }, [featuredCats, items]);

  const featuredPool = useMemo(() => {
    return items.filter((item) =>
      featuredCats.some(
        (c) => canonicalizeCategory(c) === canonicalizeCategory(item.category)
      )
    );
  }, [items, featuredCats]);

  // One representative card per overflow category (no Road Shows twice)
  const overflowCards = useMemo(() => {
    return overflowCats
      .map((cat) => firstOfCategory(items, cat))
      .filter(Boolean) as GalleryItem[];
  }, [overflowCats, items]);

  useEffect(() => {
    if (!featuredPool.length) return;
    const id = window.setInterval(() => {
      setFeatured((i) => (i + 1) % featuredPool.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [featuredPool.length]);

  const spotlight =
    featuredPool[featured % Math.max(featuredPool.length, 1)] || featuredSideCards[0];

  const openLightbox = (item: GalleryItem) => {
    const catItems = items.filter(
      (f) => canonicalizeCategory(f.category) === canonicalizeCategory(item.category)
    );
    const idx = catItems.findIndex((f) => f.id === item.id);
    setSlideCategory(canonicalizeCategory(item.category));
    setActive(idx >= 0 ? idx : 0);
  };

  const slideItems = useMemo(() => {
    if (!slideCategory) return items;
    return items.filter(
      (f) => canonicalizeCategory(f.category) === canonicalizeCategory(slideCategory)
    );
  }, [items, slideCategory]);

  const closeLightbox = () => {
    setActive(null);
    setSlideCategory(null);
  };

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
        />

        <section className="relative border-b border-white/10 py-12 md:py-16 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3A8FB8]/08 blur-[120px]" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-10">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#3A8FB8] font-semibold mb-2">
                  Spotlight reel
                </p>
                <h2 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
                  Motion from the floor
                </h2>
              </div>
              <p className="hidden md:block text-sm text-white/45 max-w-xs text-right">
                Top four services sit beside the cover. Extra service categories appear below.
              </p>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const activeChip = filter === cat;
                const count = items.filter(
                  (i) =>
                    canonicalizeCategory(i.category).toLowerCase() ===
                    canonicalizeCategory(cat).toLowerCase()
                ).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFilter(cat);
                      setFeatured(0);
                    }}
                    className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] font-semibold transition-all ${
                      activeChip
                        ? 'border-[#3A8FB8] bg-[#3A8FB8]/15 text-white'
                        : 'border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {cat}
                    <span className="ml-1.5 text-white/40">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Cover + 4 category cards (first four services) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-10">
                <AnimatePresence mode="wait">
                  {spotlight && (
                    <motion.button
                      key={String(spotlight.id) + spotlight.src}
                      type="button"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.45 }}
                      onClick={() => openLightbox(spotlight)}
                      className="relative lg:col-span-8 aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 text-left group"
                    >
                      <MediaImage
                        src={spotlight.src}
                        alt={spotlight.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#3A8FB8] font-semibold">
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
                  {featuredSideCards.map((item, i) => (
                    <motion.button
                      key={`side-${item.id}`}
                      type="button"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => {
                        const idx = featuredPool.findIndex((f) => f.id === item.id);
                        if (idx >= 0) setFeatured(idx);
                        setFilter(canonicalizeCategory(item.category));
                        openLightbox(item);
                      }}
                      className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[92px] overflow-hidden rounded-2xl border text-left transition-all ${
                        spotlight?.id === item.id
                          ? 'border-[#3A8FB8]/60 shadow-[0_0_24px_rgba(58,143,184,0.25)]'
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

            {/* Selected category grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
                {items
                  .filter(
                    (item) =>
                      canonicalizeCategory(item.category).toLowerCase() ===
                      canonicalizeCategory(filter).toLowerCase()
                  )
                  .map((item, i) => (
                    <motion.button
                      key={`filter-${item.id}-${i}`}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => openLightbox(item)}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 text-left group"
                    >
                      <MediaImage
                        src={item.src}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <p className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.16em] text-white/85">
                        {item.category}
                      </p>
                    </motion.button>
                  ))}
              </div>

            {/* Overflow categories only (5th+) — never repeats the top-4 cards */}
            <div>
                {overflowCats.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#3A8FB8] font-semibold mb-1">
                      More categories
                    </p>
                    <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
                      Beyond the spotlight
                    </h3>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {overflowCards.map((item, i) => (
                    <motion.button
                      key={`overflow-${canonicalizeCategory(item.category)}`}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      onClick={() => {
                        setFilter(canonicalizeCategory(item.category));
                        openLightbox(item);
                      }}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 text-left group"
                    >
                      <MediaImage
                        src={item.src}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <p className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.16em] text-white/85">
                        {canonicalizeCategory(item.category)}
                      </p>
                    </motion.button>
                  ))}
                  {!overflowCats.length && (
                    <p className="col-span-full text-sm text-white/40 py-4">
                      Add more services in admin to show extra categories here.
                    </p>
                  )}
                </div>
              </div>
          </div>
        </section>

        <QuoteCta />
      </main>

      <AnimatePresence>
        {active !== null && slideItems[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center px-4"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 border border-white/15 hover:border-white min-h-[44px] min-w-[44px] rounded-full"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {slideItems.length > 1 && (
              <button
                onClick={() =>
                  setActive((i) =>
                    i === null ? i : (i - 1 + slideItems.length) % slideItems.length
                  )
                }
                className="absolute left-4 md:left-8 p-3 border border-white/15 hover:border-[#3A8FB8] min-h-[44px] min-w-[44px] rounded-full"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <motion.div
              key={slideItems[active].src + String(active)}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative max-w-5xl w-full"
            >
              <img
                src={slideItems[active].src}
                alt={slideItems[active].title}
                className="max-w-full max-h-[78vh] mx-auto object-contain rounded-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#3A8FB8]">
                  {slideItems[active].category}
                </p>
                <p className="font-display text-xl text-white mt-1">
                  {slideItems[active].title}
                </p>
                {slideItems.length > 1 && (
                  <p className="mt-2 text-xs text-white/40">
                    {active + 1} / {slideItems.length}
                  </p>
                )}
              </div>
            </motion.div>
            {slideItems.length > 1 && (
              <button
                onClick={() =>
                  setActive((i) => (i === null ? i : (i + 1) % slideItems.length))
                }
                className="absolute right-4 md:right-8 p-3 border border-white/15 hover:border-[#3A8FB8] min-h-[44px] min-w-[44px] rounded-full"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
