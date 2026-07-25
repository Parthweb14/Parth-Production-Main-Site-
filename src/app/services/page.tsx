'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
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
    features: [
      'Custom Bridal Entry Music',
      'Intelligent Lighting Programs',
      'High-Definition sound systems',
      'SFX Sparklers & Dry-Ice Low Fog'
    ],
    image: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-15_bdfxt9.png',
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
    image: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-20_sm7myc.png',
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
    image: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-32_atcfrs.png',
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
    image: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-17_ubz6ho.png',
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
    image: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-13.png',
  }
];

export default function ServicesPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const [images, setImages] = useState<Record<number, string>>({
    1: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-15_bdfxt9.png',
    2: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-20_sm7myc.png',
    3: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-32_atcfrs.png',
    4: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-17_ubz6ho.png',
    5: 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-13.png'
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
            mapped[item.id] = item.image_url.startsWith('/') ? `https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev${item.image_url}` : item.image_url;
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
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Operations & blue prints</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">
              PRODUCTION & <br />
              <span className="text-accent drop-shadow-[0_0_15px_rgba(255,215,0,0.15)]">SERVICES</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              Check out our complete setup blue prints for sound riggings, stage truss setups, and generator power routing.
            </p>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {servicesData.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="border border-gray-800 p-6 bg-secondary/10 rounded-2xl flex flex-col justify-between hover:border-gray-700 hover:bg-secondary/20 transition-all duration-300 group"
              >
                <div>
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-gray-850 bg-secondary mb-6">
                    <Image 
                      src={images[service.id] || service.image} 
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-[0.7]"
                    />
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-accent font-semibold block mb-1">
                    {service.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>

                  <ul className="space-y-2 text-xs text-gray-300 font-sans border-t border-gray-850 pt-4">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-white text-black hover:bg-white/90 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 text-center shadow-md active:scale-98"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
