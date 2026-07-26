'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottiePlayer from './LottiePlayer';
import { LOGO_JSON } from '@/utils/media';

interface PageLoaderProps {
  onComplete: () => void;
  isReady: boolean;
}

export default function PageLoader({ onComplete, isReady }: PageLoaderProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    const hideLogo = setTimeout(() => setShowLogo(false), 120);
    const exitTimer = setTimeout(() => {
      setIsActive(false);
      onComplete();
    }, 900);
    return () => {
      clearTimeout(hideLogo);
      clearTimeout(exitTimer);
    };
  }, [isReady, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex pointer-events-none">
          <motion.div
            initial={{ x: 0 }}
            animate={isReady ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
            className="w-1/2 h-full bg-[#050505] pointer-events-auto"
          />
          <motion.div
            initial={{ x: 0 }}
            animate={isReady ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
            className="w-1/2 h-full bg-[#050505] pointer-events-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.45 }}
                  className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center"
                >
                  <LottiePlayer src={LOGO_JSON} className="w-full h-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
