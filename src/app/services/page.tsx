'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import LiquidGlassBackdrop from '@/components/LiquidGlassBackdrop';
import { useAuth } from '@/context/AuthContext';
import { STAGE_IMAGES, resolveGallerySrc } from '@/utils/media';

type ServiceItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  featured?: boolean;
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 2,
    title: 'Concerts',
    subtitle: 'Arena-ready systems',
    description:
      'Line arrays, heavy truss, and light programming built for bands, DJs, and festival-scale energy that fills every seat.',
    image: STAGE_IMAGES[1].src,
    tag: 'Flagship Service',
    featured: true,
  },
  {
    id: 1,
    title: 'Weddings',
    subtitle: 'Ceremony to reception',
    description:
      'Varmala cues, bridal entries, and dance-floor lighting that feels cinematic without losing the moment.',
    image: STAGE_IMAGES[0].src,
    tag: 'Weddings',
  },
  {
    id: 3,
    title: 'Festivals',
    subtitle: 'Garba to EDM',
    description:
      'Wide coverage sound, laser skies, and generator-backed nights that never drop the pulse.',
    image: STAGE_IMAGES[2].src,
    tag: 'Festivals',
  },
  {
    id: 4,
    title: 'Corporate',
    subtitle: 'Keynotes & launches',
    description:
      'Clean speech, LED canvases, and polished stage looks for product drops and leadership stages.',
    image: STAGE_IMAGES[3].src,
    tag: 'Corporate',
  },
  {
    id: 5,
    title: 'Road Shows',
    subtitle: 'Mobile spectacle',
    description:
      'Truck-mounted visuals, touring audio, and daylight LED that travels with the campaign.',
    image: STAGE_IMAGES[4].src,
    tag: 'Roadshows',
  },
  {
    id: 6,
    title: 'SFX & Pyro',
    subtitle: 'Finale moments',
    description:
      'Timed SFX, cold pyro, and firework-ready finales for the beat drop everyone waits for.',
    image: STAGE_IMAGES[6].src,
    tag: 'SFX',
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
            const match = data.services.find(
              (s: { id: number; image_url: string; service_title?: string }) =>
                s.id === service.id
            );
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

  const featured = services.find((s) => s.featured) ?? services[0];
  const gridServices = services.filter((s) => s.id !== featured.id);

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <main className="relative overflow-x-hidden bg-black">
        {/* 1. HERO — liquid glass */}
        <section className="relative min-h-[100svh] flex items-center justify-center px-6 md:px-10 py-32 overflow-hidden">
          <LiquidGlassBackdrop />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-accent font-semibold mb-5"
            >
              Parth Production
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.95] glass-heading"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 md:mt-8 text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Full-stack live production. From first mic check to final firework — sound, light,
              SFX, truss, and DJ artistry under one crew.
            </motion.p>
          </div>
        </section>

        {/* 2–3. Featured + grid */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-24">
          {/* Featured wider card */}
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="glass-card group grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl mb-6 md:mb-8"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden">
              <MediaImage
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            </div>
            <div className="relative flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 bg-black/35">
              <span className="inline-flex self-start items-center min-h-[32px] px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] uppercase tracking-[0.22em] text-accent font-semibold mb-4">
                {featured.tag}
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
                {featured.title}
              </h2>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/45">
                {featured.subtitle}
              </p>
              <p className="mt-4 text-white/65 text-sm md:text-base leading-relaxed max-w-md">
                {featured.description}
              </p>
              <a
                href={`${whatsappUrl}?text=${encodeURIComponent(`Hi Parth Production, I want to book ${featured.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center min-h-[44px] text-sm font-semibold uppercase tracking-[0.14em] text-white hover:text-accent transition-colors"
              >
                Explore Service →
              </a>
            </div>
          </motion.article>

          {/* Remaining services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {gridServices.map((service, i) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="glass-card group flex flex-col overflow-hidden rounded-3xl transition-transform duration-300 ease-out hover:-translate-y-2"
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-t-3xl">
                  <MediaImage
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col flex-1 p-5 md:p-6 bg-black/40">
                  <span className="inline-flex self-start items-center min-h-[28px] px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                    {service.tag}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-white/60 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <a
                    href={`${whatsappUrl}?text=${encodeURIComponent(`Hi Parth Production, I want to book ${service.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center min-h-[44px] text-xs font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-accent transition-colors"
                  >
                    Explore Service →
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
