'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import MediaImage from '@/components/MediaImage';
import CinematicPageHero from '@/components/CinematicPageHero';
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
  highlights: string[];
};

const DEFAULT_SERVICES: ServiceBlock[] = [
  {
    id: 2,
    title: 'Concerts',
    badge: '01',
    subtitle: 'Arena-Ready Systems',
    summary: 'Line arrays, heavy truss, and light programming built for festival-scale energy.',
    detail:
      'Concert systems engineered for clarity under pressure — line arrays, digital consoles, heavy truss, and lighting looks programmed to the set.',
    hero: STAGE_IMAGES[1].src,
    gallery: [STAGE_IMAGES[7].src, STAGE_IMAGES[1].src, STAGE_IMAGES[6].src],
    bookLabel: 'Concert',
    highlights: ['Line arrays', 'Heavy truss', 'Cue-mapped lights', 'FOH mix'],
  },
  {
    id: 1,
    title: 'Weddings',
    badge: '02',
    subtitle: 'Ceremony to Reception',
    summary: 'Bridal entries, varmala cues, and dance-floor lighting that stay cinematic and intimate.',
    detail:
      'Sound, light, and SFX timed to every wedding beat — from entry looks to open dance floor — so guests stay in the feeling.',
    hero: STAGE_IMAGES[0].src,
    gallery: [STAGE_IMAGES[0].src, STAGE_IMAGES[5].src, STAGE_IMAGES[6].src],
    bookLabel: 'Wedding',
    highlights: ['Entry looks', 'Dance floor', 'Cold sparklers', 'DJ flow'],
  },
  {
    id: 3,
    title: 'Festivals',
    badge: '03',
    subtitle: 'Garba to EDM',
    summary: 'Wide coverage sound, laser skies, and generator-backed nights that never drop.',
    detail:
      'Outdoor festival systems built for coverage and stamina — wide-field audio, lasers, and power grids for long sets.',
    hero: STAGE_IMAGES[2].src,
    gallery: [STAGE_IMAGES[2].src, STAGE_IMAGES[6].src, STAGE_IMAGES[8].src],
    bookLabel: 'Festival',
    highlights: ['Wide coverage', 'Lasers', 'Power grid', 'Long-set stamina'],
  },
  {
    id: 4,
    title: 'Corporate',
    badge: '04',
    subtitle: 'Keynotes & Launches',
    summary: 'Clean speech, LED canvases, and polished stages for launches and keynotes.',
    detail:
      'Corporate production with clarity first — wireless mics, LED walls, and silent power that keep the room focused.',
    hero: STAGE_IMAGES[3].src,
    gallery: [STAGE_IMAGES[3].src, STAGE_IMAGES[7].src, STAGE_IMAGES[4].src],
    bookLabel: 'Corporate',
    highlights: ['Speech clarity', 'LED walls', 'Silent power', 'Brand polish'],
  },
  {
    id: 5,
    title: 'Road Shows',
    badge: '05',
    subtitle: 'Mobile Spectacle',
    summary: 'Mobile LED, touring audio, and quick-deploy rigs that travel with the campaign.',
    detail:
      'Road-ready spectacle — truck-mounted visuals, touring audio, and power fleets that survive day stages and night finales.',
    hero: STAGE_IMAGES[4].src,
    gallery: [STAGE_IMAGES[4].src, STAGE_IMAGES[8].src, STAGE_IMAGES[2].src],
    bookLabel: 'Road Show',
    highlights: ['Mobile LED', 'Tour audio', 'Quick deploy', 'Night finales'],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ServicesPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [activeId, setActiveId] = useState(DEFAULT_SERVICES[0].id);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

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

  useEffect(() => {
    const nodes = services
      .map((s) => document.getElementById(s.title.toLowerCase().replace(/\s+/g, '-')))
      .filter(Boolean) as HTMLElement[];

    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const match = services.find(
          (s) => s.title.toLowerCase().replace(/\s+/g, '-') === visible.target.id
        );
        if (match) setActiveId(match.id);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.55] }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [services]);

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#ff5a3c]"
        style={{ scaleX: progress }}
      />

      <main className="relative overflow-x-hidden bg-black">
        <CinematicPageHero
          eyebrow="Production catalog"
          title="Services built"
          italicLine="for every stage."
          description="Five production systems — concerts, weddings, festivals, corporate, and road shows — engineered as one crew from first cue to final hit."
          image={STAGE_IMAGES[7].src}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16">
          {/* Jump chips above services — not in hero */}
          <div className="mb-10 md:mb-12 flex flex-wrap justify-center gap-2">
            {services.map((s) => {
              const slug = s.title.toLowerCase().replace(/\s+/g, '-');
              const active = s.id === activeId;
              return (
                <a
                  key={s.id}
                  href={`#${slug}`}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] font-semibold transition-all ${
                    active
                      ? 'border-[#ff5a3c] bg-[#ff5a3c]/15 text-white'
                      : 'border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {s.title}
                </a>
              );
            })}
          </div>

          <div className="space-y-16 md:space-y-28">
            {services.map((service, index) => {
              const bookHref = `${whatsappUrl}?text=${encodeURIComponent(
                `Hi Parth Production, I want to book a ${service.bookLabel} event`
              )}`;
              const reverse = index % 2 === 1;
              const slug = service.title.toLowerCase().replace(/\s+/g, '-');

              return (
                <motion.section
                  key={service.id}
                  id={slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, ease }}
                  className="relative scroll-mt-28"
                >
                  <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
                    <div
                      className={`relative grid grid-cols-1 md:grid-cols-2 ${
                        reverse ? 'md:[&>*:first-child]:order-2' : ''
                      }`}
                    >
                      <div className="relative min-h-[260px] md:min-h-[400px] overflow-hidden group">
                        <MediaImage
                          src={service.hero}
                          alt={service.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute left-5 top-5">
                          <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
                            System {service.badge}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#ff5a3c] font-semibold mb-2">
                          {service.subtitle}
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-none">
                          {service.title}
                        </h2>
                        <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-white/65">
                          {service.summary}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-white/45">{service.detail}</p>

                        <ul className="mt-6 grid grid-cols-2 gap-2">
                          {service.highlights.map((item) => (
                            <li
                              key={item}
                              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70"
                            >
                              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ff5a3c]" />
                              {item}
                            </li>
                          ))}
                        </ul>

                        <a
                          href={bookHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#ff5a3c] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(255,90,60,0.4)]"
                        >
                          Book {service.bookLabel}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="relative grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
                      {service.gallery.map((src, gi) => (
                        <motion.div
                          key={`${service.id}-g-${gi}`}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: gi * 0.08, duration: 0.4 }}
                          className="relative aspect-[4/3] overflow-hidden bg-black group"
                        >
                          <MediaImage
                            src={src}
                            alt={`${service.title} ${gi + 1}`}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </article>
                </motion.section>
              );
            })}
          </div>
        </div>

        <QuoteCta />
      </main>

      <Footer />
    </>
  );
}
