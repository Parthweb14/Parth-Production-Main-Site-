'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <footer className="relative z-20 bg-[#0a0a0a] border-t border-white/10 pt-14 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src="https://assets.parthproduction.in/Parth%20logo%20bg%20.png"
              alt="Parth Production"
              className="h-10 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
            <span className="font-display text-xl tracking-tight">Parth Production</span>
          </Link>
          <p className="mt-4 text-sm text-white/50 max-w-xs leading-relaxed">
            Live event production — sound, lighting, staging, and SFX for Gujarat and beyond.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/55">
          <h4 className="font-display text-base text-white mb-1">Explore</h4>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/55">
          <h4 className="font-display text-base text-white mb-1">Connect</h4>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            WhatsApp {siteSettings.phone_1}
          </a>
          <a href={`tel:+91${siteSettings.phone_2}`} className="hover:text-white transition-colors">
            Call {siteSettings.phone_2}
          </a>
          <a href={`mailto:${siteSettings.email}`} className="hover:text-white transition-colors">
            {siteSettings.email}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40 tracking-wide uppercase">
        <span>© {year} Parth Production</span>
        <span>{siteSettings.address}</span>
      </div>
    </footer>
  );
}
