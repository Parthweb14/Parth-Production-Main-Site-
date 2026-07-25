'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const defaultGalleryImages = [
  { id: 1, category: 'Weddings', title: 'Premium Varmala Stage', event: 'Wedding Ceremony', src: '/images/Untitled-design-13.png' },
  { id: 2, category: 'Festivals', title: 'Cultural Garba Arena', event: 'Navratri Dandiya', src: '/images/Untitled-design-18_tdjp2b.png' },
  { id: 3, category: 'Concerts', title: 'Live Rock concert audio', event: 'Sunburn Arena', src: '/images/Untitled-design-21_atubxz.png' },
  { id: 4, category: 'Corporate', title: 'Interactive Truss rig', event: 'Launch Production', src: '/images/Untitled-design-20_sm7myc.png' },
  { id: 5, category: 'Road Shows', title: 'Mobile LED Truss', event: 'Gujarat Promotion', src: '/images/Untitled-design-17_ubz6ho.png' },
  { id: 6, category: 'Weddings', title: 'Royal Reception Stage', event: 'Elite reception setup', src: '/images/Untitled-design-15_bdfxt9.png' },
  { id: 7, category: 'Festivals', title: 'Neon Laser EDM show', event: 'Music Festival live', src: '/images/Untitled-design-14_ogyqmd.png' },
  { id: 8, category: 'Concerts', title: 'Mainstage LED wall', event: 'Ahmedabad Concert Live', src: '/images/Untitled-design-32_atcfrs.png' },
  { id: 9, category: 'Corporate', title: 'High-end lighting design', event: 'VIP Corporate Meet', src: '/images/Untitled-design-25_f2t475.png' }
];

const categories = ['All Events', 'Weddings', 'Festivals', 'Concerts', 'Corporate', 'Road Shows'];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<any[]>(defaultGalleryImages);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gallerySliderRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Autoplay relative scroll for Gallery Slider
  useEffect(() => {
    const slider = gallerySliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const firstCard = slider.children[0] as HTMLElement;
        const cardWidth = firstCard?.clientWidth || 380;
        slider.scrollTo({
          left: slider.scrollLeft + cardWidth + 24,
          behavior: 'smooth'
        });
      }
    }, 3000);

    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 15) {
        const touchCurrentX = e.touches[0].clientX;
        if (touchStartX - touchCurrentX > 20) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    };

    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      clearInterval(interval);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
    };
  }, [selectedCategory]);

  // Render organic sound wave flowing animation on canvas for premium visual effect (Teal / Amber theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 360;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;
      
      const waves = [
        { color: 'rgba(212, 175, 55, 0.15)', amp: 55, freq: 0.003, speed: 0.04 },
        { color: 'rgba(245, 158, 11, 0.12)', amp: 45, freq: 0.005, speed: 0.03 },
        { color: 'rgba(249, 115, 22, 0.10)', amp: 35, freq: 0.004, speed: 0.05 }
      ];

      waves.forEach((w) => {
        ctx.strokeStyle = w.color;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * w.freq + phase) * w.amp * Math.sin(x / 400);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });

      phase += 0.02;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

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
            src: item.image_url
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
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 select-none pb-20">
        
        {/* HERO BANNER SECTION */}
        <section className="relative h-[250px] md:h-[350px] pt-16 flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-amber-950/20 via-zinc-950 to-zinc-950">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

          {/* Titles */}
          <div className="relative z-10 text-center space-y-4 px-6">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider leading-none"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              <span className="text-white mr-3">OUR</span>
              <span className="text-amber-500 hero-heading pb-1">
                GALLERY
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-semibold tracking-[0.2em] uppercase">
              Moments we&apos;ve created, memories we&apos;ve made
            </p>
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="max-w-7xl mx-auto px-6 pt-6 pb-2">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase cursor-pointer snap-start transition-all duration-300 border flex-shrink-0 ${
                    isActive 
                      ? 'bg-[#d4af37] border-transparent text-black font-bold shadow-lg shadow-amber-500/15' 
                      : 'bg-transparent border-white/10 hover:border-white/30 text-zinc-400 hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* PORTFOLIO GRID */}
        <section className="max-w-7xl mx-auto px-6 overflow-hidden">
          <motion.div 
            layout 
            ref={gallerySliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
          >
            {filteredImages.map((image, idx) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="h-[300px] sm:h-[400px] md:h-[450px] w-[300px] sm:w-[380px] md:w-[calc(50%-12px)] relative group rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 shadow-lg bg-zinc-900/30 cursor-pointer snap-start flex-shrink-0"
                onClick={() => setLightboxIndex(idx)}
              >
                <Image 
                  src={image.src} 
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 768px) 380px, 50vw"
                  className="object-cover"
                />
                
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="w-6 flex-shrink-0" />
          </motion.div>

          {/* Manual Navigation Buttons */}
          <div className="hidden md:flex justify-center items-center gap-4 mt-6 mb-12 md:mb-16">
            <button 
              onClick={() => {
                const slider = gallerySliderRef.current;
                if (!slider) return;
                const firstCard = slider.children[0] as HTMLElement;
                const cardWidth = firstCard?.clientWidth || 450;
                slider.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
              }}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-amber-500/40 bg-zinc-900/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const slider = gallerySliderRef.current;
                if (!slider) return;
                const firstCard = slider.children[0] as HTMLElement;
                const cardWidth = firstCard?.clientWidth || 450;
                slider.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
              }}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-amber-500/40 bg-zinc-900/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* LIGHTBOX MODAL */}
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
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={filteredImages[lightboxIndex].src} 
                  alt={filteredImages[lightboxIndex].title}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
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
