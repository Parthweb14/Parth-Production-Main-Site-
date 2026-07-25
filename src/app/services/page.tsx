'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Music, Volume2, Sliders, 
  Sparkles, Calendar, Check, ArrowRight,
  ChevronLeft, ChevronRight, PartyPopper,
  Radio, Building2
} from 'lucide-react';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const servicesData = [
  {
    id: 1,
    title: 'WEDDINGS',
    subtitle: 'Premium DJ & Stage Audio',
    description: 'Make your big day unforgettable with the perfect soundtrack. From romantic melodies during the vows to high-energy beats at the reception, we create the right mood for every moment of your wedding.',
    icon: Music,
    color: '#D4AF37',
    features: [
      'Custom Bridal Entry Music',
      'Intelligent Lighting Programs',
      'High-Definition sound systems',
      'SFX Sparklers & Dry-Ice Low Fog',
      'Experienced DJ & MC hosts'
    ],
    image: '/images/Untitled-design-15_bdfxt9.png',
  },
  {
    id: 2,
    title: 'CONCERTS',
    subtitle: 'Stadium Live Production',
    description: 'From intimate live performances to massive stadium gigs, our expert DJs and technical team provide world-class sound and lights to amplify the impact of every performance. Parth Production ensures crystal-clear audio, stunning visuals, and an atmosphere that elevates every artist and thrills every audience.',
    icon: Volume2,
    color: '#F59E0B',
    features: [
      'Line Array Riggings',
      'High decibel bass layouts',
      'Digital Audio Mixers',
      'Heavy Duty Truss frames',
      'On-site sound technicians'
    ],
    image: '/images/Untitled-design-20_sm7myc.png',
  },
  {
    id: 3,
    title: 'FESTIVALS',
    subtitle: 'Vibrant Arena Mixes',
    description: 'Turn up the energy at any festival with Parth Production! We bring powerful sound systems, vibrant lights, and electrifying mixes that keep the crowd moving. From cultural gatherings to large-scale music festivals, we create an atmosphere that celebrates community and culture.',
    icon: Sparkles,
    color: '#F97316',
    features: [
      'Vast outdoor system coverage',
      'Dandiya & Garba specialist mixes',
      'Strobe & Laser sky projection',
      'High voltage generator backups',
      'Crowd barrier controls support'
    ],
    image: '/images/Untitled-design-32_atcfrs.png',
  },
  {
    id: 4,
    title: 'CORPORATE EVENTS',
    subtitle: 'Sleek Corporate Meets',
    description: 'Rigging crystal clear presentation audios, moving head visual beams, and sleek stage production structures for summits and product launches.',
    icon: Building2,
    color: '#E2B808',
    features: [
      'UHF Wireless Lapel Mics',
      'High-contrast backdrop LED screens',
      'Silent Generators setup',
      'Corporate Podium & Stage layout',
      'Keynote presentation systems'
    ],
    image: '/images/Untitled-design-17_ubz6ho.png',
  },
  {
    id: 5,
    title: 'ROAD SHOWS',
    subtitle: 'High-Impact Mobile Visuals',
    description: 'Custom engineered truck-mounted LED displays, silent generator rigs, and concert truss line arrays bringing high impact mobile audio visuals.',
    icon: Radio,
    color: '#D4AF37',
    features: [
      'Truck mounted truss gates',
      'Shockproof audio brackets',
      'Ultra bright daylight LED walls',
      'Mobile power generators fleet',
      'Dynamic rally visual design'
    ],
    image: '/images/Untitled-design-13.png',
  },
  {
    id: 6,
    title: 'PRIVATE PARTIES',
    subtitle: 'Club Themes & DJ Sets',
    description: 'From intimate club themes to sprawling lawn parties, we orchestrate custom playlists, immersive light rigs, and energetic DJ performance sets.',
    icon: PartyPopper,
    color: '#F59E0B',
    features: [
      'Dynamic Neon uplight designs',
      'Bespoke dancefloor riggings',
      'Theme customized DJ setups',
      'Fog, Bubble & Smoke effects',
      'Premium wireless mic support'
    ],
    image: '/images/ChatGPT_Image_Jul_8_2026_02_29_02_PM_dfrv2l.png',
  },
  {
    id: 7,
    title: 'SFX & PYROTECHNICS',
    subtitle: 'Cold Sparks & Dry Ice',
    description: 'Wow your audience with state-of-the-art stage enhancements including cold spark fountains, dry ice low fog layers, and CO2 cryo jets.',
    icon: Sparkles,
    color: '#F97316',
    features: [
      'Cold Spark Fountains',
      'CO2 Cryo Jet machines',
      'Dry Ice low clouds machine',
      'Confetti blast launchers',
      'Licensed crew operations'
    ],
    image: '/images/ChatGPT_Image_Jul_8_2026_02_56_39_PM_nux2y0.png',
  },
  {
    id: 8,
    title: 'STAGE SETUP',
    subtitle: 'Safety & Modular Trusses',
    description: 'Modular stage platforms, customized truss frames, premium LED screens, and structural riggings prioritizing maximum visual appeal and safety.',
    icon: Sliders,
    color: '#E2B808',
    features: [
      'Aluminum truss arches & gates',
      'Height adjustable stages',
      'Anti-slip stage carpet flooring',
      'Weight certified safety rigging',
      'LED panel scaffolding borders'
    ],
    image: '/images/ChatGPT_Image_Jul_8_2026_02_34_55_PM_nbkkog.png',
  },
  {
    id: 9,
    title: 'EVENT MANAGEMENT',
    subtitle: 'Production & Coordination',
    description: 'Full coordination from vendor allocations to running stage queues, contingency planning, and seamless on-site execution management.',
    icon: Calendar,
    color: '#D4AF37',
    features: [
      'On-site production managers',
      'Precise stage cue programs',
      'Contingency power planning',
      'Logistics & transit coordination',
      'Rigging safety inspections'
    ],
    image: '/images/Untitled-design-17.png',
  }
];

