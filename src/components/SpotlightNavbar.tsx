'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function SpotlightNavbar() {
  const pathname = usePathname();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-[#12100E] border-b border-[#E7E3DC]/10 z-50 flex items-stretch select-none">
        
        {/* Left Side: Brand Box */}
        <Link 
          href="/" 
          className="flex items-center px-6 md:px-8 border-r border-[#E7E3DC]/10 hover:bg-[#E7E3DC]/3 transition-colors cursor-pointer"
        >
          <span 
            className="text-lg md:text-xl tracking-wider text-[#E7E3DC] font-normal uppercase"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            PARTH PRODUCTION
          </span>
        </Link>

        {/* Center: Desktop Navigation Grid */}
        <nav className="hidden md:flex items-stretch flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center justify-center px-8 border-r border-[#E7E3DC]/10 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 relative group cursor-pointer ${
                  isActive ? 'text-[#C87A53] bg-[#E7E3DC]/3' : 'text-[#A39E93] hover:text-[#E7E3DC] hover:bg-[#E7E3DC]/2'
                }`}
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeHeaderDot"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C87A53]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Desktop Booking Button */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-8 bg-transparent text-[#C87A53] hover:text-[#E7E3DC] hover:bg-[#C87A53]/10 text-[10px] tracking-[0.2em] font-bold uppercase transition-all duration-300 border-l border-[#E7E3DC]/10 cursor-pointer"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          BOOK EVENT <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        {/* Mobile Hamburger toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center px-6 border-l border-[#E7E3DC]/10 text-[#E7E3DC] cursor-pointer ml-auto"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Grid Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#12100E] z-40 md:hidden flex flex-col pt-24 px-6 justify-between pb-8"
          >
            {/* Nav list */}
            <div className="flex flex-col border-t border-[#E7E3DC]/10 divide-y divide-[#E7E3DC]/10">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="py-5 text-sm tracking-[0.15em] uppercase text-[#A39E93] hover:text-[#E7E3DC]"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-5 text-sm tracking-[0.15em] uppercase transition-colors ${
                    pathname === item.href ? 'text-[#C87A53] font-bold' : 'text-[#A39E93] hover:text-[#E7E3DC]'
                  }`}
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="w-full h-14 bg-[#C87A53] text-[#12100E] flex items-center justify-center text-xs font-bold tracking-[0.25em] uppercase transition-colors"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                BOOK EVENT
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
