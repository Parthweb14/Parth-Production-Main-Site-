'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from './LiveProjectButton';
import Image from 'next/image';

interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: string;
  images: {
    col1_img1: string;
    col1_img2: string;
    col2_img: string;
  };
  link: string;
}

const projectsData: ProjectItem[] = [
  {
    id: 'wedding-productions',
    number: '01',
    name: 'Royal Weddings & Varmala Rigs',
    category: 'Wedding Production',
    images: {
      col1_img1: '/images/Untitled-design-13.png',
      col1_img2: '/images/Untitled-design-18_tdjp2b.png',
      col2_img: '/images/Untitled-design-21_atubxz.png'
    },
    link: 'https://github.com'
  },
  {
    id: 'festival-productions',
    number: '02',
    name: 'Cultural Festivals & Dandiya Arenas',
    category: 'Arena Production',
    images: {
      col1_img1: '/images/Untitled-design-20_sm7myc.png',
      col1_img2: '/images/Untitled-design-17_ubz6ho.png',
      col2_img: '/images/Untitled-design-15_bdfxt9.png'
    },
    link: 'https://github.com'
  },
  {
    id: 'concert-productions',
    number: '03',
    name: 'Stadium Concerts & Live Audio',
    category: 'Stadium Production',
    images: {
      col1_img1: '/images/Untitled-design-14_ogyqmd.png',
      col1_img2: '/images/Untitled-design-32_atcfrs.png',
      col2_img: '/images/Untitled-design-25_f2t475.png'
    },
    link: 'https://github.com'
  }
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section 
      ref={containerRef}
      className="relative bg-[#12100E] z-25 pt-20 pb-32 px-6 md:px-12 flex flex-col items-center border-t border-[#E7E3DC]/10"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        <div className="lg:col-span-5 space-y-4 text-left">
          <span className="font-mono text-[10px] tracking-widest text-[#C87A53] block uppercase">// Editorial Folio</span>
          <h2 
            className="text-4xl sm:text-5xl leading-none text-[#E7E3DC]"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            SIGNATURE <br />
            <span className="italic font-light">Installations</span>
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="font-mono text-xs text-[#A39E93] leading-relaxed max-w-xl">
            A architectural grid breakdown of our signature structural events. Each deck highlights details of layouts deployed, staging materials, and on-site rig grids.
          </p>
        </div>
      </div>

      {/* Sticky Stacking Cards Container */}
      <div className="w-full max-w-6xl space-y-12 md:space-y-32 relative">
        {projectsData.map((project, idx) => {
          return (
            <CardWrapper 
              key={project.id} 
              project={project} 
              index={idx} 
              totalCards={projectsData.length}
              globalProgress={scrollYProgress} 
            />
          );
        })}
      </div>
    </section>
  );
}

interface CardWrapperProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  globalProgress: any;
}

function CardWrapper({ project, index, totalCards, globalProgress }: CardWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start']
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div 
      ref={cardRef} 
      className="sticky h-[50vh] md:h-[90vh] w-full flex items-center justify-center"
      style={{ 
        top: isMobile ? '64px' : '80px',
        perspective: 1000,
        zIndex: index + 10
      }}
    >
      <motion.div 
        style={{ scale }}
        className="w-full bg-[#1A1816] rounded-sm border border-[#E7E3DC]/15 p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
      >
        {/* Top Row Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC]/10 pb-4 md:pb-6">
          <div className="flex items-center gap-6">
            <span 
              className="text-4xl sm:text-6xl font-normal text-[#C87A53] leading-none"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {project.number}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A39E93] block mb-1">
                {project.category}
              </span>
              <h3 
                className="text-lg sm:text-2xl text-[#E7E3DC] font-normal uppercase"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          
          <LiveProjectButton />
        </div>

        {/* Bottom Row Layout: 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mt-6 flex-1 items-stretch">
          <div className="hidden md:flex md:col-span-4 flex-col gap-4 justify-between">
            <div className="relative w-full rounded-sm overflow-hidden border border-[#E7E3DC]/5 shadow-md h-[140px] lg:h-[190px]">
              <Image 
                src={project.images.col1_img1} 
                alt={`${project.name} preview 1`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700 brightness-[0.7]"
              />
            </div>
            
            <div className="relative w-full rounded-sm overflow-hidden border border-[#E7E3DC]/5 shadow-md h-[180px] lg:h-[250px]">
              <Image 
                src={project.images.col1_img2} 
                alt={`${project.name} preview 2`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700 brightness-[0.7]"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-6 relative rounded-sm overflow-hidden border border-[#E7E3DC]/5 shadow-md min-h-[180px] sm:min-h-[220px] md:min-h-0 aspect-[16/10] md:aspect-auto">
            <Image 
              src={project.images.col2_img} 
              alt={`${project.name} main cover`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700 brightness-[0.7]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
