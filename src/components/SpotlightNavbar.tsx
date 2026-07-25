'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
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
      <header className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 bg-black/55 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <img
            src="https://assets.parthproduction.in/Parth%20logo%20bg%20.png"
            alt="Parth Production"
            className="h-12 md:h-14 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
            }}
          />
          <span className="hidden sm:block font-display text-lg tracking-tight text-white truncate">
            Parth Production
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs tracking-[0.16em] uppercase transition-colors ${
                  isActive ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 bg-accent text-black text-xs font-semibold tracking-[0.14em] uppercase hover:bg-accent/90 transition-colors"
          >
            Book
          </a>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-0 bg-black z-40 md:hidden flex flex-col pt-24 px-6 pb-8"
          >
            <div className="flex flex-col gap-5 text-lg">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`pb-4 border-b border-white/10 ${
                    pathname === item.href ? 'text-white' : 'text-white/55'
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
              className="mt-auto w-full py-4 bg-accent text-black text-center text-sm font-semibold tracking-[0.16em] uppercase"
            >
              Book a production
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
