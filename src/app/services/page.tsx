'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const servicesData = [
  {
    id: 1,
    title: 'WEDDINGS',
    subtitle: 'Premium DJ & Stage Audio',
    description: 'Make your big day unforgettable with the perfect soundtrack. From romantic melodies during the vows to high-energy beats at the reception, we create the right mood for every moment of your wedding.',
    features: [
      'Custom Bridal Entry Music',
      'Intelligent Lighting Programs',
      'High-Definition sound systems',
      'SFX Sparklers & Dry-Ice Low Fog'
    ],
    image: 'https://assets.parthproduction.in/Image%206%20Weddings.png',
  },
  {
    id: 2,
    title: 'CONCERTS',
    subtitle: 'Stadium Live Production',
    description: 'From intimate live performances to massive stadium gigs, our expert DJs and technical team provide world-class sound and lights to amplify the impact of every performance.',
    features: [
      'Line Array Riggings',
      'High decibel bass layouts',
      'Digital Audio Mixers',
      'Heavy Duty Truss frames'
    ],
    image: 'https://assets.parthproduction.in/Image%201%20Concert%20.png',
  },
  {
    id: 3,
    title: 'FESTIVALS',
    subtitle: 'Vibrant Arena Mixes',
    description: 'Turn up the energy at any festival with Parth Production! We bring powerful sound systems, vibrant lights, and electrifying mixes that keep the crowd moving.',
    features: [
      'Vast outdoor system coverage',
      'Dandiya & Garba specialist mixes',
      'Strobe & Laser sky projection',
      'High voltage generator backups'
    ],
    image: 'https://assets.parthproduction.in/Image%203%20Festivals.png',
  },
  {
    id: 4,
    title: 'CORPORATE EVENTS',
    subtitle: 'Sleek Corporate Meets',
    description: 'Rigging crystal clear presentation audios, moving head visual beams, and sleek stage production structures for summits and product launches.',
    features: [
      'UHF Wireless Lapel Mics',
      'High-contrast backdrop LED screens',
      'Silent Generators setup',
      'Corporate Podium & Stage layout'
    ],
    image: 'https://assets.parthproduction.in/Image%202%20Corporate%20events.png',
  },
  {
    id: 5,
    title: 'ROAD SHOWS',
    subtitle: 'High-Impact Mobile Visuals',
    description: 'Custom engineered truck-mounted LED displays, silent generator rigs, and concert truss line arrays bringing high impact mobile audio visuals.',
    features: [
      'Truck mounted truss gates',
      'Shockproof audio brackets',
      'Ultra bright daylight LED walls',
      'Mobile power generators fleet'
    ],
    image: 'https://assets.parthproduction.in/Image%204%20Road%20show.png',
  }
];

// Fallback client image rendering boundary
function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (imgSrc.includes('assets.parthproduction.in')) {
      setImgSrc(imgSrc.replace('assets.parthproduction.in', 'pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev'));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
    />
  );
}

export default function ServicesPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const [images, setImages] = useState<Record<number, string>>({
    1: 'https://assets.parthproduction.in/Image%206%20Weddings.png',
    2: 'https://assets.parthproduction.in/Image%201%20Concert%20.png',
    3: 'https://assets.parthproduction.in/Image%203%20Festivals.png',
    4: 'https://assets.parthproduction.in/Image%202%20Corporate%20events.png',
    5: 'https://assets.parthproduction.in/Image%204%20Road%20show.png'
  });

  useEffect(() => {
    async function loadKVServices() {
      try {
        const res = await fetch(`/api/public/data?t=${Date.now()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          const mapped: Record<number, string> = {};
          data.services.forEach((item: any) => {
            mapped[item.id] = item.image_url.startsWith('/') ? `https://assets.parthproduction.in${item.image_url}` : item.image_url;
          });
          setImages(prev => ({ ...prev, ...mapped }));
        }
      } catch (err) {
        console.error('Failed to load service cover images:', err);
      }
    }
    loadKVServices();
  }, []);

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <div className="relative min-h-screen bg-black text-white select-none overflow-x-hidden pb-20 pt-20">
        
        {/* HERO BANNER */}
        <section className="relative min-h-[30vh] border-b border-gray-800/40 px-6 md:px-12 py-12 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Operations & blueprints</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">
              PRODUCTION & <br />
              <span className="text-accent drop-shadow-[0_0_15px_rgba(255,95,31,0.15)]">SERVICES</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              Check out our complete setup blueprints for sound riggings, stage truss setups, and generator power routing.
            </p>
          </div>
        </section>

        {/* SERVICES FLEX/GRID SHOWCASE (Aligned at the top) */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-wrap gap-8 items-start">
            {servicesData.map((service, idx) => {
              // Service 1, 2, 4 are Portrait (aspect-[3/4])
              // Service 3, 5 are Landscape (aspect-[16/9])
              const isPortrait = service.id === 1 || service.id === 2 || service.id === 4;
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`flex flex-col justify-between p-6 bg-secondary/10 border border-neutral-850 hover:border-neutral-750 rounded-[2rem] transition-all duration-300 group ${
                    isPortrait 
                      ? 'w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]' 
                      : 'w-full lg:w-[calc(66.666%-12px)]'
                  }`}
                >
                  {/* 1. Heading & 2. Subheading */}
                  <div className="mb-6 space-y-2">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* 3. Images Box with heavy rounded corners & overlay */}
                  <div 
                    className={`relative w-full rounded-[24px] overflow-hidden border border-white/10 group shadow-xl bg-black/60 transition-transform duration-300 hover:scale-[1.02] ${
                      isPortrait ? 'aspect-[3/4]' : 'aspect-[16/9]'
                    }`}
                  >
                    <SafeImage
                      src={images[service.id] || service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                    {/* Features checklist inside the card layout overlay */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 space-y-3">
                      <p className="text-gray-300 text-xs font-light leading-relaxed line-clamp-2 md:line-clamp-none">
                        {service.description}
                      </p>
                      
                      <ul className="hidden sm:block space-y-1 text-[11px] text-gray-400 font-sans">
                        {service.features.slice(0, 3).map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 4. Book Now Button under the images */}
                  <div className="pt-6">
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-accent text-black hover:bg-accent/90 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 text-center shadow-lg active:scale-98"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 text-black" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
