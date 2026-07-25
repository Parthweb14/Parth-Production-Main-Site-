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
        
        {/* HERO BANNER */}
        <section className="relative min-h-[30vh] border-b border-gray-800/40 px-6 md:px-12 py-12 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Connect with us</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">
              COMMISSION AN <br />
              <span className="text-accent drop-shadow-[0_0_15px_rgba(255,215,0,0.15)]">INSTALLATION</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              Get in touch to specify audio routing, truss design configurations, or electrical loads.
            </p>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Direct Lines */}
            <div className="border border-gray-800 p-6 rounded-2xl bg-secondary/10 flex flex-col justify-between hover:border-gray-700 transition-all duration-300">
              <div className="space-y-6">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 01</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Direct Lines</h4>
                  <a href={`tel:+91${siteSettings.phone_1}`} className="text-md sm:text-lg font-bold text-white hover:text-accent block transition-colors font-sans">
                    +91 {siteSettings.phone_1}
                  </a>
                  <a href={`tel:+91${siteSettings.phone_2}`} className="text-xs text-gray-400 hover:text-accent block mt-2 transition-colors font-sans">
                    +91 {siteSettings.phone_2}
                  </a>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="border border-gray-800 p-6 rounded-2xl bg-secondary/10 flex flex-col justify-between hover:border-gray-700 transition-all duration-300">
              <div className="space-y-6">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 02</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Instagram</h4>
                  <a 
                    href="https://www.instagram.com/parthproduction" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-md sm:text-lg font-bold text-white hover:text-accent block transition-colors font-sans"
                  >
                    parthproduction
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="border border-gray-800 p-6 rounded-2xl bg-secondary/10 flex flex-col justify-between hover:border-gray-700 transition-all duration-300">
              <div className="space-y-6">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 03</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Email Enquiries</h4>
                  <a href={`mailto:${siteSettings.email}`} className="text-xs sm:text-sm font-bold text-white hover:text-accent block break-all transition-colors font-sans">
                    {siteSettings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings.address || '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border border-gray-800 p-6 rounded-2xl bg-secondary/10 flex flex-col justify-between hover:border-gray-700 transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-6">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">// Line 04</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Corporate HQ</h4>
                  <p className="text-xs font-bold text-white leading-normal font-sans">{siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}</p>
                  <p className="text-gray-500 text-[9px] uppercase tracking-widest mt-3 font-semibold">Service Area: All India</p>
                </div>
              </div>
            </a>

          </div>

          {/* MAP */}
          <div className="w-full relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Parth Production, Gaurav Path Road, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px] md:h-[400px] grayscale invert contrast-200 opacity-60"
            />
          </div>

        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
