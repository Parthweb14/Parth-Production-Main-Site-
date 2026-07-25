'use client';

import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

const capabilities = [
  {
    tags: ['Acoustics', 'Decibel SPL'],
    title: 'Acoustic Engineering',
    description: 'We orchestrate point-source array speaker rigs tuned for complex outdoor venues, delivering pristine clarity across all sound waves.',
    isActive: true
  },
  {
    tags: ['Lasers', 'Daylight LED'],
    title: 'Visual Direction',
    description: 'High-intensity visual beams, strobe installations, and daylight LED screens running redundant fiber loop controllers.',
    isActive: false
  },
  {
    tags: ['Generators', '500kVA'],
    title: 'Continuous Power',
    description: 'Synchronized diesel generator nodes running parallel backups with automatic failovers to prevent staging interruptions.',
    isActive: false
  }
];

export default function AboutPage() {
  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-20 select-none pt-20">
        
        {/* HERO HEADER */}
        <section className="relative px-8 py-20 max-w-7xl mx-auto w-full">
          <div className="space-y-4 max-w-3xl">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Creative Collective</span>
            <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-white leading-none">
              ENGINEERING VISCERAL <br />
              <span className="text-accent drop-shadow-[0_0_15px_rgba(255,215,0,0.15)]">ATMOSPHERES</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              We operate at the intersection of technical engineering and visual dynamics, designing custom staging rigs and acoustic fields across India.
            </p>
          </div>
        </section>

        {/* HORIZONTAL CAPABILITIES SHOWCASE (Matches Tennis Card Layout visual specs) */}
        <section className="px-8 py-12 max-w-7xl mx-auto w-full border-t border-gray-800/40">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Capabilities log</span>
            <h2 className="text-3xl font-bold text-white uppercase">Operational Decks</h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory">
            {capabilities.map((cap, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`w-[280px] sm:w-[340px] flex-shrink-0 snap-start rounded-[2rem] border p-6 flex flex-col justify-between shadow-xl transition-all duration-300 ${
                  cap.isActive 
                    ? 'bg-accent text-black border-accent' 
                    : 'bg-secondary/20 text-white border-gray-800'
                }`}
              >
                <div className="space-y-6">
                  <div className="flex gap-2">
                    {cap.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className={`px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${
                          cap.isActive ? 'border-black/30 text-neutral-800' : 'border-gray-800 text-gray-450'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase">
                    {cap.title}
                  </h3>
                  <p className={`text-xs leading-relaxed font-medium ${
                    cap.isActive ? 'text-neutral-900' : 'text-gray-450'
                  }`}>
                    {cap.description}
                  </p>
                </div>

                <div className={`mt-8 pt-4 border-t text-[10px] uppercase font-bold tracking-widest flex justify-between items-center ${
                  cap.isActive ? 'border-black/15 text-black' : 'border-gray-850 text-accent'
                }`}>
                  <span>Specifications File</span>
                  <span>→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM PORTRAIT SHOWCASE */}
        <section className="py-16 max-w-7xl mx-auto px-6 border-t border-gray-800/40">
          <div className="max-w-2xl mb-16">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Officers</span>
            <h2 className="text-3xl font-bold text-white uppercase">Corporate Directors</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="border border-gray-800 p-6 bg-secondary/15 rounded-2xl flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-gray-800 flex-shrink-0 bg-black">
                <img 
                  src="https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/WhatsApp-Image-2026-01-10-at-8.52.25-PM-3_vohntj.png" 
                  alt="Rohan" 
                  className="w-full h-full object-cover grayscale brightness-[0.8]"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">Rohan // Managing Director</span>
                <h4 className="text-xl font-bold text-white">ROHAN</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  Managing creative sound matrices and staging rigs setup operations.
                </p>
              </div>
            </div>

            <div className="border border-gray-800 p-6 bg-secondary/15 rounded-2xl flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-gray-800 flex-shrink-0 bg-black">
                <img 
                  src="https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/WhatsApp-Image-2026-01-10-at-8.52.25-PM-2_ug0sl5.png" 
                  alt="Dishant" 
                  className="w-full h-full object-cover grayscale brightness-[0.8]"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">Dishant // Operations Lead</span>
                <h4 className="text-xl font-bold text-white">DISHANT</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  Directing logistics coordinates and on-site structures safety alignments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
