'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LOGO_PNG } from '@/utils/media';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function SpotlightNavbar() {
  const pathname = usePathname();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[210] flex h-[68px] items-center justify-between border-b border-white/10 bg-black px-4 sm:px-5 md:h-[104px] md:px-10">
        <Link
          href="/"
          className="relative z-10 flex min-w-0 items-center py-1 group"
          onClick={() => setMenuOpen(false)}
        >
          <span className="relative block h-[48px] w-[130px] overflow-hidden sm:h-[56px] sm:w-[170px] md:h-[84px] md:w-[260px]">
            <img
              src={LOGO_PNG}
              alt="Parth Production"
              className="absolute left-0 top-1/2 h-[150%] w-auto max-w-none -translate-y-1/2 object-cover object-left transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </span>
        </Link>

        {/* Centered desktop nav */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex lg:gap-10">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-xs uppercase tracking-[0.18em] transition-colors ${
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
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !hidden !px-4 !py-2.5 text-[11px] md:!inline-flex"
          >
            Book now
          </a>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-white md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[200] md:hidden">
            {/* Opaque shell — never fade the backdrop (avoids Stage Gallery showing through) */}
            <div className="absolute inset-0 bg-black" aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full flex-col bg-black px-6 pb-10 pt-24"
            >
              <nav className="flex flex-col gap-5 font-display text-3xl">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={
                        pathname === item.href
                          ? 'text-accent'
                          : 'text-white transition-colors hover:text-accent'
                      }
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
