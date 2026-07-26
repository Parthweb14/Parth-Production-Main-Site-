'use client';

import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />
      <main className="relative overflow-x-hidden bg-black">
        <PageHero
          title="Tell us the date"
          description="Share venue, guest count, and vibe — sound, light, SFX, truss, fireworks, DJ. One crew."
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10">
          {[
            {
              label: 'Phone',
              body: (
                <>
                  <a
                    href={`tel:+91${siteSettings.phone_1}`}
                    className="text-xl md:text-2xl font-semibold text-white hover:text-accent block transition-colors"
                  >
                    +91 {siteSettings.phone_1}
                  </a>
                  <a
                    href={`tel:+91${siteSettings.phone_2}`}
                    className="text-sm text-white/55 hover:text-accent block mt-2 transition-colors"
                  >
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
                    className="text-xl md:text-2xl font-semibold text-white hover:text-accent block transition-colors"
                  >
                    @parthproduction
                  </a>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-sm text-white/55 hover:text-accent block mt-2 break-all transition-colors"
                  >
                    {siteSettings.email}
                  </a>
                </>
              ),
            },
            {
              label: 'Studio',
              body: (
                <p className="text-base md:text-lg leading-relaxed text-white/80">
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
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 font-semibold mb-3">
                {block.label}
              </p>
              {block.body}
            </motion.div>
          ))}
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden border border-white/10 rounded-2xl"
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

          <div className="flex justify-center mt-8 md:mt-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex min-h-[44px]"
            >
              WhatsApp Parth Production
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
