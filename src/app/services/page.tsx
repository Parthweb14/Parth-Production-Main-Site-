'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
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
    summary: 'Line arrays, heavy truss, and light programming built for festival-scale energy.',
    detail:
      'Concert systems engineered for clarity under pressure — line arrays, digital consoles, heavy truss, and lighting looks programmed to the set.',
    hero: STAGE_IMAGES[1].src,
    gallery: [STAGE_IMAGES[7].src, STAGE_IMAGES[1].src, STAGE_IMAGES[6].src],
    bookLabel: 'Concert',
  },
  {
    id: 1,
    title: 'Weddings',
    badge: 'WEDDINGS',
    subtitle: 'Ceremony to Reception',
    summary: 'Bridal entries, varmala cues, and dance-floor lighting that stay cinematic and intimate.',
    detail:
      'Sound, light, and SFX timed to every wedding beat — from entry looks to open dance floor — so guests stay in the feeling.',
    hero: STAGE_IMAGES[0].src,
    gallery: [STAGE_IMAGES[0].src, STAGE_IMAGES[5].src, STAGE_IMAGES[6].src],
    bookLabel: 'Wedding',
  },
  {
    id: 3,
    title: 'Festivals',
    badge: 'FESTIVALS',
    subtitle: 'Garba to EDM',
    summary: 'Wide coverage sound, laser skies, and generator-backed nights that never drop.',
    detail:
      'Outdoor festival systems built for coverage and stamina — wide-field audio, lasers, and power grids for long sets.',
    hero: STAGE_IMAGES[2].src,
    gallery: [STAGE_IMAGES[2].src, STAGE_IMAGES[6].src, STAGE_IMAGES[8].src],
    bookLabel: 'Festival',
  },
  {
    id: 4,
    title: 'Corporate',
    badge: 'CORPORATE',
    subtitle: 'Keynotes & Launches',
    summary: 'Clean speech, LED canvases, and polished stages for launches and keynotes.',
    detail:
      'Corporate production with clarity first — wireless mics, LED walls, and silent power that keep the room focused.',
    hero: STAGE_IMAGES[3].src,
    gallery: [STAGE_IMAGES[3].src, STAGE_IMAGES[7].src, STAGE_IMAGES[4].src],
    bookLabel: 'Corporate',
  },
  {
    id: 5,
    title: 'Road Shows',
    badge: 'ROAD SHOWS',
    subtitle: 'Mobile Spectacle',
    summary: 'Mobile LED, touring audio, and quick-deploy rigs that travel with the campaign.',
    detail:
      'Road-ready spectacle — truck-mounted visuals, touring audio, and power fleets that survive day stages and night finales.',
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
        {/* Black hero with extra top space under navbar */}
        <section className="relative bg-black flex items-center justify-center px-6 md:px-10 pt-36 md:pt-44 pb-14 md:pb-16 overflow-hidden border-b border-white/10">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] uppercase tracking-[0.35em] text-white/50 font-semibold mb-3"
            >
              Parth Production
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95] text-white"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-white/65 text-sm md:text-base leading-relaxed max-w-xl mx-auto"
            >
              Full-stack live production — sound, light, SFX, truss, and DJ artistry under one crew.
            </motion.p>
          </div>
        </section>

        {/* Services connected by a traveling rope */}
        <div className="relative">
          {/* Desktop serpentine rope */}
          <svg
            className="pointer-events-none absolute inset-y-0 left-0 right-0 w-full h-full hidden lg:block z-0"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M50 0
                 C 50 40, 18 70, 18 110
                 C 18 150, 82 180, 82 220
                 C 82 260, 18 290, 18 330
                 C 18 370, 82 400, 82 440
                 C 82 480, 18 510, 18 550
                 C 18 590, 82 620, 82 660
                 C 82 700, 50 740, 50 780
                 C 50 820, 50 900, 50 1000"
              fill="none"
              stroke="#FF5F1F"
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M50 0
                 C 50 40, 18 70, 18 110
                 C 18 150, 82 180, 82 220
                 C 82 260, 18 290, 18 330
                 C 18 370, 82 400, 82 440
                 C 82 480, 18 510, 18 550
                 C 18 590, 82 620, 82 660
                 C 82 700, 50 740, 50 780
                 C 50 820, 50 900, 50 1000"
              fill="none"
              stroke="#FF5F1F"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.18"
              filter="blur(1px)"
            />
          </svg>

          {/* Mobile vertical rope */}
          <div
            className="lg:hidden pointer-events-none absolute top-0 bottom-0 left-5 w-px z-0"
            style={{
              background:
                'linear-gradient(180deg, transparent, rgba(255,95,31,0.7), rgba(255,95,31,0.35), transparent)',
              boxShadow: '0 0 10px rgba(255,95,31,0.35)',
            }}
            aria-hidden
          />

          {services.map((service, index) => {
            const imageRight = index % 2 === 1;
            const bookHref = `${whatsappUrl}?text=${encodeURIComponent(
              `Hi Parth Production, I want to book a ${service.bookLabel} event`
            )}`;

            return (
              <section
                key={service.id}
                id={service.title.toLowerCase().replace(/\s+/g, '-')}
                className="relative z-10 border-t border-white/10 py-10 md:py-14"
              >
                {/* Rope knot at each service */}
                <span
                  className="absolute left-5 lg:left-1/2 top-10 -translate-x-1/2 h-3 w-3 rounded-full bg-accent shadow-[0_0_14px_rgba(255,95,31,0.85)] z-20"
                  aria-hidden
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch"
                  >
                    <div
                      className={`relative min-h-[260px] md:min-h-[340px] rounded-3xl overflow-hidden border border-white/10 group ${
                        imageRight ? 'lg:order-2' : ''
                      }`}
                    >
                      <MediaImage
                        src={service.hero}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    <div
                      className={`flex flex-col justify-center py-1 lg:py-2 ${
                        imageRight ? 'lg:order-1 lg:items-end lg:text-right' : ''
                      }`}
                    >
                      <span
                        className={`inline-flex items-center min-h-[28px] px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-[10px] uppercase tracking-[0.22em] text-accent font-semibold mb-3 ${
                          imageRight ? 'lg:self-end' : 'self-start'
                        }`}
                      >
                        {service.badge}
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.18em] text-white/50">
                        {service.subtitle}
                      </p>
                      <p
                        className={`mt-3 text-white/70 text-sm md:text-base leading-relaxed max-w-xl ${
                          imageRight ? 'lg:ml-auto' : ''
                        }`}
                      >
                        {service.summary}
                      </p>
                      <a
                        href={bookHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 inline-flex items-center min-h-[44px] text-sm font-semibold uppercase tracking-[0.14em] text-white hover:text-accent transition-colors ${
                          imageRight ? 'lg:self-end' : 'self-start'
                        }`}
                      >
                        Explore Service →
                      </a>
                    </div>
                  </motion.div>

                  {/* 4:3 gallery with more space from split */}
                  <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                    {service.gallery.map((src, gi) => (
                      <motion.div
                        key={`${service.id}-g-${gi}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ delay: gi * 0.06, duration: 0.4 }}
                        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/15 bg-black transition-all duration-300 hover:scale-[1.02] hover:border-accent/60 hover:shadow-[0_0_28px_rgba(255,95,31,0.25)]"
                      >
                        <MediaImage
                          src={src}
                          alt={`${service.title} showcase ${gi + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center py-8 md:py-10"
                  >
                    <p className="text-sm md:text-base leading-relaxed text-white/75">{service.detail}</p>
                  </motion.div>

                  <div className="flex justify-center pb-1">
                    <a
                      href={bookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 rounded-full bg-accent text-white font-semibold text-sm tracking-wide transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(255,95,31,0.55)]"
                    >
                      Book your {service.bookLabel} Event
                    </a>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
