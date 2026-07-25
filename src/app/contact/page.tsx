'use client';

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

      <main className="relative min-h-screen bg-black text-white pt-20 pb-20">
        <section className="relative px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">Contact</p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] max-w-3xl">
            Commission a stage
          </h1>
          <p className="mt-6 text-white/55 text-base max-w-lg leading-relaxed">
            Share your date, venue, and scale — we will outline sound, light, and staging options.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-8 px-7 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase hover:bg-accent/90 transition-colors"
          >
            WhatsApp us
          </a>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-[0.16em] text-white/40">Phone</h4>
            <a href={`tel:+91${siteSettings.phone_1}`} className="font-display text-2xl text-white hover:text-accent block transition-colors">
              +91 {siteSettings.phone_1}
            </a>
            <a href={`tel:+91${siteSettings.phone_2}`} className="text-sm text-white/50 hover:text-accent block transition-colors">
              +91 {siteSettings.phone_2}
            </a>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-[0.16em] text-white/40">Digital</h4>
            <a
              href="https://www.instagram.com/parthproduction"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-2xl text-white hover:text-accent block transition-colors"
            >
              @parthproduction
            </a>
            <a href={`mailto:${siteSettings.email}`} className="text-sm text-white/50 hover:text-accent block transition-colors break-all">
              {siteSettings.email}
            </a>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-[0.16em] text-white/40">Studio</h4>
            <p className="font-display text-xl text-white leading-snug">
              {siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="relative overflow-hidden border border-white/10 bg-[#0c0c0d]">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Parth Production, Gaurav Path Road, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full grayscale invert opacity-50 contrast-125 hover:opacity-75 transition-opacity duration-500"
              title="Parth Production location"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
