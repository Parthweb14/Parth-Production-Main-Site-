'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const servicesData = [
  {
    id: 1,
    number: '01',
    title: 'WEDDINGS',
    subtitle: 'Premium DJ & Stage Audio',
    description: 'We orchestrate high-fidelity acoustics for elite weddings. From micro-designed speaker arrays for clear vows to high pressure sound fields that keep the dancefloor alive.',
    features: [
      'Custom Bridal Entry Soundtracks',
      'Architectural Truss Illuminations',
      'High-Definition Point-Source Audio',
      'CO2 Sparklers & Low Fog Dry Ice'
    ],
    image: '/images/Untitled-design-15_bdfxt9.png',
  },
  {
    id: 2,
    number: '02',
    title: 'CONCERTS',
    subtitle: 'Stadium Live Production',
    description: 'World-class line array setups and active digital mixing consoles calibrated for high decibel environments. We deploy certified structures prioritizing perfect coverage and audience safety.',
    features: [
      'High Decibel Line Array Rigging',
      'On-site Sound Engineers',
      'Digital Audio Control Desks',
      'Wind-load Certified Aluminum Truss'
    ],
    image: '/images/Untitled-design-20_sm7myc.png',
  },
  {
    id: 3,
    number: '03',
    title: 'FESTIVALS',
    subtitle: 'Vibrant Arena Mixes',
    description: 'Supplying outdoor sound reinforcements and high-voltage power backups for multi-day cultural events. Specialize in wide-coverage Dandiya and Garba arena production.',
    features: [
      'Wide-Area Sound Reinforcement',
      'Laser Sky-beam Installations',
      'Synchronized Stage Lighting',
      'Silent Power Generator Fleets'
    ],
    image: '/images/Untitled-design-32_atcfrs.png',
  },
  {
    id: 4,
    number: '04',
    title: 'CORPORATE EVENTS',
    subtitle: 'Sleek Corporate Meets',
    description: 'Deploying high-contrast LED backdrops, digital podiums, and crystal-clear wireless audio systems for product launches, summits, and executive meets.',
    features: [
      'Lapel & UHF Wireless Microphones',
      'High-Contrast LED Backdrop Walls',
      'Clean Modular Stage Platforms',
      'Keynote Control Integration'
    ],
    image: '/images/Untitled-design-17_ubz6ho.png',
  },
  {
    id: 5,
    number: '05',
    title: 'ROAD SHOWS',
    subtitle: 'High-Impact Mobile Visuals',
    description: 'Engineered truck-mounted daylight LED screens, mobile diesel generator rigs, and compact line arrays designed for rally routes and mobile promotions.',
    features: [
      'Truck-mounted Truss Gates',
      'Ultra-bright Daylight LED Panels',
      'Vibration-proof Speaker Brackets',
      'Self-contained Power Generators'
    ],
    image: '/images/Untitled-design-13.png',
  }
];

export default function ServicesPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const [images, setImages] = useState<Record<number, string>>({
    1: '/images/Untitled-design-15_bdfxt9.png',
    2: '/images/Untitled-design-20_sm7myc.png',
    3: '/images/Untitled-design-32_atcfrs.png',
    4: '/images/Untitled-design-17_ubz6ho.png',
    5: '/images/Untitled-design-13.png'
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
            mapped[item.id] = item.image_url;
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

      <div className="relative min-h-screen bg-[#12100E] text-[#E7E3DC] select-none overflow-x-hidden pb-20 pt-16 md:pt-20">
        
        {/* HERO BANNER */}
        <section className="relative min-h-[30vh] border-b border-[#E7E3DC]/10 px-6 md:px-12 py-12 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <span className="font-mono text-[10px] tracking-widest text-[#C87A53] uppercase">// Sectors & Operations</span>
            <h1 
              className="text-5xl md:text-7xl tracking-tight leading-none text-[#E7E3DC]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              METICULOUS STAGE <br />
              <span className="italic font-light">Deployments</span>
            </h1>
            <p className="font-mono text-xs text-[#A39E93] leading-relaxed max-w-lg">
              Detailed structural classifications of our design sectors. We supply certified staging, audio engineering, and visual direction.
            </p>
          </div>
        </section>

        {/* SERVICES TABLE GRID SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="border-t border-[#E7E3DC]/10 divide-y divide-[#E7E3DC]/10">
            {servicesData.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-stretch group"
              >
                
                {/* Number & Cover image col */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <span 
                      className="text-4xl text-[#C87A53] font-normal"
                      style={{ fontFamily: 'var(--font-cormorant), serif' }}
                    >
                      {service.number}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-[#A39E93] uppercase">
                      {service.subtitle}
                    </span>
                  </div>

                  <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden border border-[#E7E3DC]/5 bg-[#1A1816]">
                    <Image 
                      src={images[service.id] || service.image} 
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-[0.7]"
                    />
                  </div>
                </div>

                {/* Details col */}
                <div className="lg:col-span-5 flex flex-col justify-between py-2">
                  <div className="space-y-4">
                    <h3 
                      className="text-3xl text-[#E7E3DC] font-normal uppercase"
                      style={{ fontFamily: 'var(--font-cormorant), serif' }}
                    >
                      {service.title}
                    </h3>
                    <p className="font-mono text-xs text-[#A39E93] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Checklist & Booking link col */}
                <div className="lg:col-span-3 flex flex-col justify-between py-2 border-l border-[#E7E3DC]/0 lg:border-l lg:border-[#E7E3DC]/10 lg:pl-8">
                  <ul className="space-y-3 font-mono text-[10px] text-[#A39E93]">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3">
                        <Check className="w-3.5 h-3.5 text-[#C87A53] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-8">
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#E7E3DC]/20 hover:border-[#C87A53] text-[#A39E93] hover:text-[#C87A53] px-6 py-3.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer"
                    >
                      Book Sector <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
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
