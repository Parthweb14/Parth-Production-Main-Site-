'use client';

import { useState } from 'react';
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

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3.5 text-left md:hidden"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-display text-base text-white">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/55 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      <h4 className="mb-3 hidden font-display text-base text-white md:block">{title}</h4>
      <div
        className={`${
          open ? 'flex pb-3.5' : 'hidden'
        } flex-col gap-2.5 text-sm text-white/55 md:flex md:gap-3 md:pb-0`}
      >
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

  return (
    <footer className="relative z-20 border-t border-white/10 bg-black px-6 pb-10 pt-12 md:px-10 md:pt-16">
      <div className="relative mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-4 md:mb-12 md:grid-cols-3 md:gap-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src={LOGO_PNG} alt="Parth Production" className="h-11 object-contain" />
            <span className="font-display text-xl tracking-tight">Parth Production</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50 md:mt-4">
            One stop solution for sound, light, SFX, truss, fireworks, and DJ artistry.
          </p>
        </div>

        <FooterAccordion title="Explore">
          <Link href="/services" className="transition-colors hover:text-accent">
            Services
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-accent">
            Gallery
          </Link>
          <Link href="/about" className="transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-accent">
            Contact
          </Link>
        </FooterAccordion>

        <FooterAccordion title="Connect">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            WhatsApp {whatsapp}
          </a>
          <a href={callUrl} className="transition-colors hover:text-accent">
            Call {call}
          </a>
          <a
            href={`mailto:${siteSettings.email}`}
            className="break-all transition-colors hover:text-accent"
          >
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
