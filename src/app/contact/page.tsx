'use client';

import { useEffect, useRef } from 'react';
import { 
  Phone, Mail, MapPin, Clock
} from 'lucide-react';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactPage() {
  const { siteSettings } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render organic sound wave flowing animation on canvas for premium visual effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 360;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;
      
      const waves = [
        { color: 'rgba(212, 175, 55, 0.15)', amp: 55, freq: 0.003, speed: 0.04 },
        { color: 'rgba(245, 158, 11, 0.12)', amp: 45, freq: 0.005, speed: 0.03 },
        { color: 'rgba(249, 115, 22, 0.10)', amp: 35, freq: 0.004, speed: 0.05 }
      ];

      waves.forEach((w) => {
        ctx.strokeStyle = w.color;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * w.freq + phase) * w.amp * Math.sin(x / 400);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });

      phase += 0.02;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 select-none pb-20">
        
        {/* HERO BANNER SECTION */}
        <section className="relative h-[250px] md:h-[350px] pt-16 flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-amber-955/20 via-zinc-950 to-zinc-950">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

          {/* Titles */}
          <div className="relative z-10 text-center space-y-4 px-6">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider leading-none"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              <span className="text-white mr-3">CONTACT</span>
              <span className="text-amber-500 hero-heading pb-1">
                US
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-semibold tracking-[0.2em] uppercase">
              Ready to make your event stage unforgettable?
            </p>
          </div>
        </section>

        {/* INFORMATION CARDS & MAP CONTAINER */}
        <section className="max-w-7xl mx-auto px-6 pt-6 pb-12 space-y-12">
          
          {/* CONTACT INFO CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* CARD 1: PHONE */}
            <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl shadow-lg flex flex-col justify-between hover:border-amber-500/30 hover:bg-white/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Call Us</h4>
                  <a href={`tel:+91${siteSettings.phone_1}`} className="text-lg font-bold text-white hover:text-amber-500 block transition-colors">
                    +91 {siteSettings.phone_1}
                  </a>
                  <a href={`tel:+91${siteSettings.phone_2}`} className="text-sm font-semibold text-zinc-500 hover:text-white block mt-1 transition-colors">
                    +91 {siteSettings.phone_2}
                  </a>
                </div>
              </div>
            </div>

            {/* CARD 2: INSTAGRAM */}
            <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl shadow-lg flex flex-col justify-between hover:border-amber-500/30 hover:bg-white/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Instagram</h4>
                  <a 
                    href="https://www.instagram.com/parthproduction" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-bold text-white hover:text-amber-500 block transition-colors"
                  >
                    parthproduction
                  </a>
                </div>
              </div>
            </div>

            {/* CARD 3: EMAIL */}
            <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl shadow-lg flex flex-col justify-between hover:border-amber-500/30 hover:bg-white/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Email Enquiries</h4>
                  <a href={`mailto:${siteSettings.email}`} className="text-[13px] sm:text-sm font-bold text-white hover:text-amber-500 block break-all transition-colors">
                    {siteSettings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* CARD 4: LOCATION */}
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings.address || '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl shadow-lg flex flex-col justify-between hover:border-amber-500/30 hover:bg-white/3 transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Corporate HQ</h4>
                  <p className="text-sm font-bold text-white leading-normal hover:text-amber-500 transition-colors">{siteSettings.address || 'Gaurav Path Road, Palanpur, Surat, Gujarat'}</p>
                  <p className="text-zinc-500 text-xs font-semibold mt-1">Service Area: All India</p>
                </div>
              </div>
            </a>

          </div>

          {/* FULL-WIDTH EMBEDDED MAP */}
          <div className="w-full relative rounded-3xl overflow-hidden border-2 border-amber-500/20 shadow-2xl">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Parth Production, Gaurav Path Road, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px] md:h-[400px] grayscale opacity-90"
            />
          </div>

        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
