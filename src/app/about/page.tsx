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
      <div className="film-grain" />

      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-20 select-none pt-20">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[45vh] flex items-center border-b border-gray-800/40 px-6 md:px-12 py-12">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side */}
            <div className="space-y-6 flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">// Corporate profile</span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">
                ABOUT THE <br />
                <span className="text-accent drop-shadow-[0_0_15px_rgba(255,215,0,0.15)]">CREATIVE HOUSE</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                For over a decade, we have designed responsive acoustic landscapes and staging grids. We operate at the intersection of structural engineering and visceral sound design.
              </p>
            </div>

            {/* Right Side */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-gray-800 bg-secondary">
              <Image 
                src="https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev/Untitled-design-13.png" 
                alt="Parth Production Staging Frame" 
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover grayscale brightness-[0.8]"
              />
            </div>
          </div>
        </section>

        {/* STORY & JOURNAL */}
        <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-gray-800/40">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block">// Core values</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase">
              VISION & SYSTEM DESIGN
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We reject standard visual formulas. We believe stage design is spatial poetry. Every beam angle, truss joint, and decibel level is precision-engineered to form a coherent artistic voice.
            </p>

            {/* Custom grids */}
            <div className="grid grid-cols-3 border border-gray-800 divide-x divide-gray-800 text-center bg-[#111111]/30 text-xs rounded-xl overflow-hidden">
              <div className="p-4 py-6">
                <span className="text-accent block mb-2 font-bold font-sans">01 / LIGHT</span>
                <span className="text-gray-400 text-[10px]">LUMENS</span>
              </div>
              <div className="p-4 py-6">
                <span className="text-accent block mb-2 font-bold font-sans">02 / SOUND</span>
                <span className="text-gray-400 text-[10px]">DECIBELS</span>
              </div>
              <div className="p-4 py-6">
                <span className="text-accent block mb-2 font-bold font-sans">03 / TRUSS</span>
                <span className="text-gray-400 text-[10px]">RIGGING</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block">// Chronological history</span>
            
            <div className="border-t border-gray-800 divide-y divide-gray-800">
              {milestones.map((mil, idx) => (
                <motion.div 
                  key={mil.year}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="py-6 grid grid-cols-12 gap-4 items-start"
                >
                  <span className="col-span-3 text-xl font-bold text-accent">
                    {mil.year}
                  </span>
                  <div className="col-span-9 space-y-1">
                    <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                      {mil.event}
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {mil.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </section>

        {/* CREW DIRECTORS */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block">// Directors</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white">THE CREW</h2>
            <p className="text-gray-400 text-sm">
              Technical command directing on-site system parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border border-gray-800 p-6 bg-secondary/10 rounded-2xl flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl border border-gray-800">
                  <Image 
                    src={member.src} 
                    alt={member.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 brightness-[0.8]"
                  />
                </div>

                <div className="pt-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-semibold block">
                    {member.role}
                  </span>
                  <h4 className="text-2xl font-bold text-white">
                    {member.name}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed pt-3 border-t border-gray-850 mt-3">
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
