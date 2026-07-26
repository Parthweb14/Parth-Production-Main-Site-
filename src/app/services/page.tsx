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

type ServiceBlock = {
  id: number;
  title: string;
  badge: string;
  subtitle: string;
  summary: string;
  detail: string;
  hero: string;
  gallery: string[];
  bookLabel: string;
};

const DEFAULT_SERVICES: ServiceBlock[] = [
  {
    id: 2,
    title: 'Concerts',
    badge: 'FLAGSHIP SERVICE',
    subtitle: 'Arena-Ready Systems',
    summary:
      'Line arrays, heavy truss, and light programming built for bands, DJs, and festival-scale energy that fills every seat.',
    detail:
      'From load-in to final cue, our concert systems are engineered for clarity under pressure. We deploy line arrays, digital consoles, heavy-duty truss, and stage monitoring so artists hear themselves cleanly and crowds feel every drop. Lighting looks are programmed to the set — not improvised at the last minute — so the night reads as one continuous production.',
    hero: STAGE_IMAGES[1].src,
    gallery: [STAGE_IMAGES[7].src, STAGE_IMAGES[1].src, STAGE_IMAGES[6].src],
    bookLabel: 'Concert',
  },
  {
    id: 1,
    title: 'Weddings',
    badge: 'WEDDINGS',
    subtitle: 'Ceremony to Reception',
    summary:
      'Varmala cues, bridal entries, and dance-floor lighting that feels cinematic without losing the intimacy of the moment.',
    detail:
      'A wedding is a sequence of emotional beats — and we build sound, light, and SFX around each one. Bridal entries, varmala cues, family performances, and the open dance floor all get their own mix and look. Sparklers, fog, and intelligent lighting stay tasteful and timed so photos stay clean and guests stay in the feeling.',
    hero: STAGE_IMAGES[0].src,
    gallery: [STAGE_IMAGES[0].src, STAGE_IMAGES[5].src, STAGE_IMAGES[6].src],
    bookLabel: 'Wedding',
  },
  {
    id: 3,
    title: 'Festivals',
    badge: 'FESTIVALS',
    subtitle: 'Garba to EDM',
    summary:
      'Wide coverage sound fields, laser skies, and generator-backed nights that never drop the pulse.',
    detail:
      'Outdoor festivals demand coverage, power, and stamina. We design wide-field audio, laser and strobe skies, and generator grids that hold through long sets. Whether it is garba season or an EDM mainstage, the system is built for crowds that move — and for nights that do not end early.',
    hero: STAGE_IMAGES[2].src,
    gallery: [STAGE_IMAGES[2].src, STAGE_IMAGES[6].src, STAGE_IMAGES[8].src],
    bookLabel: 'Festival',
  },
  {
    id: 4,
    title: 'Corporate',
    badge: 'CORPORATE',
    subtitle: 'Keynotes & Launches',
    summary:
      'Clean speech, LED canvases, and polished stage looks for product drops and leadership stages.',
    detail:
      'Corporate stages need clarity first — then impact. We deliver wireless mics that stay intelligible, LED walls that support the brand story, and silent power that keeps the room focused. From product launches to annual keynotes, the production stays sharp, on-brand, and rehearsal-ready.',
    hero: STAGE_IMAGES[3].src,
    gallery: [STAGE_IMAGES[3].src, STAGE_IMAGES[7].src, STAGE_IMAGES[4].src],
    bookLabel: 'Corporate',
  },
  {
    id: 5,
    title: 'Road Shows',
    badge: 'ROAD SHOWS',
    subtitle: 'Mobile Spectacle',
    summary:
      'Truck-mounted visuals, shock-ready audio, and daylight LED that travels with the campaign.',
    detail:
      'Road shows move fast and the gear has to move faster. We build mobile LED, touring audio, quick-deploy truss, and a power fleet that survives daylight stages and night finales. Every stop looks intentional — not like a compromise for the road.',
    hero: STAGE_IMAGES[4].src,
    gallery: [STAGE_IMAGES[4].src, STAGE_IMAGES[8].src, STAGE_IMAGES[2].src],
    bookLabel: 'Road Show',
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
            const nextHero = resolveGallerySrc(match.image_url, service.hero);
            return {
              ...service,
              hero: nextHero,
              title: match.service_title || service.title,
              gallery: [nextHero, service.gallery[1], service.gallery[2]],
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

      <main className="relative overflow-x-hidden bg-black">
        {/* Page hero */}
        <section className="relative min-h-[70svh] md:min-h-[100svh] flex items-center justify-center px-6 md:px-10 py-28 md:py-32 overflow-hidden">
          <LiquidGlassBackdrop />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-accent font-semibold mb-5"
            >
              Parth Production
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.95] glass-heading"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 md:mt-8 text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Full-stack live production. From first mic check to final firework — sound, light,
              SFX, truss, and DJ artistry under one crew.
            </motion.p>
          </div>
        </section>

        {/* Dedicated section per service */}
        {services.map((service, index) => {
          const reverse = index % 2 === 1;
          const bookHref = `${whatsappUrl}?text=${encodeURIComponent(
            `Hi Parth Production, I want to book a ${service.bookLabel} event`
          )}`;

          return (
            <section
              key={service.id}
              id={service.title.toLowerCase().replace(/\s+/g, '-')}
              className="border-t border-white/10 py-16 md:py-24"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                {/* 1. Split hero */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch ${
                    reverse ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative min-h-[320px] md:min-h-[420px] lg:min-h-[520px] rounded-3xl overflow-hidden border border-white/10 group">
                    <MediaImage
                      src={service.hero}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-center py-2 lg:py-6">
                    <span className="inline-flex self-start items-center min-h-[32px] px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-[10px] uppercase tracking-[0.22em] text-accent font-semibold mb-5">
                      {service.badge}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base uppercase tracking-[0.18em] text-white/50">
                      {service.subtitle}
                    </p>
                    <p className="mt-5 text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
                      {service.summary}
                    </p>
                    <a
                      href={bookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center min-h-[44px] text-sm font-semibold uppercase tracking-[0.14em] text-white hover:text-accent transition-colors"
                    >
                      Explore Service →
                    </a>
                  </div>
                </motion.div>

                {/* 2. Gallery — 3 images */}
                <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {service.gallery.map((src, gi) => (
                    <motion.div
                      key={`${service.id}-g-${gi}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: gi * 0.08, duration: 0.45 }}
                      className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black transition-all duration-300 hover:scale-[1.02] hover:border-accent/60 hover:shadow-[0_0_28px_rgba(255,95,31,0.25)]"
                    >
                      <MediaImage
                        src={src}
                        alt={`${service.title} showcase ${gi + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* 3. Description */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto text-center py-12"
                >
                  <p className="text-lg leading-relaxed text-white/80">{service.detail}</p>
                </motion.div>

                {/* 4. CTA */}
                <div className="flex justify-center pb-4">
                  <a
                    href={bookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center min-h-[44px] px-8 py-4 rounded-full bg-accent text-white font-semibold text-sm md:text-base tracking-wide transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(255,95,31,0.55)]"
                  >
                    Book your {service.bookLabel} Event
                  </a>
                </div>
              </div>
            </section>
          );
        })}

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
