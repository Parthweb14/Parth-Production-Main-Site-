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
        
        {/* Left Side: Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-bold tracking-widest text-white font-sans uppercase hover:text-accent transition-colors mr-4">
            HOME
          </Link>
          
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
        </div>

        {/* Right Side: Larger Logo & Mobile Menu Trigger */}
        <div className="flex items-center gap-6">
          {/* Bigger Logo in Top Right Corner */}
          <Link href="/" className="cursor-pointer">
            <img 
              src="https://assets.parthproduction.in/Parth%20logo%20bg%20.png" 
              alt="Parth Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </Link>

          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center p-2 text-white cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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
