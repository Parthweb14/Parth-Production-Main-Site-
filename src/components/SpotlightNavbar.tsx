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
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 h-[88px] md:h-[96px] border-b border-white/10 bg-[#0A0E27]/75 backdrop-blur-xl">
        <Link href="/" className="relative z-10 flex items-center min-w-0 group py-1" onClick={() => setMenuOpen(false)}>
          <span className="relative block h-[56px] sm:h-[64px] md:h-[72px] w-[150px] sm:w-[190px] md:w-[230px] overflow-hidden">
            <img
              src={LOGO_PNG}
              alt="Parth Production"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[150%] w-auto max-w-none object-cover object-left transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </span>
        </Link>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors ${
                  active ? 'text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
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
            className="btn-primary !py-2.5 !px-4 text-[11px] hidden md:inline-flex"
          >
            Book now
          </a>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-white/10 bg-white/5"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-0 bg-[#0A0E27] z-40 md:hidden flex flex-col pt-28 px-6 pb-10"
          >
            <div className="pointer-events-none absolute inset-0 site-grid opacity-30" />
            <nav className="relative flex flex-col gap-5 text-3xl font-display font-semibold">
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
                    className={pathname === item.href ? 'text-cyan-300' : 'text-white'}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-auto w-full min-h-[44px] relative"
            >
              Book now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
