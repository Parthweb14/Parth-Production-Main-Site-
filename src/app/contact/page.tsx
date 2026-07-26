'use client';

import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="pt-20">
        <section className="relative px-6 md:px-10 py-16 md:py-24 border-b border-white/10 overflow-hidden">
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-accent/15 blur-3xl"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="max-w-7xl mx-auto relative">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[0.22em] text-accent mb-4">
              Contact
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl leading-[0.95]"
            >
              Tell us the date.
              <br />
              We’ll build the night.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-white/60 max-w-xl text-base md:text-lg"
            >
              Share venue, guest count, and vibe — sound, light, SFX, truss, fireworks, DJ. One crew.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-9 px-8 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase hover:bg-accent/90"
            >
              WhatsApp Parth Production
            </motion.a>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10">
          {[
            {
              label: 'Phone',
              body: (
                <>
                  <a href={`tel:+91${siteSettings.phone_1}`} className="font-display text-2xl hover:text-accent block">
                    +91 {siteSettings.phone_1}
                  </a>
                  <a href={`tel:+91${siteSettings.phone_2}`} className="text-sm text-white/50 hover:text-accent block mt-1">
                    +91 {siteSettings.phone_2}
                  </a>
                </>
              ),
            },
            {
              label: 'Digital',
              body: (
                <>
                  <a
                    href="https://www.instagram.com/parthproduction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-2xl hover:text-accent block"
                  >
                    @parthproduction
                  </a>
                  <a href={`mailto:${siteSettings.email}`} className="text-sm text-white/50 hover:text-accent block mt-1 break-all">
                    {siteSettings.email}
                  </a>
                </>
              ),
            },
            {
              label: 'Studio',
              body: (
                <p className="font-display text-xl leading-snug">
                  {siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}
                </p>
              ),
            },
          ].map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">{block.label}</p>
              {block.body}
            </motion.div>
          ))}
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden border border-white/10"
          >
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Parth Production, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Parth Production location"
              className="w-full grayscale invert opacity-55 contrast-125 hover:opacity-80 transition-opacity duration-500"
            />
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
