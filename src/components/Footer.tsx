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
    <footer className="relative z-20 border-t border-white/10 bg-[#070B1A] pt-16 pb-10 px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0 site-grid opacity-20" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 relative">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src={LOGO_PNG} alt="Parth Production" className="h-11 object-contain" />
            <span className="font-display text-xl tracking-tight font-semibold">Parth Production</span>
          </Link>
          <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
            Production systems for nights that stay loud in memory — sound, light, SFX, truss, fireworks, DJ.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-400">
          <h4 className="font-display text-base text-white font-semibold">Explore</h4>
          <Link href="/services" className="hover:text-cyan-300 transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-cyan-300 transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-cyan-300 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-400">
          <h4 className="font-display text-base text-white font-semibold">Connect</h4>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            WhatsApp {siteSettings.phone_1}
          </a>
          <a href={`tel:+91${siteSettings.phone_2}`} className="hover:text-cyan-300 transition-colors">
            Call {siteSettings.phone_2}
          </a>
          <a href={`mailto:${siteSettings.email}`} className="hover:text-cyan-300 transition-colors break-all">
            {siteSettings.email}
          </a>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500 tracking-wide uppercase"
      >
        <span>© {year} Parth Production</span>
        <span>{siteSettings.address}</span>
      </motion.div>
    </footer>
  );
}
