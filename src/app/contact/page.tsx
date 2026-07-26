'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const address = siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const cards = [
    {
      label: 'Phone',
      href: `tel:+91${siteSettings.phone_1}`,
      icon: Phone,
      primary: `+91 ${siteSettings.phone_1}`,
      secondary: siteSettings.phone_2 ? `+91 ${siteSettings.phone_2}` : null,
      external: false,
    },
    {
      label: 'Email',
      href: `mailto:${siteSettings.email}`,
      icon: Mail,
      primary: siteSettings.email,
      secondary: null,
      external: false,
    },
    {
      label: 'Studio',
      href: mapsUrl,
      icon: MapPin,
      primary: address,
      secondary: 'Open in Maps',
      external: true,
    },
  ];

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="relative overflow-x-hidden bg-[#0A0E27]">
        <PageHero
          title="Tell us the date"
          description="Share venue, guest count, and vibe — sound, light, SFX, truss, fireworks, DJ. One crew."
        />

        <section className="relative border-t border-white/10 py-12 md:py-16 px-4 sm:px-6 md:px-10 overflow-hidden">
          <div className="absolute inset-0 site-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-5 space-y-3 md:space-y-4">
              <p className="section-label mb-2">Command desk</p>
              <h2 className="font-display text-2xl md:text-4xl font-semibold uppercase tracking-tight text-white mb-4 md:mb-6">
                Reach the crew
              </h2>
              {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.a
                    key={card.label}
                    href={card.href}
                    target={card.external ? '_blank' : undefined}
                    rel={card.external ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#111827]/75 p-4 md:p-5 hover:border-cyan-400/40 transition-colors group"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-[#0A0E27] transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-1">
                        {card.label}
                      </p>
                      <p className="text-base md:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors break-words">
                        {card.primary}
                      </p>
                      {card.secondary && (
                        <p className="mt-1 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                          {card.secondary}
                        </p>
                      )}
                    </div>
                  </motion.a>
                );
              })}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex min-h-[44px] w-full sm:w-auto mt-2"
              >
                WhatsApp Parth Production
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative overflow-hidden border border-white/10 rounded-2xl saas-card !p-0 min-h-[360px] md:min-h-[520px]"
            >
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 360 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Parth Production location"
                className="absolute inset-0 w-full h-full grayscale invert opacity-50 contrast-125 hover:opacity-75 transition-opacity duration-500"
              />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#0A0E27]/80 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Studio pin
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
