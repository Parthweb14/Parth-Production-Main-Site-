'use client';

import { motion } from 'framer-motion';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const milestones = [
  { year: '2014', event: 'FOUNDATION DEPLOYED', description: 'Established initial technical sound assets in Gujarat with modular setups.' },
  { year: '2016', event: 'SYSTEM EXPANSION', description: 'Reached 100+ events and built custom staging truss inventory.' },
  { year: '2018', event: 'HIGH-END RIGGINGS', description: 'Commissioned laser control desks and line array frameworks.' },
  { year: '2020', event: 'ARENA LEADERSHIP', description: 'Managed logistics for major stadium concerts and events.' },
  { year: 'PRESENT', event: 'NATIONWIDE DELIVERY', description: 'Executing signature events across India with silent generator fleets.' }
];

const teamMembers = [
  { name: 'ROHAN', role: 'Managing Director / Production Lead', bio: 'Directing creative setups, line array acoustic design, and visual installation matrices.', src: '/images/WhatsApp-Image-2026-01-10-at-8.52.25-PM-3_vohntj.png' },
  { name: 'DISHANT', role: 'Managing Director / Operations Lead', bio: 'Overseeing structural safety coordination, logistics transit, and client event execution.', src: '/images/WhatsApp-Image-2026-01-10-at-8.52.25-PM-2_ug0sl5.png' },
];

export default function AboutPage() {
  return (
    <>
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-[#12100E] text-[#E7E3DC] overflow-hidden pb-20 select-none">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[50vh] flex items-center border-b border-[#E7E3DC]/10 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Headers */}
            <div className="space-y-6 flex flex-col items-start">
              <span className="font-mono text-[10px] tracking-widest text-[#C87A53] uppercase">// Architectural Profile</span>
              <h1 
                className="text-5xl sm:text-6xl tracking-tight leading-none text-[#E7E3DC]"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                ABOUT THE <br />
                <span className="italic font-light">Production House</span>
              </h1>
              <p className="font-mono text-xs text-[#A39E93] leading-relaxed max-w-lg">
                For over a decade, we have designed responsive acoustic landscapes and staging grids. We operate at the intersection of structural engineering and visceral sound design.
              </p>
            </div>

            {/* Right Side: Showcase image */}
            <div className="relative aspect-[16/10] w-full rounded-sm overflow-hidden border border-[#E7E3DC]/10 bg-[#1A1816]">
              <Image 
                src="/images/Untitled-design-13.png" 
                alt="Parth Production Staging Frame" 
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover grayscale filter brightness-[0.8]"
              />
            </div>
          </div>
        </section>

        {/* STORY & JOURNAL HISTORY */}
        <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-[#E7E3DC]/10">
          
          {/* Left Column: Vision details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-[10px] tracking-widest text-[#C87A53] uppercase">// Corporate Ethos</span>
            <h3 className="text-3xl text-[#E7E3DC]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              VISION & SYSTEM DESIGN
            </h3>
            <p className="font-mono text-xs text-[#A39E93] leading-relaxed">
              We reject standard visual formulas. We believe stage design is spatial poetry. Every beam angle, truss joint, and decibel level is precision-engineered to form a coherent artistic voice.
            </p>

            {/* Structured Swiss layout value grids */}
            <div className="grid grid-cols-3 border border-[#E7E3DC]/10 divide-x divide-[#E7E3DC]/10 font-mono text-[10px] uppercase tracking-widest text-center bg-[#1A1816]/30">
              <div className="p-4 py-6">
                <span className="text-[#C87A53] block mb-2 font-bold">01 / LIGHT</span>
                <span className="text-[#A39E93] text-[9px]">LUMENS SYNCED</span>
              </div>
              <div className="p-4 py-6">
                <span className="text-[#C87A53] block mb-2 font-bold">02 / SOUND</span>
                <span className="text-[#A39E93] text-[9px]">ACOUSTIC SPL</span>
              </div>
              <div className="p-4 py-6">
                <span className="text-[#C87A53] block mb-2 font-bold">03 / TRUSS</span>
                <span className="text-[#A39E93] text-[9px]">CERTIFIED GRIDS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline Journal */}
          <div className="lg:col-span-7 space-y-8">
            <span className="font-mono text-[10px] tracking-widest text-[#C87A53] uppercase">// ARCHIVAL CHRONOLOGY</span>
            
            <div className="border-t border-[#E7E3DC]/10 divide-y divide-[#E7E3DC]/10">
              {milestones.map((mil, idx) => (
                <motion.div 
                  key={mil.year}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="py-6 grid grid-cols-12 gap-4 items-start"
                >
                  <span 
                    className="col-span-3 text-2xl text-[#C87A53] font-normal"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                  >
                    {mil.year}
                  </span>
                  <div className="col-span-9 space-y-1">
                    <h4 className="text-xs font-bold text-[#E7E3DC] font-mono tracking-widest uppercase">
                      {mil.event}
                    </h4>
                    <p className="font-mono text-[10px] text-[#A39E93] leading-relaxed">
                      {mil.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </section>

        {/* TEAM GRID (Sharp editorial cards) */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="font-mono text-[10px] tracking-widest text-[#C87A53] uppercase">// Crew Directors</span>
            <h2 
              className="text-4xl sm:text-5xl leading-none text-[#E7E3DC]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              THE OFFICERS
            </h2>
            <p className="font-mono text-xs text-[#A39E93]">
              Technical command directing on-site system parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border border-[#E7E3DC]/10 p-4 bg-[#1A1816]/20 rounded-sm flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm border border-[#E7E3DC]/5">
                  <Image 
                    src={member.src} 
                    alt={member.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700 brightness-[0.8]"
                  />
                </div>

                <div className="pt-6 space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#C87A53] block">
                    {member.role}
                  </span>
                  <h4 className="text-2xl text-[#E7E3DC]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {member.name}
                  </h4>
                  <div className="border-t border-[#E7E3DC]/10 my-4" />
                  <p className="font-mono text-[11px] text-[#A39E93] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
