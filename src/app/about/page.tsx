'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import FlipText from '@/components/FlipText';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const milestones = [
  { year: '2014', event: 'Company Founded', description: 'Started with a vision and 2 sound setups in Gujarat.' },
  { year: '2016', event: '100 Events Completed', description: 'First major milestone delivering wedding sound setups.' },
  { year: '2018', event: 'Team Expansion', description: 'Grew to 20+ professionals and introduced laser programming.' },
  { year: '2020', event: '500+ Events', description: 'Became an industry leader for concert light structures.' },
  { year: 'PRESENT', event: '1000+ Events', description: 'Continuing excellence with massive silent generators and full setups.' }
];

const teamMembers = [
  { name: 'ROHAN', role: 'Managing Director', bio: 'Directing creative operations, production strategies, and high-end light & sound installations.', src: '/images/WhatsApp-Image-2026-01-10-at-8.52.25-PM-3_vohntj.png' },
  { name: 'DISHANT', role: 'Managing Director', bio: 'Overseeing event execution, client coordination, and technical system setups.', src: '/images/WhatsApp-Image-2026-01-10-at-8.52.25-PM-2_ug0sl5.png' },
];

export default function AboutPage() {
  const crewSliderRef = useRef<HTMLDivElement>(null);

  // Autoplay relative scroll for Crew Slider on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    const slider = crewSliderRef.current;
    if (!slider) return;
    const interval = setInterval(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = slider.children[0]?.clientWidth || 300;
        slider.scrollTo({
          left: slider.scrollLeft + cardWidth + 32,
          behavior: 'smooth'
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 select-none pb-20">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-amber-950/10 via-zinc-950 to-zinc-950 pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Col: Titles & Heading */}
            <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider leading-tight"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                <span className="text-white block mb-2">ABOUT</span>
                <span className="text-amber-500 hero-heading block pb-1">
                  PARTH PRODUCTION
                </span>
              </h1>
              <p className="text-sm md:text-md text-zinc-400 font-semibold tracking-wider max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                10+ years of creating unforgettable experiences. Gujarat&apos;s leading production agency supplying high-end audio setups, truss structures, and silent generator fleets.
              </p>
            </div>

            {/* Right Col: Graphic Showcase Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-amber-500/20 bg-[#121214] shadow-2xl"
            >
              <Image 
                src="/images/Untitled-design-13.png" 
                alt="Parth Production Stage Setup" 
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* STORY & TIMELINE SECTION */}
        <section className="py-10 md:py-16 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Counters & Vision */}
          <div className="space-y-8">
            <h3 
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              OUR VISION & VALUES
            </h3>
            <p className="text-zinc-450 text-xs sm:text-sm leading-relaxed font-semibold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              Parth Production was built on a simple philosophy: events are temporary, but atmospheric memories last forever. We combine safety engineering with premium visuals and sound dynamics to ensure every Dandiya, concert, and wedding reception is flawless.
            </p>

            {/* Values stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
              <div className="text-center p-4 bg-[#121214]/60 border border-amber-500/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <Image 
                  src="/images/spotlight_aetwmd.png" 
                  alt="Light Icon" 
                  width={56}
                  height={56}
                  className="object-contain filter invert brightness-200"
                />
                <div className="text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>Light</div>
              </div>
              <div className="text-center p-4 bg-[#121214]/60 border border-amber-500/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <Image 
                  src="/images/wave-sound_ux5uhf.png" 
                  alt="Sound Icon" 
                  width={56}
                  height={56}
                  className="object-contain filter invert brightness-200"
                />
                <div className="text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>Sounds</div>
              </div>
              <div className="text-center p-4 bg-[#121214]/60 border border-amber-500/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <Image 
                  src="/images/sound-control_cv7kzt.png" 
                  alt="Quality Icon" 
                  width={56}
                  height={56}
                  className="object-contain filter invert brightness-200"
                />
                <div className="text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>Quality</div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="space-y-6">
            <h3 
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-8"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              OUR JOURNEY
            </h3>

            <div className="relative border-l border-amber-500/20 pl-6 space-y-8">
              {milestones.map((mil, idx) => (
                <motion.div 
                  key={mil.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Glowing Node dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#09090b] border-2 border-amber-500 group-hover:bg-amber-500 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  
                  <div className="space-y-1">
                    <span 
                      className="text-lg font-black text-amber-500 font-sans"
                      style={{ textShadow: '0 0 15px rgba(245,158,11,0.3)' }}
                    >
                      {mil.year}
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                      {mil.event}
                    </h4>
                    <p className="text-xs text-zinc-550 leading-relaxed font-semibold max-w-md" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {mil.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM CREW SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-widest text-white leading-tight"
              style={{ fontFamily: 'var(--font-syne), sans-serif' }}
            >
              THE CREW
            </h2>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest leading-relaxed">
              Strong management behind every perfectly executed event
            </p>
          </div>

          <div className="relative max-w-2xl md:max-w-5xl mx-auto overflow-hidden md:overflow-visible">
            <div 
              ref={crewSliderRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:grid md:grid-cols-2 md:gap-12 md:overflow-x-visible md:pb-0"
            >
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[80vw] sm:min-w-[280px] md:min-w-0 snap-center flex-shrink-0 group relative rounded-3xl overflow-hidden bg-zinc-900/40 border border-white/5 w-full md:flex-shrink"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image 
                    src={member.src} 
                    alt={member.name} 
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 768px) 280px, 300px"
                    className="object-cover object-top filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Social tray */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <a href="https://instagram.com/parthproduction" className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a href="https://youtube.com" className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h4 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                    {member.name}
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                    {member.role}
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-semibold pt-2 border-t border-white/5" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {member.bio}
                  </p>
                </div>
              </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
