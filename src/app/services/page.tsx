'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import PageHero from '@/components/PageHero';
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
  specs: string[];
};

const DEFAULT_SERVICES: ServiceBlock[] = [
  {
    id: 2,
    title: 'Concerts',
    badge: 'FLAGSHIP',
    subtitle: 'Arena-Ready Systems',
    summary: 'Line arrays, heavy truss, and light programming built for festival-scale energy.',
    detail:
      'Concert systems engineered for clarity under pressure — line arrays, digital consoles, heavy truss, and lighting looks programmed to the set.',
    hero: STAGE_IMAGES[1].src,
    gallery: [STAGE_IMAGES[7].src, STAGE_IMAGES[1].src, STAGE_IMAGES[6].src],
    bookLabel: 'Concert',
    specs: ['Line arrays', 'Heavy truss', 'Cue-mapped lights', 'FOH mix'],
  },
  {
    id: 1,
    title: 'Weddings',
    badge: 'WEDDINGS',
    subtitle: 'Ceremony to Reception',
    summary: 'Bridal entries, varmala cues, and dance-floor lighting that stay intimate and sharp.',
    detail:
      'Sound, light, and SFX timed to every wedding beat — from entry looks to open dance floor — so guests stay in the feeling.',
    hero: STAGE_IMAGES[0].src,
    gallery: [STAGE_IMAGES[0].src, STAGE_IMAGES[5].src, STAGE_IMAGES[6].src],
    bookLabel: 'Wedding',
    specs: ['Entry looks', 'Dance floor', 'Cold sparklers', 'DJ flow'],
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
    specs: ['Wide coverage', 'Lasers', 'Power grid', 'Long-set stamina'],
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
    specs: ['Speech clarity', 'LED walls', 'Silent power', 'Brand polish'],
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
    specs: ['Mobile LED', 'Tour audio', 'Quick deploy', 'Night finales'],
  },
];

export default function ServicesPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [activeId, setActiveId] = useState(DEFAULT_SERVICES[0].id);

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

  const active = services.find((s) => s.id === activeId) || services[0];
  const bookHref = `${whatsappUrl}?text=${encodeURIComponent(
    `Hi Parth Production, I want to book a ${active.bookLabel} event`
  )}`;

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <main className="relative overflow-x-hidden bg-[#0A0E27]">
        <PageHero
          title="Our Services"
          description="Full-stack live production — sound, light, SFX, truss, and DJ artistry under one crew."
        />

        <section className="relative border-t border-white/10 py-10 md:py-16 overflow-hidden">
          <div className="absolute inset-0 site-grid opacity-15" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-none pb-4 mb-6 lg:hidden">
              {services.map((service, index) => {
                const selected = service.id === activeId;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveId(service.id)}
                    className={`flex-shrink-0 min-h-[44px] px-4 rounded-full border text-xs uppercase tracking-[0.16em] font-semibold transition-all ${
                      selected
                        ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                        : 'border-white/10 text-slate-400 hover:border-white/25'
                    }`}
                  >
                    0{index + 1} {service.title}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28">
                <p className="section-label mb-4">Service modules</p>
                <div className="space-y-2">
                  {services.map((service, index) => {
                    const selected = service.id === activeId;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setActiveId(service.id)}
                        className={`w-full text-left rounded-2xl border px-4 py-4 transition-all duration-300 ${
                          selected
                            ? 'border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.12)]'
                            : 'border-white/10 bg-[#111827]/50 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                            Module 0{index + 1}
                          </span>
                          {selected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </div>
                        <p className="font-display text-xl font-semibold uppercase tracking-tight text-white">
                          {service.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 uppercase tracking-[0.14em]">
                          {service.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="lg:col-span-8 xl:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="saas-card overflow-hidden !p-0"
                  >
                    <div className="relative aspect-[16/10] md:aspect-[21/10]">
                      <MediaImage
                        src={active.hero}
                        alt={active.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27]/35 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                        <span className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[10px] uppercase tracking-[0.22em] text-cyan-300 font-semibold mb-3">
                          {active.badge}
                        </span>
                        <h2 className="font-display text-3xl md:text-5xl font-semibold uppercase tracking-tight text-white">
                          {active.title}
                        </h2>
                        <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.18em] text-slate-300">
                          {active.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                      <div className="md:col-span-7">
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                          {active.summary}
                        </p>
                        <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-400">
                          {active.detail}
                        </p>
                        <a
                          href={bookHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary mt-6 inline-flex min-h-[44px]"
                        >
                          Book your {active.bookLabel} Event
                        </a>
                      </div>
                      <div className="md:col-span-5">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-3">
                          Included stack
                        </p>
                        <ul className="space-y-2">
                          {active.specs.map((spec) => (
                            <li
                              key={spec}
                              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0A0E27]/60 px-3 py-2.5 text-sm text-slate-300"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="px-5 md:px-8 pb-6 md:pb-8 grid grid-cols-3 gap-2 md:gap-3">
                      {active.gallery.map((src, gi) => (
                        <div
                          key={`${active.id}-g-${gi}`}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10"
                        >
                          <MediaImage
                            src={src}
                            alt={`${active.title} showcase ${gi + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
