'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
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
      <header className="fixed top-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-md border-b border-neutral-900 z-50 flex items-center justify-between px-6 md:px-12 select-none">
        
        {/* Top Left: Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <img 
            src="https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Parth%20logo%20bg%20.png" 
            alt="Parth Logo" 
            className="h-10 object-contain"
            onError={(e) => {
              // fallback if R2 file doesn't load
              e.currentTarget.src = "/logo.png";
            }}
          />
          <span className="text-xl font-bold tracking-tight text-white font-sans uppercase">
            leam
          </span>
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`text-sm tracking-wider uppercase transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Top Right: Action Button */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block bg-white text-black font-semibold rounded-full px-6 py-2.5 text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white/90 active:scale-95 cursor-pointer"
        >
          Get the App
        </a>

        {/* Mobile Hamburger menu */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center p-2 text-white cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black z-40 md:hidden flex flex-col pt-24 px-6 justify-between pb-8"
          >
            <div className="flex flex-col gap-6 text-lg font-medium tracking-wide">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`pb-4 border-b border-neutral-900 ${pathname === '/' ? 'text-white' : 'text-neutral-400'}`}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`pb-4 border-b border-neutral-900 ${
                    pathname === item.href ? 'text-white' : 'text-neutral-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="w-full py-4 bg-white text-black rounded-full text-center text-sm font-bold tracking-widest uppercase transition-colors"
            >
              Get the App
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
