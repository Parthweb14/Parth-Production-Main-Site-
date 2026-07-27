'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight, Clock3, Navigation } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import QuoteCta from '@/components/QuoteCta';
import CinematicPageHero from '@/components/CinematicPageHero';
import { useAuth } from '@/context/AuthContext';
import { STAGE_IMAGES } from '@/utils/media';

export default function ContactPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const address = siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const channels = [
    {
      label: 'Phone',
      href: `tel:+91${siteSettings.phone_1}`,
      icon: Phone,
      primary: `+91 ${siteSettings.phone_1}`,
      secondary: siteSettings.phone_2 ? `+91 ${siteSettings.phone_2}` : 'Tap to call the crew',
      external: false,
    },
    {
      label: 'Email',
      href: `mailto:${siteSettings.email}`,
      icon: Mail,
      primary: siteSettings.email,
      secondary: 'Send date, venue, and vibe',
      external: false,
    },
    {
      label: 'Studio',
      href: mapsUrl,
      icon: MapPin,
      primary: address,
      secondary: 'Open in Google Maps',
      external: true,
    },
  ];

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#3A8FB8]"
        style={{ scaleX: progress }}
      />

      <main className="relative overflow-x-hidden bg-black">
        <CinematicPageHero
          eyebrow="Book the floor"
          title="Tell us the"
          italicLine="date & the vibe."
          description="Share venue, guest count, and energy — sound, light, SFX, truss, fireworks, DJ. One crew. One system."
          image={STAGE_IMAGES[3].src}
        />

        {/* Command center */}
        <section id="connect" className="relative border-b border-white/10 py-14 md:py-20 scroll-mt-28">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#3A8FB8]/10 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative overflow-hidden rounded-[28px] border border-[#3A8FB8]/25 bg-gradient-to-br from-[#0a1524]/90 via-[#050a12] to-black p-7 md:p-9 glass-card"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#3A8FB8]/12 blur-3xl" />
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#3A8FB8] font-semibold mb-3">
                Fastest reply
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
                WhatsApp the
                <br />
                production desk
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/65 leading-relaxed max-w-md">
                Send your date, city, guest count, and preferred vibe. We&apos;ll lock a production
                plan for sound, light, and stage.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-book-btn mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" />
                Start WhatsApp chat
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <Clock3 className="h-4 w-4 text-[#3A8FB8] mb-2" />
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45 mb-1">Hours</p>
                  <p className="text-sm text-white font-semibold">Open for bookings</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <Navigation className="h-4 w-4 text-[#3A8FB8] mb-2" />
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45 mb-1">Base</p>
                  <p className="text-sm text-white font-semibold">Surat, Gujarat</p>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-7 space-y-3 md:space-y-4">
              {channels.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.a
                    key={card.label}
                    href={card.href}
                    target={card.external ? '_blank' : undefined}
                    rel={card.external ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group relative flex items-center gap-4 md:gap-5 overflow-hidden rounded-[22px] border border-white/10 bg-[#050a12]/70 backdrop-blur-md p-5 md:p-6 transition-all duration-300 hover:border-[#3A8FB8]/40 hover:bg-[#0a1524]/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(58,143,184,0.12)]"
                  >
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#3A8FB8]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[#3A8FB8]/30 bg-[#3A8FB8]/10 text-[#3A8FB8] transition-colors group-hover:bg-[#3A8FB8] group-hover:text-[#050a12]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 font-semibold mb-1">
                        {card.label}
                      </p>
                      <p className="text-lg md:text-xl font-semibold text-white group-hover:text-[#3A8FB8] transition-colors break-words">
                        {card.primary}
                      </p>
                      <p className="mt-1 text-sm text-white/50">{card.secondary}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-white/30 transition-all group-hover:text-[#3A8FB8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Map theater */}
        <section id="studio-map" className="relative py-14 md:py-20 px-6 md:px-10 scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#3A8FB8] font-semibold mb-2">
                  Studio pin
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
                  Find the crew
                </h2>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all hover:border-[#3A8FB8]/50 hover:bg-white/5"
              >
                Open directions
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-2 md:p-3"
            >
              <div className="relative overflow-hidden rounded-[22px] border border-white/10 min-h-[360px] md:min-h-[480px]">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 360 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Parth Production location"
                  className="absolute inset-0 w-full h-full grayscale invert opacity-55 contrast-125 hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3A8FB8]/35 bg-black/70 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#3A8FB8] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3A8FB8] animate-pulse" />
                    Parth Production Studio
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <QuoteCta />
      </main>
      <Footer />
    </>
  );
}
