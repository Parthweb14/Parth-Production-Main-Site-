'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LOGO_PNG } from '@/utils/media';

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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 bg-black border-b border-white/10 h-[88px]">
        <Link href="/" className="flex items-center min-w-0 group py-2">
          <img
            src={LOGO_PNG}
            alt="Parth Production"
            className="h-16 sm:h-[72px] md:h-20 w-auto object-contain object-left transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-xs tracking-[0.18em] uppercase transition-colors ${
                  active ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-accent"
                  />
                )}
              </Link>
            );
          })}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-4 text-[11px]">
            Book now
          </a>
        </nav>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-white min-w-[44px] min-h-[44px]"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-0 bg-black z-40 md:hidden flex flex-col pt-28 px-6 pb-8"
          >
            <div className="flex flex-col gap-5 text-2xl font-display">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={pathname === item.href ? 'text-accent' : 'text-white'}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-auto w-full"
            >
              Book a production
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
