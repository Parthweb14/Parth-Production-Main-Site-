'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const defaultGalleryImages = [
  { id: 1, category: 'Weddings', title: 'Premium Varmala Stage', event: 'Wedding Ceremony', src: 'https://assets.parthproduction.in/Image%206%20Weddings.png' },
  { id: 2, category: 'Festivals', title: 'Cultural Garba Arena', event: 'Navratri Dandiya', src: 'https://assets.parthproduction.in/Image%203%20Festivals.png' },
  { id: 3, category: 'Concerts', title: 'Live Rock concert audio', event: 'Sunburn Arena', src: 'https://assets.parthproduction.in/Image%201%20Concert%20.png' },
  { id: 4, category: 'Corporate', title: 'Interactive Truss rig', event: 'Launch Production', src: 'https://assets.parthproduction.in/Image%202%20Corporate%20events.png' },
  { id: 5, category: 'Road Shows', title: 'Mobile LED Truss', event: 'Gujarat Promotion', src: 'https://assets.parthproduction.in/Image%204%20Road%20show.png' },
  { id: 6, category: 'Weddings', title: 'Royal Reception Stage', event: 'Elite reception setup', src: 'https://assets.parthproduction.in/Image%207%20Weddings.png' },
  { id: 7, category: 'Festivals', title: 'Neon Laser EDM show', event: 'Music Festival live', src: 'https://assets.parthproduction.in/image%2010%20.png' },
  { id: 8, category: 'Concerts', title: 'Mainstage LED wall', event: 'Ahmedabad Concert Live', src: 'https://assets.parthproduction.in/Image%208%20Concert.png' },
  { id: 9, category: 'Road Shows', title: 'National Roadshow Rig', event: 'Statewide Campaign', src: 'https://assets.parthproduction.in/Image%205%20Road%20show.png' }
];

const categories = ['All Events', 'Weddings', 'Festivals', 'Concerts', 'Corporate', 'Road Shows'];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<any[]>(defaultGalleryImages);
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch gallery images dynamically on mount
  useEffect(() => {
    async function loadKVImages() {
      try {
        const res = await fetch(`/api/public/data?t=${Date.now()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          const mapped = data.images.map((item: any, idx: number) => ({
            id: item.id || idx,
            category: item.category,
            title: item.category === 'Weddings' ? 'Premium Varmala Stage' : item.category === 'Festivals' ? 'Cultural Garba Arena' : item.category === 'Concerts' ? 'Live Rock concert audio' : item.category === 'Corporate' ? 'Interactive Truss rig' : 'Mobile LED Truss',
            event: item.category === 'Weddings' ? 'Wedding Ceremony' : item.category === 'Festivals' ? 'Navratri Dandiya' : item.category === 'Concerts' ? 'Sunburn Arena' : item.category === 'Corporate' ? 'Launch Production' : 'Gujarat Promotion',
            src: item.image_url.startsWith('/') ? `https://assets.parthproduction.in${item.image_url}` : item.image_url
          }));
          setGalleryImages(mapped);
        }
      } catch (err) {
        console.error('Failed to load gallery images:', err);
      }
    }
    loadKVImages();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const filteredImages = galleryImages.filter((img) => 
    selectedCategory === 'All Events' || img.category === selectedCategory
  );

  const handleNext = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredImages.length;
    });
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredImages.length) % filteredImages.length;
    });
  };

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <div className="relative min-h-screen bg-black text-white select-none pb-20 pt-20">
        
        <section className="relative border-b border-white/10 px-6 md:px-12 py-14 md:py-20">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Gallery</p>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight text-white leading-[0.95] max-w-3xl">
              Stages we have built
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-lg">
              Selected stills from weddings, festivals, concerts, and road shows.
            </p>
          </div>
        </section>

        <section className="border-b border-white/10 py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-[0.14em] uppercase items-center">
            <span className="text-white/35 mr-2 text-[9px]">Filter</span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`hover:text-accent cursor-pointer transition-colors relative py-1 ${
                    isActive ? 'text-accent font-bold' : 'text-gray-400'
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.div 
                      layoutId="activeFilterUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* GALLERY GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredImages.map((image, idx) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col justify-between group cursor-pointer"
                onClick={() => setLightboxIndex(idx)}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden border border-white/10">
                  <Image 
                    src={image.src} 
                    alt={image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition-all duration-700 brightness-[0.8] group-hover:scale-105"
                  />
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-black/80 border border-gray-800 flex items-center justify-center text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-accent font-semibold block">
                    {image.category} // {image.event}
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    {image.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LIGHTBOX */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/98 flex flex-col justify-center items-center px-4"
            >
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <button 
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
                <motion.img 
                  key={filteredImages[lightboxIndex].id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  src={filteredImages[lightboxIndex].src} 
                  alt={filteredImages[lightboxIndex].title}
                  className="max-w-full max-h-[80vh] object-contain rounded-xl border border-gray-800 shadow-2xl"
                />
              </div>

              <button 
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
