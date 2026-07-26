'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import MediaImage from '@/components/MediaImage';
import PageHero from '@/components/PageHero';
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
      <main className="relative overflow-x-hidden bg-[#0A0E27]">
        <PageHero
          title="Frames from the floor"
          description="Weddings, festivals, concerts, corporate stages, and road shows — captured under Parth Production systems."
        />

        <section className="sticky top-[88px] md:top-[96px] z-30 border-b border-white/10 bg-[#0A0E27]/85 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex gap-2 md:gap-3 overflow-x-auto scrollbar-none justify-start md:justify-center">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 whitespace-nowrap min-h-[44px] px-4 md:px-5 rounded-full border text-xs md:text-sm uppercase tracking-[0.16em] font-semibold transition-all ${
                  filter === f
                    ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
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
                  className="relative break-inside-avoid w-full overflow-hidden border border-white/10 group text-left rounded-2xl bg-[#111827]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <MediaImage
                      src={image.src}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-300 font-semibold">
                        {image.category}
                      </p>
                      <p className="font-display text-lg mt-1 font-semibold text-white">{image.title}</p>
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
            className="fixed inset-0 z-[10000] bg-[#0A0E27]/95 flex items-center justify-center px-4"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-6 right-6 p-2 border border-white/15 hover:border-cyan-400 min-h-[44px] min-w-[44px] rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length))}
              className="absolute left-4 md:left-8 p-3 border border-white/15 hover:border-cyan-400 min-h-[44px] min-w-[44px] rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.img
              key={filtered[active].src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={filtered[active].src}
              alt={filtered[active].title}
              className="max-w-full max-h-[82vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setActive((i) => (i === null ? i : (i + 1) % filtered.length))}
              className="absolute right-4 md:right-8 p-3 border border-white/15 hover:border-cyan-400 min-h-[44px] min-w-[44px] rounded-xl"
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
