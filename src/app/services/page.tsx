'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import MediaImage from '@/components/MediaImage';
import { useAuth } from '@/context/AuthContext';
import { CRAFT, STAGE_IMAGES, resolveGallerySrc } from '@/utils/media';

type ServiceItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  points: string[];
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: 'Weddings',
    subtitle: 'Ceremony to reception',
    description: 'Varmala cues, bridal entries, dance floors, and romantic lighting looks that feel cinematic without losing the moment.',
    image: STAGE_IMAGES[0].src,
    points: ['Custom entry mixes', 'Intelligent lighting', 'Sparklers & fog', 'Full dance floor audio'],
  },
  {
    id: 2,
    title: 'Concerts',
    subtitle: 'Arena-ready systems',
    description: 'Line arrays, heavy truss, and light programming built for bands, DJs, and festival-scale energy.',
    image: STAGE_IMAGES[1].src,
    points: ['Line array rigging', 'Digital consoles', 'Heavy-duty truss', 'Stage monitoring'],
  },
  {
    id: 3,
    title: 'Festivals',
    subtitle: 'Garba to EDM',
    description: 'Wide coverage sound fields, laser skies, and generator-backed nights that never drop the pulse.',
    image: STAGE_IMAGES[2].src,
    points: ['Outdoor coverage', 'Lasers & strobes', 'Generator grids', 'Crowd-first mixes'],
  },
  {
    id: 4,
    title: 'Corporate',
    subtitle: 'Keynotes & launches',
    description: 'Clean speech, LED canvases, and polished stage looks for product drops and leadership stages.',
    image: STAGE_IMAGES[3].src,
    points: ['Wireless mics', 'LED walls', 'Silent power', 'Podium staging'],
  },
  {
    id: 5,
    title: 'Road Shows',
    subtitle: 'Mobile spectacle',
    description: 'Truck-mounted visuals, shock-ready audio, and daylight LED that travels with the campaign.',
    image: STAGE_IMAGES[4].src,
    points: ['Mobile LED', 'Touring audio', 'Quick deploy truss', 'Power fleet'],
  },
  {
    id: 6,
    title: 'SFX & Pyro',
    subtitle: 'Finale moments',
    description: 'Timed SFX, cold pyro, and firework-ready finales for the beat drop everyone waits for.',
    image: STAGE_IMAGES[6].src,
    points: ['Cold sparklers', 'CO₂ & fog', 'Cue sync', 'Firework coordination'],
  },
];

export default function ServicesPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/data');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.services?.length) return;
        setServices((prev) =>
          prev.map((service) => {
            const match = data.services.find((s: { id: number; image_url: string; service_title?: string }) => s.id === service.id);
            if (!match) return service;
            return {
              ...service,
              image: resolveGallerySrc(match.image_url, service.image),
              title: match.service_title || service.title,
            };
          })
        );
      } catch {
        // keep defaults
      }
    }
    load();
  }, []);

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="pt-20">
        <section className="relative px-6 md:px-10 py-16 md:py-24 overflow-hidden border-b border-white/10">
          <motion.div
            aria-hidden
            animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -right-20 top-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="max-w-7xl mx-auto relative">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
              Services
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl leading-[0.95]"
            >
              Full-stack live production
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 text-white/60 max-w-2xl text-base md:text-lg"
            >
              From first mic check to final firework — sound, light, SFX, truss, and DJ artistry under one crew.
            </motion.p>
          </div>
        </section>

        <section className="border-b border-white/10 py-8 overflow-hidden">
          <div className="marquee-track flex w-max gap-8 text-xs uppercase tracking-[0.24em] text-white/50">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex gap-8 px-4">
                {CRAFT.map((c) => (
                  <span key={`${loop}-${c.title}`} className="flex items-center gap-8">
                    {c.title}
                    <span className="text-accent">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 space-y-20 md:space-y-28">
          {services.map((service, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden border border-white/10 group">
                  <MediaImage
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.2em] text-accent">
                    0{idx + 1}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">{service.subtitle}</p>
                  <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">{service.title}</h2>
                  <p className="text-white/60 leading-relaxed mb-6">{service.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.points.map((point) => (
                      <li key={point} className="text-sm text-white/80 border-l border-accent/70 pl-3">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`${whatsappUrl}?text=${encodeURIComponent(`Hi Parth Production, I want to book ${service.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black text-xs font-semibold tracking-[0.16em] uppercase hover:bg-accent/90 transition-colors"
                  >
                    Book {service.title} <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
