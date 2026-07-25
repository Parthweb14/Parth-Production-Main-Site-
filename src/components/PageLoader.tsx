'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottiePlayer from './LottiePlayer';

interface PageLoaderProps {
  onComplete: () => void;
  isReady: boolean;
}

export default function PageLoader({ onComplete, isReady }: PageLoaderProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isReady) {
      // Hide the logo immediately when ready
      setShowLogo(false);
      
      // Start curtain split exit animation
      const exitTimer = setTimeout(() => {
        setIsActive(false);
        onComplete();
      }, 900); // Give the exit animation enough time to slide away (800ms)
      
      return () => {
        clearTimeout(exitTimer);
      };
    }
  }, [isReady, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex pointer-events-none">
          {/* Left Curtain Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={isReady ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
            className="w-1/2 h-full bg-zinc-950 pointer-events-auto"
          />

          {/* Right Curtain Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={isReady ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
            className="w-1/2 h-full bg-zinc-950 pointer-events-auto"
          />

          {/* Centered Lottie Logo */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center pointer-events-auto"
                >
                  <LottiePlayer src="/Logo.json" className="w-full h-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
