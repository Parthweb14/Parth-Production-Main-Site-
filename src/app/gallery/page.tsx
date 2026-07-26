'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import MediaImage from '@/components/MediaImage';
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

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(defaults);
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);

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
        // Keep only items that still resolve to a usable src
        setItems(mapped.length ? mapped : defaults);
      } catch {
        // keep defaults
      }
    }
    load();
  }, []);

  const filtered =
    filter === 'All'
      ? items
      : items.filter((item) => {
          const cat = item.category.toLowerCase();
          const f = filter.toLowerCase();
          return cat === f || cat.includes(f.replace(/s$/, '')) || f.includes(cat.replace(/s$/, ''));
        });

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="pt-20">
        <section className="px-6 md:px-10 py-16 md:py-22 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
              Gallery
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl"
            >
              Frames from the floor
            </motion.h1>
            <p className="mt-5 text-white/55 max-w-xl">
              Weddings, festivals, concerts, corporate stages, and road shows — captured under Parth Production systems.
            </p>
          </div>
        </section>

        <section className="sticky top-20 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex gap-5 overflow-x-auto scrollbar-none text-[11px] uppercase tracking-[0.18em]">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap pb-1 border-b transition-colors ${
                  filter === f ? 'text-accent border-accent' : 'text-white/45 border-transparent hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((image, idx) => (
                <motion.button
                  layout
                  key={`${image.id}-${image.src}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setActive(idx)}
                  className="relative break-inside-avoid w-full overflow-hidden border border-white/10 group text-left"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <MediaImage
                      src={image.src}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-accent">{image.category}</p>
                      <p className="font-display text-lg mt-1">{image.title}</p>
                    </div>
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
            <button onClick={() => setActive(null)} className="absolute top-6 right-6 p-2 border border-white/15 hover:border-white">
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length))}
              className="absolute left-4 md:left-8 p-3 border border-white/15 hover:border-accent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.img
              key={filtered[active].src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={filtered[active].src}
              alt={filtered[active].title}
              className="max-w-full max-h-[82vh] object-contain"
            />
            <button
              onClick={() => setActive((i) => (i === null ? i : (i + 1) % filtered.length))}
              className="absolute right-4 md:right-8 p-3 border border-white/15 hover:border-accent"
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
