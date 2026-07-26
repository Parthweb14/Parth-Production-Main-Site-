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

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 border-b border-white/10">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="saas-card group p-6 md:p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-[#0A0E27] transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-3">
                  {card.label}
                </p>
                <p className="text-lg md:text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors break-words">
                  {card.primary}
                </p>
                {card.secondary && (
                  <p className="mt-2 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                    {card.secondary}
                  </p>
                )}
              </motion.a>
            );
          })}
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden border border-white/10 rounded-2xl saas-card !p-0"
          >
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Parth Production location"
              className="w-full grayscale invert opacity-50 contrast-125 hover:opacity-75 transition-opacity duration-500"
            />
          </motion.div>

          <div className="flex justify-center mt-8 md:mt-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex min-h-[44px]"
            >
              WhatsApp Parth Production
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
