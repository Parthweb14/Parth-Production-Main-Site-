'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="relative z-20 bg-[#111111] pt-16 pb-12 px-8 border-t border-neutral-900 select-none font-sans"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        
        {/* Column 1: Brand / Logo */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-block">
            <img 
              src="https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Parth%20logo%20bg%20.png" 
              alt="Parth Logo" 
              className="h-10 object-contain mb-2"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-semibold tracking-wider text-neutral-400 hover:text-white transition-colors uppercase"
          >
            Leam Collective
          </a>
          <p className="text-[11px] text-neutral-500 font-normal">
            © {currentYear} Parth Production. <br /> All Rights Reserved.
          </p>
        </div>

        {/* Column 2: Terms & Privacy */}
        <div className="flex flex-col gap-3 text-xs text-neutral-400">
          <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">Legal</h4>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>

        {/* Column 3: Governance & Social */}
        <div className="flex flex-col gap-3 text-xs text-neutral-400">
          <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">Community</h4>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Governance
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Twitter
          </a>
        </div>

        {/* Column 4: Support & FAQ */}
        <div className="flex flex-col gap-3 text-xs text-neutral-400">
          <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">Enquiries</h4>
          <Link href="/contact" className="hover:text-white transition-colors">
            Support
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
        </div>

      </div>

      {/* Bottom info */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-center text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
        <p>engineered for live ecosystems</p>
        <p>
          Studio — <a href="https://www.trishulhub.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-bold">Trishulhub</a>
        </p>
      </div>
    </motion.footer>
  );
}
