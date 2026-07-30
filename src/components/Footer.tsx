'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LOGO_PNG } from '@/utils/media';

function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="md:contents">
      {/* ===== MOBILE DROPDOWN (max-md only) ===== */}
      <div className="mb-2 overflow-hidden rounded-2xl border border-white/20 bg-[#0a0a0a] md:hidden">
        <button
          type="button"
          id={`${panelId}-btn`}
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left touch-manipulation"
        >
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.08em] text-white">
            {title}
          </span>
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open
                ? 'rotate-180 border-[#3A8FB8] bg-[#3A8FB8]/15 text-[#3A8FB8]'
                : 'border-white/30 bg-white/5 text-white'
            }`}
            aria-hidden
          >
            <ChevronDown className="h-5 w-5" strokeWidth={2.25} />
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={`${panelId}-btn`}
          hidden={!open}
          className={open ? 'block border-t border-white/15' : 'hidden'}
        >
          <div className="flex flex-col gap-1 px-2 py-2 text-sm text-white/70">{children}</div>
        </div>
      </div>

      {/* ===== DESKTOP COLUMN ===== */}
      <div className="hidden flex-col gap-3 text-sm text-white/55 md:flex">
        <h4 className="font-display text-base text-white">{title}</h4>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { siteSettings } = useAuth();
  const whatsapp = (siteSettings.phone_1 || '').replace(/\D/g, '');
  const call = (siteSettings.phone_2 || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/91${whatsapp}`;
  const callUrl = `tel:+91${call}`;

  const linkClass =
    'rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5 hover:text-accent md:rounded-none md:px-0 md:py-0';

  return (
    <footer className="relative z-20 border-t border-white/10 bg-black px-6 pb-10 pt-12 md:px-10 md:pt-16">
      <div className="relative mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-3 md:mb-12 md:grid-cols-3 md:gap-10">
        <div className="mb-2 md:mb-0">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src={LOGO_PNG} alt="Parth Production" className="h-11 object-contain" />
            <span className="font-display text-xl tracking-tight">Parth Production</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50 md:mt-4">
            One stop solution for sound, light, SFX, truss, fireworks, and DJ artistry.
          </p>
        </div>

        <FooterAccordion title="Explore">
          <Link href="/services" className={linkClass}>
            Services
          </Link>
          <Link href="/gallery" className={linkClass}>
            Gallery
          </Link>
          <Link href="/about" className={linkClass}>
            About
          </Link>
          <Link href="/contact" className={linkClass}>
            Contact
          </Link>
        </FooterAccordion>

        <FooterAccordion title="Connect">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            WhatsApp {whatsapp}
          </a>
          <a href={callUrl} className={linkClass}>
            Call {call}
          </a>
          <a href={`mailto:${siteSettings.email}`} className={`${linkClass} break-all`}>
            {siteSettings.email}
          </a>
        </FooterAccordion>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-wide text-white/35 sm:flex-row"
      >
        <span>© {year} Parth Production</span>
        <span>{siteSettings.address}</span>
      </motion.div>
      <p className="mx-auto mt-4 max-w-7xl text-center text-[11px] tracking-[0.08em] text-white/35 normal-case">
        Designed by{' '}
        <a
          href="https://trishulhub.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/55 underline underline-offset-2 transition-colors hover:text-[#3A8FB8]"
        >
          Trishulhub
        </a>
      </p>
    </footer>
  );
}
