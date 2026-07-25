'use client';

import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { siteSettings } = useAuth();

  return (
    <>
      <SpotlightNavbar />
      <div className="film-grain" />

      <div className="relative min-h-screen bg-black text-white select-none pb-20 pt-20">
        
        {/* HERO HEADER */}
        <section className="relative px-8 py-20 max-w-7xl mx-auto w-full">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Communications Gateway</span>
            <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-white leading-none">
              COMMISSION A <br />
              <span className="text-accent drop-shadow-[0_0_15px_rgba(255,215,0,0.15)]">SOUNDSTAGE</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Initiate custom setups, frequency planning, or truss rigging specifications for your venue.
            </p>
          </div>
        </section>

        {/* DETAILS GRID (No card containers - pure layouts) */}
        <section className="max-w-7xl mx-auto px-8 py-12 border-t border-gray-800/40 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="space-y-6">
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 01</span>
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Telephony</h4>
              <a href={`tel:+91${siteSettings.phone_1}`} className="text-2xl font-bold text-white hover:text-accent block transition-colors">
                +91 {siteSettings.phone_1}
              </a>
              <a href={`tel:+91${siteSettings.phone_2}`} className="text-sm text-gray-450 hover:text-accent block transition-colors">
                +91 {siteSettings.phone_2}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 02</span>
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Digital Channels</h4>
              <a 
                href="https://www.instagram.com/parthproduction" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-2xl font-bold text-white hover:text-accent block transition-colors"
              >
                @parthproduction
              </a>
              <a href={`mailto:${siteSettings.email}`} className="text-sm text-gray-450 hover:text-accent block transition-colors break-all">
                {siteSettings.email}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 03</span>
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Corporate HQ</h4>
              <p className="text-xl font-bold text-white leading-tight">
                {siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}
              </p>
              <span className="inline-block text-[9px] font-bold text-accent uppercase tracking-widest pt-2">
                Nationwide Deployments
              </span>
            </div>
          </div>

        </section>

        {/* MAP SECTION */}
        <section className="max-w-7xl mx-auto px-8 py-12">
          <div className="relative rounded-3xl overflow-hidden border border-gray-800 bg-[#0c0c0d] shadow-2xl">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Parth Production, Gaurav Path Road, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full grayscale invert opacity-50 contrast-125 hover:opacity-75 transition-opacity duration-500"
            />
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
