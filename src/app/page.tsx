'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Video, Users, Clock, Star, Landmark, Play, ArrowRight } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// Framer Motion specifications
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

export default function HomePage() {
  const { siteSettings } = useAuth();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const isReady = videoLoaded && minTimeElapsed;

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), 3000);
    const fallbackTimer = setTimeout(() => setVideoLoaded(true), 6000);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Features dataset
  const features = [
    {
      icon: Shield,
      title: 'Set your rules',
      description: 'Free for all, tickets, NFTs, subscriptions, custom rules'
    },
    {
      icon: Video,
      title: 'Host rooms',
      description: 'Right now, every week, or at random'
    },
    {
      icon: Users,
      title: 'Share the stage',
      description: 'Invite guests in advance or right on the spot'
    },
    {
      icon: Clock,
      title: 'Keep it going',
      description: 'Hang out in the chat during, before, and after live streams'
    }
  ];

  // Mobile Showcase mockups dataset
  const mockups = [
    {
      tags: ['Weddings', 'Acoustic SPL'],
      title: 'Royal Weddings',
      subtitle: 'Premium Varmala Audio Rigs',
      video: 'https://assets.parthproduction.in/Video%201%20.mp4',
      description: 'Point-source speaker arrays tuned for outdoor laws. Features automatic feedback control algorithms.'
    },
    {
      tags: ['Concerts', 'Truss Rigs'],
      title: 'Stadium Concerts',
      subtitle: 'Heavy-Duty Aluminum Trussing',
      video: 'https://assets.parthproduction.in/Video%202%20.mp4',
      description: 'Wind-load certified structures holding up to 4 tons of sound cabinets and automated visual beams.'
    },
    {
      tags: ['Festivals', 'Power Sync'],
      title: 'Dandiya Arenas',
      subtitle: 'Wide Coverage Sound Fields',
      video: 'https://assets.parthproduction.in/Video%203.mp4',
      description: 'Parallel generator grids supplying 500kVA active backup nodes with zero phase delays.'
    },
    {
      tags: ['Corporate', 'LED Walls'],
      title: 'VIP Keynotes',
      subtitle: 'Ultra-Bright Daylight LED Walls',
      video: 'https://assets.parthproduction.in/Video%204.mp4',
      description: 'P2.5 modular screens running redundant fiber loop controllers to prevent data signal drops.'
    },
    {
      tags: ['Road Shows', 'LED Screens'],
      title: 'Mobile Portals',
      subtitle: 'Truck-Mounted Visual Rigs',
      video: 'https://assets.parthproduction.in/Video%205.mp4',
      description: 'Custom engineered truck setups carrying daylight LED displays and independent sound setups.'
    },
    {
      tags: ['Special FX', 'Lasers'],
      title: 'Pyrotechnics Arena',
      subtitle: 'High-Intensity Strobe Gates',
      video: 'https://assets.parthproduction.in/Video%206.mp4',
      description: 'DMX-programmed laser setups synchronized to sub-bass layers for EDM shows.'
    },
    {
      tags: ['Elite Club', 'Acoustic Rigs'],
      title: 'VIP Lounge Nights',
      subtitle: 'Intimate Indoor Stage Audio',
      video: 'https://assets.parthproduction.in/Video%207.mp4',
      description: 'Compact acoustic arrangements engineered for optimal reverberation control within closed structures.'
    }
  ];

  return (
    <>
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} isReady={isReady} />
      )}

      <div className="film-grain" />
      <SpotlightNavbar />

      <div ref={containerRef} className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-accent/20 select-none">
        
        {/* 1. HERO SECTION */}
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
          {/* Autoplay R2 Video Background */}
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
          >
            <video
              src="https://assets.parthproduction.in/Hero%20Background%20video%20-%20Trim.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover brightness-[0.7]"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black via-transparent to-black" />
          </motion.div>

          {/* Staggered text content in Vetra style */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center select-none"
          >
            {/* Top Pill Notification */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-neutral-800 rounded-full px-4 py-1.5 text-xs text-neutral-300 font-medium mb-8 hover:border-neutral-700 transition duration-300 cursor-pointer"
            >
              <span>✨ Engineering Sound & Light Matrices</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-black font-bold">
                <ArrowRight className="w-3 h-3" />
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-3xl"
            >
              Accelerate Your <br className="hidden sm:inline" />
              <span className="text-white">Production With Us</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-neutral-400 max-w-xl mt-6 text-sm sm:text-base leading-relaxed font-light"
            >
              High-intensity sound systems, heavy-duty staging truss rigs, and daylight LED screens engineered across India to amplify your impact.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
            >
              <a
                href="#showcase"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-800 bg-[#0e0e10]/60 hover:bg-[#161618] hover:border-neutral-700 text-white transition flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5 text-accent fill-accent" /> Watch Showreel
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-accent/90 transition shadow-lg shadow-accent/15 flex items-center justify-center"
              >
                Get Started For Free
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. FEATURES GRID */}
        <section className="relative px-8 py-24 max-w-7xl mx-auto w-full border-t border-gray-800/40">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="flex flex-col items-start text-left p-6 rounded-2xl bg-secondary/20 border border-gray-800/30 hover:border-gray-850 hover:bg-secondary/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-800/30 border border-gray-800/60 flex items-center justify-center text-accent mb-6 shadow-md shadow-accent/5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white tracking-wide">
                    {feat.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* 3. SHOWCASE EXHIBIT */}
        <section id="showcase" className="relative px-8 py-20 border-t border-gray-800/40 w-full overflow-hidden">
          <div className="max-w-7xl mx-auto mb-16 text-center">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-3">// Production Portfolios</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">SYSTEM DECKS</h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory max-w-7xl mx-auto w-full px-2">
            {mockups.map((mock, idx) => {
              const isActiveCard = idx === 0;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`w-[300px] sm:w-[360px] flex-shrink-0 snap-start rounded-[2rem] border p-6 flex flex-col justify-between shadow-2xl relative group overflow-hidden transition-colors duration-300 ${
                    isActiveCard 
                      ? 'bg-accent text-black border-accent' 
                      : 'bg-secondary/40 text-white border-gray-850'
                  }`}
                >
                  {/* Top: Tags, Title, Subtitle */}
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-2 flex-wrap">
                      {mock.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className={`px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${
                            isActiveCard 
                              ? 'border-black/30 text-neutral-800' 
                              : 'border-gray-800 text-gray-400'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight uppercase">
                      {mock.title}
                    </h3>
                    <p className={`text-xs font-semibold leading-relaxed ${
                      isActiveCard ? 'text-neutral-800' : 'text-gray-400'
                    }`}>
                      {mock.subtitle}
                    </p>
                  </div>

                  {/* Middle: Video Cover */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-black/10">
                    <video 
                      src={mock.video} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="auto"
                      className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-102 transition-transform duration-500" 
                    />
                  </div>

                  {/* Bottom: Description underneath the video */}
                  <div className={`mt-6 space-y-3 pt-4 border-t ${
                    isActiveCard ? 'border-black/15' : 'border-gray-850'
                  }`}>
                    <p className={`text-xs leading-relaxed font-medium ${
                      isActiveCard ? 'text-neutral-900' : 'text-gray-400'
                    }`}>
                      {mock.description}
                    </p>
                    <div className={`flex justify-between items-center text-[10px] uppercase font-bold tracking-wider cursor-pointer group-hover:translate-x-1 transition-transform ${
                      isActiveCard ? 'text-black' : 'text-accent'
                    }`}>
                      <span>Explore Configuration</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 4. VALUE PROPOSITION */}
        <section className="relative px-8 py-24 border-t border-gray-800/40 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex gap-6 items-start p-8 rounded-3xl bg-secondary/10 border border-gray-800/20"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                <Star className="w-5 h-5 fill-accent" />
              </div>
              <p className="text-xl font-medium leading-relaxed text-white">
                Cut through the noise of social media with a special experience
              </p>
            </motion.div>

            {/* Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex gap-6 items-start p-8 rounded-3xl bg-secondary/10 border border-gray-800/20"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <p className="text-xl font-medium leading-relaxed text-white">
                Connect deeper with your top 1% fans, turn followers into a community
              </p>
            </motion.div>

          </div>
        </section>

        {/* 5. CREATOR SHOWCASE */}
        <section className="relative px-8 py-20 border-t border-gray-800/40 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-3">// Creators Index</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">FEATURED PLANETS</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1: Tierra Monique */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 group shadow-xl"
            >
              <Image 
                src="https://assets.parthproduction.in/Image%206%20Weddings.png" 
                alt="Tierra Monique"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <h4 className="text-2xl font-bold text-white leading-none">Tierra Monique</h4>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-bold text-accent uppercase border border-white/5">
                  $9.99 a month
                </span>
              </div>
            </motion.div>

            {/* Card 2: Chris Bivins */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 group shadow-xl"
            >
              <Image 
                src="https://assets.parthproduction.in/Image%208%20Concert.png" 
                alt="Chris Bivins"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <h4 className="text-2xl font-bold text-white leading-none">Chris Bivins</h4>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-bold text-accent uppercase border border-white/5">
                  $39.99
                </span>
              </div>
            </motion.div>

            {/* Card 3: WIDER card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative md:col-span-2 aspect-[16/9] rounded-2xl overflow-hidden border border-gray-800 group shadow-xl"
            >
              <Image 
                src="https://assets.parthproduction.in/Image%203%20Festivals.png" 
                alt="Light in a rabbit hole"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              
              <div className="absolute top-6 left-6 z-20">
                <div className="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center text-white backdrop-blur-md">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 max-w-xl space-y-2">
                <h4 className="text-3xl font-bold text-white">Light in a rabbit hole</h4>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Web3 can be overwhelming. We gotchu. We will guide you from here and literally anywhere.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

      </div>

      {/* 6. FOOTER */}
      <Footer />
    </>
  );
}
