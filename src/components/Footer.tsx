'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, Mail, MapPin, Clock, ArrowUpRight, ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsAppIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M12.004 0C5.378 0 0 5.377 0 12.002c0 2.112.551 4.165 1.597 5.975L.053 24l6.17-1.619a11.955 11.955 0 005.78 1.48C18.63 23.861 24 18.483 24 11.859c0-3.21-1.25-6.228-3.518-8.496A11.948 11.948 0 0012.004 0zM12 21.855c-1.93 0-3.824-.505-5.49-1.462l-.393-.225-3.66.96.976-3.566-.247-.393a9.817 9.817 0 01-1.503-5.17c0-5.417 4.408-9.824 9.825-9.824 2.624 0 5.091 1.022 6.945 2.877a9.756 9.756 0 012.877 6.947c-.004 5.421-4.413 9.827-9.83 9.827zm5.347-7.3c-.293-.146-1.733-.855-2.002-.953-.268-.098-.463-.146-.658.146-.195.293-.756.953-.927 1.149-.17.195-.341.22-.634.073-.293-.146-1.237-.456-2.356-1.455-.87-.777-1.458-1.738-1.629-2.031-.17-.293-.018-.452.128-.597.132-.131.293-.342.439-.513.147-.171.196-.293.293-.488.098-.195.049-.366-.024-.513-.073-.146-.658-1.587-.902-2.172-.239-.574-.481-.494-.66-.503-.17-.009-.366-.009-.561-.009-.195 0-.512.073-.78.366-.268.293-1.024 1-1.024 2.439 0 1.439 1.049 2.829 1.165 2.99.117.161 2.063 3.149 5.0 4.42.699.303 1.245.484 1.669.619.702.224 1.342.193 1.848.117.563-.083 1.733-.708 1.977-1.391.244-.683.244-1.269.171-1.391-.073-.122-.269-.196-.562-.342z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [servicesLinksOpen, setServicesLinksOpen] = useState(false);
  const { siteSettings } = useAuth();

  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  const socialLinks = [
    { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/parthproduction' },
    { name: 'Email', icon: Mail, href: `mailto:${siteSettings.email}?body=Hi%20Parth%20Production%20` },
    { name: 'WhatsApp', icon: WhatsAppIcon, href: whatsappUrl },
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
    <footer className="relative z-20 bg-[#070709] border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Description */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Parth Production Logo" 
              className="w-16 h-16 rounded-full border border-white/10 object-cover"
            />
            <div>
              <h4 className="text-md font-black tracking-tight text-white uppercase" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>PARTH PRODUCTION</h4>
            </div>
          </Link>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((soc) => {
              const Icon = soc.icon;
              return (
                <a 
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-gradient-to-tr hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 hover:scale-110 cursor-pointer animate-none"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4 lg:space-y-6 pb-4 border-b border-white/5 lg:border-none lg:pb-0">
          <button 
            onClick={() => setQuickLinksOpen(!quickLinksOpen)}
            className="flex items-center justify-between w-full text-left lg:pointer-events-none focus:outline-none"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Quick Navigation</h4>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 lg:hidden ${quickLinksOpen ? 'rotate-180' : ''}`} />
          </button>
          <ul className={`space-y-3 transition-all duration-300 ${quickLinksOpen ? 'block' : 'hidden lg:block'}`}>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="space-y-4 lg:space-y-6 pb-4 border-b border-white/5 lg:border-none lg:pb-0">
          <button 
            onClick={() => setServicesLinksOpen(!servicesLinksOpen)}
            className="flex items-center justify-between w-full text-left lg:pointer-events-none focus:outline-none"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Our Services</h4>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 lg:hidden ${servicesLinksOpen ? 'rotate-180' : ''}`} />
          </button>
          <ul className={`space-y-3 transition-all duration-300 ${servicesLinksOpen ? 'block' : 'hidden lg:block'}`}>
            {servicesLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs text-zinc-400 hover:text-amber-500 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Contact Info</h4>
          <ul className="space-y-4 text-xs">
            <li className="flex gap-3 text-zinc-400">
              <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <a href={`tel:+91${siteSettings.phone_1}`} className="hover:text-white transition-all block font-semibold">+91 {siteSettings.phone_1}</a>
                <a href={`tel:+91${siteSettings.phone_2}`} className="hover:text-white transition-all block text-zinc-500 mt-1">+91 {siteSettings.phone_2}</a>
              </div>
            </li>
            <li className="flex gap-3 text-zinc-400">
              <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <a href={`mailto:${siteSettings.email}`} className="hover:text-white transition-all block">
                {siteSettings.email}
              </a>
            </li>
            <li className="flex gap-3 text-zinc-400">
              <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings.address || '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
              >
                {siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}
              </a>
            </li>
            <li className="flex gap-3 text-zinc-400">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Available 24/7 for Events</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
        <p className="text-[10px] text-zinc-500">
          © {currentYear} Parth Production. All rights reserved.
        </p>
        <p className="text-[10px] text-zinc-500 flex items-center gap-1">
          Designed by <a href="https://www.trishulhub.in" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white font-bold uppercase transition-colors">Trishulhub agency</a>
        </p>
      </div>
    </footer>
  );
}