export default function ServicesPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const servicesSliderRef = useRef<HTMLDivElement>(null);
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const [images, setImages] = useState<Record<number, string>>({
    1: '/images/Untitled-design-15_bdfxt9.png',
    2: '/images/Untitled-design-20_sm7myc.png',
    3: '/images/Untitled-design-32_atcfrs.png',
    4: '/images/Untitled-design-17_ubz6ho.png',
    5: '/images/Untitled-design-13.png',
    6: '/images/ChatGPT_Image_Jul_8_2026_02_29_02_PM_dfrv2l.png',
    7: '/images/ChatGPT_Image_Jul_8_2026_02_56_39_PM_nux2y0.png',
    8: '/images/ChatGPT_Image_Jul_8_2026_02_34_55_PM_nbkkog.png',
    9: '/images/Untitled-design-17.png'
  });

  useEffect(() => {
    async function loadKVServiceImages() {
      try {
        const res = await fetch(`/api/public/data?t=${Date.now()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          const mapped: Record<number, string> = {};
          data.services.forEach((item: any) => {
            mapped[item.id] = item.image_url;
          });
          setImages(prev => ({ ...prev, ...mapped }));
        }
      } catch (err) {
        console.error('Failed to load service cover images:', err);
      }
    }
    loadKVServiceImages();
  }, []);

  // Autoplay relative scroll for Services Slider
  useEffect(() => {
    const slider = servicesSliderRef.current;
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
  }, []);

  // Render organic sound wave flowing animation on canvas for premium visual effect
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

  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 select-none overflow-x-hidden">
        
        {/* HERO BANNER SECTION */}
        <section className="relative h-[250px] md:h-[350px] pt-16 flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-amber-955/20 via-zinc-950 to-zinc-955">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

          {/* Titles */}
          <div className="relative z-10 text-center space-y-4 px-6">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider leading-none"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              <span className="text-white mr-3">OUR</span>
              <span className="text-amber-500 hero-heading pb-1">
                SERVICES
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-semibold tracking-[0.2em] uppercase">
              Everything you need for an unforgettable event
            </p>
          </div>
        </section>

        {/* SERVICES GRID SECTION */}
        <section className="py-10 md:py-16 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
          
          {/* Autoplay Responsive Carousel */}
          <div 
            ref={servicesSliderRef}
            className="flex gap-6 pt-2 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
          >
            {servicesData.map((service, idx) => {
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="w-[88vw] sm:w-[360px] md:w-[380px] lg:w-[400px] snap-start flex-shrink-0 group relative rounded-3xl overflow-hidden bg-zinc-900/40 border border-white/5 flex flex-col justify-between"
                  style={{
                    boxShadow: '0 0 30px rgba(255,255,255,0.02), inset 0 0 30px rgba(255,255,255,0.01)'
                  }}
                >
                  {/* Thumbnail area */}
                  <div className="relative w-full aspect-[16/11] overflow-hidden">
                    <Image 
                      src={images[service.id] || service.image} 
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 88vw, (max-width: 768px) 360px, 400px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  </div>

                  {/* Text Contents */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                        {service.title}
                      </h3>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider mt-0.5 text-amber-500">
                        {service.subtitle}
                      </p>
                      
                      <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-semibold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        {service.description}
                      </p>

                      {/* Checklist */}
                      <ul className="mt-6 space-y-2.5">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-3 text-xs text-zinc-400">
                            <div className="w-4 h-4 rounded-md border border-amber-500/20 bg-amber-500/5 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-amber-555" />
                            </div>
                            <span className="font-semibold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Book Now Button */}
                    <div className="pt-8">
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-[#d4af37] text-black hover:bg-[#b8901c] rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border border-transparent text-center shadow-md"
                        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 text-black" />
                      </a>
                    </div>
                  </div>

                  {/* Background overlay glow on card hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{
                      boxShadow: '0 0 50px rgba(212,175,55,0.1), inset 0 0 50px rgba(212,175,55,0.05)'
                    }}
                  />
                </motion.div>
              );
            })}
            <div className="w-6 flex-shrink-0" />
          </div>

          {/* PC Manual Navigation Buttons */}
          <div className="hidden md:flex justify-center items-center gap-4 mt-6 mb-12 md:mb-16">
            <button 
              onClick={() => {
                const slider = servicesSliderRef.current;
                if (!slider) return;
                const firstCard = slider.children[0] as HTMLElement;
                const cardWidth = firstCard?.clientWidth || 380;
                slider.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
              }}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-amber-500/40 bg-zinc-900/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const slider = servicesSliderRef.current;
                if (!slider) return;
                const firstCard = slider.children[0] as HTMLElement;
                const cardWidth = firstCard?.clientWidth || 380;
                slider.scrollBy({ left: (cardWidth + 24), behavior: 'smooth' });
              }}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-amber-500/40 bg-zinc-900/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Next service"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
