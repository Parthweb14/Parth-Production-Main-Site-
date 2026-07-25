'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  number: string;
  label: string;
  description: string;
  icon: any;
  color: string;
}

interface CylinderCarouselProps {
  items: StatItem[];
  config?: {
    radius?: number;
    itemCount?: number;
    rotationSpeed?: number;
    autoRotate?: boolean;
    pauseOnHover?: boolean;
    perspective?: number;
    cardWidth?: number;
    cardHeight?: number;
    gap?: number;
  };
}

export default function CylinderCarousel({ items, config = {} }: CylinderCarouselProps) {
  const {
    radius = 360,
    itemCount = 6,
    rotationSpeed = 0.25,
    autoRotate = true,
    pauseOnHover = true,
    perspective = 1000,
    cardWidth = 320,
    cardHeight = 380,
  } = config;

  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // Dragging interaction variables
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  // Auto rotation loop
  useEffect(() => {
    if (!autoRotate) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        // Only rotate if not hovered (if pauseOnHover is true) and not dragging
        if (!(pauseOnHover && isHovered) && !isDragging.current) {
          setRotation((prev) => (prev + rotationSpeed) % 360);
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoRotate, pauseOnHover, isHovered, rotationSpeed]);

  // Drag handlers for mouse & touch swipe rotation
  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    startRotation.current = rotation;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    const deltaX = clientX - startX.current;
    // Map pixels to rotation degrees (e.g. 5px per degree)
    const deltaRotation = deltaX * 0.18; 
    setRotation((startRotation.current + deltaRotation) % 360);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  return (
    <div 
      className="relative w-full overflow-hidden flex items-center justify-center py-24 select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: `${perspective}px` }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { handleEnd(); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* 3D Cylinder Container */}
      <div 
        className="relative preserve-3d transition-transform duration-100 ease-out"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {items.map((stat, idx) => {
          const angle = (360 / itemCount) * idx;
          const Icon = stat.icon;

          return (
            <div
              key={idx}
              className="absolute inset-0 backface-hidden preserve-3d"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
              }}
            >
              {/* Stat card wrapper */}
              <motion.div 
                className="w-full h-full rounded-3xl overflow-hidden p-6 border flex flex-col justify-between relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,17,0.9) 0%, rgba(5,5,5,0.95) 100%)',
                  borderColor: `${stat.color}30`,
                  boxShadow: `0 0 35px ${stat.color}15, inset 0 0 35px ${stat.color}10`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 50px ${stat.color}35, inset 0 0 50px ${stat.color}15`,
                  borderColor: `${stat.color}60`,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              >
                {/* Top Row: Number & Icon */}
                <div className="flex justify-between items-start">
                  <span 
                    className="text-5xl md:text-6xl font-black font-sans leading-none select-none"
                    style={{ 
                      color: stat.color,
                      textShadow: `0 0 30px ${stat.color}40`,
                    }}
                  >
                    {stat.number}
                  </span>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center border"
                    style={{ 
                      borderColor: `${stat.color}20`,
                      background: `${stat.color}08`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>

                {/* Bottom Row: Label & Description */}
                <div className="space-y-2 mt-auto">
                  <h4 
                    className="text-md font-bold text-white tracking-wide uppercase"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {stat.label}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                    {stat.description}
                  </p>
                </div>

                {/* Colored accent bottom strip */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1" 
                  style={{ background: stat.color }} 
                />
                
                {/* Radial ambient card overlay glow */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color} 0%, transparent 70%)`
                  }}
                />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
