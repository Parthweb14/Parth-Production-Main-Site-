'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Zap, Home, Image, Users, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/', icon: Home },
  { label: 'SERVICES', href: '/services', icon: Zap },
  { label: 'GALLERY', href: '/gallery', icon: Image },
  { label: 'ABOUT', href: '/about', icon: Users },
  { label: 'CONTACT', href: '/contact', icon: Mail },
];

export default function SpotlightNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const navbarRef = useRef<HTMLDivElement>(null);
  
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div 
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-transparent border-none z-50 px-6 md:px-12 flex items-center justify-center transition-all duration-300"
      >
        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-12 relative z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className="relative px-3 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-zinc-400 hover:text-white transition-all cursor-pointer group"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Gold Glow underline animation */}
                {isActive ? (
                  <motion.div 
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-500"
                  />
                ) : (
                  <div className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-amber-500/50 group-hover:left-0 group-hover:right-0 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger menu */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl bg-white/3 border border-white/5 text-zinc-400 hover:text-white cursor-pointer absolute right-6 z-50"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-0 bg-[#09090b]/98 backdrop-blur-3xl z-40 md:hidden flex flex-col justify-center px-8"
          >
            <div className="space-y-8 flex flex-col">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 text-2xl font-black tracking-widest uppercase cursor-pointer ${
                        isActive ? 'text-white font-bold' : 'text-zinc-500 hover:text-white'
                      }`}
                      style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-amber-500' : 'text-zinc-600'}`} />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.08 }}
                className="pt-6 border-t border-white/5"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-4 bg-[#d4af37] hover:bg-[#b8901c] text-black rounded-2xl text-md font-bold tracking-widest uppercase cursor-pointer active:scale-98 transition-all flex items-center justify-center"
                  style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                  BOOK NOW
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
