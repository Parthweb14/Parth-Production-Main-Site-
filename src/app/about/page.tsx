'use client';

import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const capabilities = [
  {
    title: 'Acoustic Engineering',
    description: 'Point-source and line-array speaker systems tuned for outdoor venues, with clear vocal presence and controlled low end.',
  },
  {
    title: 'Visual Direction',
    description: 'Moving lights, lasers, and daylight LED walls with redundant signal paths for keynotes, concerts, and ceremonies.',
  },
  {
    title: 'Stage & Power',
    description: 'Truss, staging, and generator grids planned for load, safety, and uninterrupted show time.',
  },
];

export default function AboutPage() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <main className="relative min-h-screen bg-black text-white pt-20">
        <section className="relative px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">About</p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] max-w-4xl">
            Parth Production
          </h1>
          <p className="mt-6 text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            We design and run live production systems — sound, light, and stage — for weddings, festivals, and corporate shows across India.
          </p>
        </section>

        <section className="border-t border-white/10 px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-12">What we engineer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {capabilities.map((cap, idx) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <h3 className="font-display text-2xl tracking-tight mb-3">{cap.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{cap.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="font-display text-2xl md:text-3xl tracking-tight max-w-xl">
              Based in Surat. Built for stages that need to feel intentional.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-accent text-black text-sm font-semibold tracking-wide uppercase"
            >
              Start a project
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
