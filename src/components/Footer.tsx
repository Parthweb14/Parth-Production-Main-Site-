'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LOGO_PNG } from '@/utils/media';

export default function Footer() {
  const year = new Date().getFullYear();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <footer className="relative z-20 border-t border-white/10 bg-black pt-16 pb-10 px-6 md:px-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(circle_at_center,rgba(255,95,31,0.18),transparent_70%)]" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 relative">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src={LOGO_PNG} alt="Parth Production" className="h-11 object-contain" />
            <span className="font-display text-xl tracking-tight">Parth Production</span>
          </Link>
          <p className="mt-4 text-sm text-white/50 max-w-sm leading-relaxed">
            One stop solution for sound, light, SFX, truss, fireworks, and DJ artistry.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-white/55">
          <h4 className="font-display text-base text-white">Explore</h4>
          <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col gap-3 text-sm text-white/55">
          <h4 className="font-display text-base text-white">Connect</h4>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            WhatsApp {siteSettings.phone_1}
          </a>
          <a href={`tel:+91${siteSettings.phone_2}`} className="hover:text-accent transition-colors">
            Call {siteSettings.phone_2}
          </a>
          <a href={`mailto:${siteSettings.email}`} className="hover:text-accent transition-colors break-all">
            {siteSettings.email}
          </a>
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
    </footer>
  );
}
