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

      <div className="relative min-h-screen bg-[#12100E] text-[#E7E3DC] select-none pb-20 pt-16 md:pt-20">
        
        {/* HERO BANNER */}
        <section className="relative min-h-[30vh] border-b border-[#E7E3DC]/10 px-6 md:px-12 py-12 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <span className="font-mono text-[10px] tracking-widest text-[#C87A53] uppercase">// Communication Gateway</span>
            <h1 
              className="text-5xl md:text-7xl tracking-tight leading-none text-[#E7E3DC]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              COMMISSION AN <br />
              <span className="italic font-light">Installation</span>
            </h1>
            <p className="font-mono text-xs text-[#A39E93] leading-relaxed max-w-lg">
              Get in touch to specify structural blueprints, power metrics, or audio setups for your upcoming event.
            </p>
          </div>
        </section>

        {/* SWISS STRUCTURAL GRID CHANNELS */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Direct Lines */}
            <div className="border border-[#E7E3DC]/10 p-6 rounded-sm bg-[#1A1816]/30 flex flex-col justify-between hover:border-[#E7E3DC]/30 transition-all duration-300">
              <div className="space-y-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">// Channel 01</span>
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-[#E7E3DC] uppercase tracking-widest mb-3">Direct Lines</h4>
                  <a href={`tel:+91${siteSettings.phone_1}`} className="text-md sm:text-lg font-bold text-[#E7E3DC] hover:text-[#C87A53] block transition-colors font-mono">
                    +91 {siteSettings.phone_1}
                  </a>
                  <a href={`tel:+91${siteSettings.phone_2}`} className="text-xs text-[#A39E93] hover:text-[#C87A53] block mt-1 transition-colors font-mono">
                    +91 {siteSettings.phone_2}
                  </a>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="border border-[#E7E3DC]/10 p-6 rounded-sm bg-[#1A1816]/30 flex flex-col justify-between hover:border-[#E7E3DC]/30 transition-all duration-300">
              <div className="space-y-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">// Channel 02</span>
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-[#E7E3DC] uppercase tracking-widest mb-3">Instagram</h4>
                  <a 
                    href="https://www.instagram.com/parthproduction" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-md sm:text-lg font-bold text-[#E7E3DC] hover:text-[#C87A53] block transition-colors font-mono"
                  >
                    parthproduction
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="border border-[#E7E3DC]/10 p-6 rounded-sm bg-[#1A1816]/30 flex flex-col justify-between hover:border-[#E7E3DC]/30 transition-all duration-300">
              <div className="space-y-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">// Channel 03</span>
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-[#E7E3DC] uppercase tracking-widest mb-3">Email Enquiries</h4>
                  <a href={`mailto:${siteSettings.email}`} className="text-xs sm:text-sm font-bold text-[#E7E3DC] hover:text-[#C87A53] block break-all transition-colors font-mono">
                    {siteSettings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* HQ Location */}
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings.address || '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border border-[#E7E3DC]/10 p-6 rounded-sm bg-[#1A1816]/30 flex flex-col justify-between hover:border-[#E7E3DC]/30 transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">// Channel 04</span>
                <div>
                  <h4 className="font-mono text-[10px] font-bold text-[#E7E3DC] uppercase tracking-widest mb-3">Corporate HQ</h4>
                  <p className="text-xs font-bold text-[#E7E3DC] leading-normal font-mono">{siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}</p>
                  <p className="text-[#A39E93] text-[9px] uppercase tracking-widest mt-2 font-mono">Service Area: All India</p>
                </div>
              </div>
            </a>

          </div>

          {/* GOOGLE MAP WRAPPER */}
          <div className="w-full relative rounded-sm overflow-hidden border border-[#E7E3DC]/10 shadow-2xl">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Parth Production, Gaurav Path Road, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px] md:h-[400px] grayscale contrast-125 opacity-70"
            />
          </div>

        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
