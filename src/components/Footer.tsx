'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LOGO_PNG } from '@/utils/media';
import { fetchPublicData } from '@/utils/publicDataCache';
import { serviceSlug, canonicalizeCategory } from '@/utils/servicesCatalog';

type FooterService = { id: number; service_title: string };

const DEFAULT_FOOTER_SERVICES: FooterService[] = [
  { id: 2, service_title: 'Concerts' },
  { id: 1, service_title: 'Weddings' },
  { id: 3, service_title: 'Festivals' },
  { id: 4, service_title: 'Corporate Events' },
  { id: 5, service_title: 'Road Shows' },
];

const exploreLinks = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [services, setServices] = useState<FooterService[]>(DEFAULT_FOOTER_SERVICES);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPublicData();
        const rows = data.services as
          | (FooterService & { order_index?: number })[]
          | undefined;
        if (rows?.length) {
          setServices(
            [...rows]
              .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
              .map((s) => ({
                id: s.id,
                service_title: canonicalizeCategory(s.service_title),
              }))
          );
        }
      } catch {
        // keep defaults
      }
    }
    load();
  }, []);

  return (
    <footer className="relative z-20 border-t border-white/10 bg-black pt-16 pb-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-12 relative">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src={LOGO_PNG} alt="Parth Production" className="h-11 object-contain" />
            <span className="font-display text-xl tracking-tight">Parth Production</span>
          </Link>
          <p className="mt-4 text-sm text-white/50 max-w-sm leading-relaxed">
            One stop solution for sound, light, SFX, truss, fireworks, and DJ artistry.
          </p>
        </div>

        <div className="border-t border-white/10 pt-4 md:border-0 md:pt-0">
          <button
            type="button"
            className="flex w-full items-center justify-between md:cursor-default"
            onClick={() => setExploreOpen((o) => !o)}
            aria-expanded={exploreOpen}
          >
            <h4 className="font-display text-base text-white">Explore</h4>
            <ChevronDown
              className={`h-4 w-4 text-white/50 transition-transform md:hidden ${
                exploreOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`mt-3 flex-col gap-3 text-sm text-white/55 ${
              exploreOpen ? 'flex' : 'hidden'
            } md:flex`}
          >
            {exploreLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 md:border-0 md:pt-0">
          <button
            type="button"
            className="flex w-full items-center justify-between md:cursor-default"
            onClick={() => setServicesOpen((o) => !o)}
            aria-expanded={servicesOpen}
          >
            <h4 className="font-display text-base text-white">Services</h4>
            <ChevronDown
              className={`h-4 w-4 text-white/50 transition-transform md:hidden ${
                servicesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`mt-3 flex-col gap-3 text-sm text-white/55 ${
              servicesOpen ? 'flex' : 'hidden'
            } md:flex`}
          >
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/services#${serviceSlug(s.service_title)}`}
                className="hover:text-accent transition-colors"
              >
                {canonicalizeCategory(s.service_title)}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 md:border-0 md:pt-0">
          <button
            type="button"
            className="flex w-full items-center justify-between md:cursor-default"
            onClick={() => setContactOpen((o) => !o)}
            aria-expanded={contactOpen}
          >
            <h4 className="font-display text-base text-white">Contact Us</h4>
            <ChevronDown
              className={`h-4 w-4 text-white/50 transition-transform md:hidden ${
                contactOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`mt-3 flex-col gap-3 text-sm text-white/55 ${
              contactOpen ? 'flex' : 'hidden'
            } md:flex`}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              WhatsApp {siteSettings.phone_1}
            </a>
            <a href={`tel:+91${siteSettings.phone_2}`} className="hover:text-accent transition-colors">
              Call {siteSettings.phone_2}
            </a>
            <a
              href={`mailto:${siteSettings.email}`}
              className="hover:text-accent transition-colors break-all"
            >
              {siteSettings.email}
            </a>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/35 tracking-wide uppercase"
      >
        <span>© {year} Parth Production</span>
        <span>{siteSettings.address}</span>
      </motion.div>
      <p className="max-w-7xl mx-auto mt-4 text-center text-[11px] tracking-[0.08em] text-white/35 normal-case">
        Designed by{' '}
        <a
          href="https://trishulhub.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/55 underline underline-offset-2 transition-colors hover:text-[#3A8FB8]"
        >
          Trishulhub
        </a>
      </p>
    </footer>
  );
}
