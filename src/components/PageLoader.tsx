'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete: () => void;
  isReady: boolean;
}

const BRAND = 'Parth Production';
const LETTERS = BRAND.split('');

export default function PageLoader({ onComplete, isReady }: PageLoaderProps) {
  const [showContent, setShowContent] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    const hideContent = setTimeout(() => setShowContent(false), 120);
    const exitTimer = setTimeout(() => {
      setIsActive(false);
      onComplete();
    }, 620);
    return () => {
      clearTimeout(hideContent);
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

          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4 }}
                  className="relative flex flex-col items-center px-5 pb-8"
                >
                  {/* Brand title */}
                  <div className="mb-8 sm:mb-10 select-none px-4" aria-label="Parth Production">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.42em] text-[#3A8FB8] sm:text-[11px]"
                    >
                      Loading the experience
                    </motion.p>

                    <h1 className="flex flex-nowrap items-center justify-center whitespace-nowrap font-display text-[clamp(1.35rem,5.2vw,1.75rem)] font-bold uppercase leading-none tracking-[0.06em] text-white sm:text-4xl sm:tracking-[0.08em] md:text-5xl">
                      {LETTERS.map((char, i) =>
                        char === ' ' ? (
                          <span key={`space-${i}`} className="inline-block w-[0.28em] sm:w-[0.35em]" aria-hidden />
                        ) : (
                          <motion.span
                            key={`${char}-${i}`}
                            className="page-loader-letter inline-block origin-bottom"
                            initial={{ opacity: 0, rotateX: -90, y: 18 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0 }}
                            transition={{
                              duration: 0.7,
                              delay: 0.08 + i * 0.045,
                              ease: [0.81, 0.04, 0.4, 0.7],
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            {char}
                          </motion.span>
                        )
                      )}
                    </h1>

                    <motion.div
                      className="mx-auto mt-4 h-px origin-center bg-gradient-to-r from-transparent via-[#3A8FB8] to-transparent"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  {/* Uiverse span loader — vikramsinghnegi */}
                  <div className="loader-spanne-20" aria-hidden>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <span key={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
