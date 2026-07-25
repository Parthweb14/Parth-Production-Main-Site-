'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/parthproduction' },
    { name: 'Email', href: `mailto:${siteSettings.email}?body=Hi%20Parth%20Production%20` },
    { name: 'WhatsApp', href: whatsappUrl },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const servicesLinks = [
    { label: 'Weddings', href: '/services' },
    { label: 'Festivals', href: '/services' },
    { label: 'Concerts', href: '/services' },
    { label: 'Corporate Events', href: '/services' },
    { label: 'Road Shows', href: '/services' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <footer className="relative z-20 bg-[#12100E] border-t border-[#E7E3DC]/10 pt-16 pb-12 px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="inline-block">
            <span 
              className="text-xl tracking-wider text-[#E7E3DC] font-normal uppercase"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              PARTH PRODUCTION
            </span>
          </Link>
          <p className="text-[11px] leading-relaxed text-[#A39E93] max-w-xs font-mono">
            Crafting premium cinematic environments, acoustics, and structural light installations for events across India.
          </p>
          
          {/* Socials as slashed text */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] tracking-widest uppercase font-mono">
            {socialLinks.map((soc, idx) => (
              <span key={soc.name} className="text-[#A39E93] flex items-center gap-3">
                <a 
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C87A53] transition-colors"
                >
                  {soc.name}
                </a>
                {idx < socialLinks.length - 1 && <span className="text-[#E7E3DC]/20">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 
            className="text-xs tracking-[0.2em] text-[#E7E3DC] uppercase font-bold"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Navigation
          </h4>
          <ul className="space-y-2.5 text-[11px] font-mono">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-[#A39E93] hover:text-[#C87A53] transition-colors uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Column */}
        <div className="space-y-4">
          <h4 
            className="text-xs tracking-[0.2em] text-[#E7E3DC] uppercase font-bold"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Sectors
          </h4>
          <ul className="space-y-2.5 text-[11px] font-mono">
            {servicesLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-[#A39E93] hover:text-[#C87A53] transition-colors uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4">
          <h4 
            className="text-xs tracking-[0.2em] text-[#E7E3DC] uppercase font-bold"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Office
          </h4>
          <ul className="space-y-4 text-[11px] font-mono text-[#A39E93]">
            <li>
              <span className="text-[9px] uppercase tracking-widest text-[#E7E3DC]/30 block mb-1">Direct Lines</span>
              <a href={`tel:+91${siteSettings.phone_1}`} className="hover:text-[#C87A53] block transition-colors font-bold text-[#E7E3DC]">+91 {siteSettings.phone_1}</a>
              <a href={`tel:+91${siteSettings.phone_2}`} className="hover:text-[#C87A53] block mt-0.5 transition-colors">+91 {siteSettings.phone_2}</a>
            </li>
            <li>
              <span className="text-[9px] uppercase tracking-widest text-[#E7E3DC]/30 block mb-1">Email Enquiries</span>
              <a href={`mailto:${siteSettings.email}`} className="hover:text-[#C87A53] transition-colors block break-all">
                {siteSettings.email}
              </a>
            </li>
            <li>
              <span className="text-[9px] uppercase tracking-widest text-[#E7E3DC]/30 block mb-1">Corporate HQ</span>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings.address || '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C87A53] transition-colors leading-relaxed block"
              >
                {siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#E7E3DC]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center font-mono text-[9px] text-[#A39E93]/60 uppercase tracking-widest">
        <p>
          © {currentYear} Parth Production. All Rights Reserved.
        </p>
        <p>
          Studio — <a href="https://www.trishulhub.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#C87A53] font-bold transition-colors">Trishulhub Agency</a>
        </p>
      </div>
    </footer>
  );
}
