'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Slow morphing gradient orbs for the services liquid-glass hero. */
export default function LiquidGlassBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,95,31,0.12)_0%,_transparent_55%)]" />

      <motion.div
        className="liquid-orb liquid-orb-a absolute -left-[15%] top-[10%] h-[55vw] max-h-[520px] w-[55vw] max-w-[520px] rounded-full bg-[#FF5F1F]/35 blur-[80px] md:blur-[100px]"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 80, -40, 0],
                y: [0, 50, -30, 0],
                scale: [1, 1.15, 0.95, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="liquid-orb liquid-orb-b absolute -right-[10%] top-[25%] h-[48vw] max-h-[460px] w-[48vw] max-w-[460px] rounded-full bg-[#FFB347]/28 blur-[70px] md:blur-[95px]"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -70, 30, 0],
                y: [0, -40, 60, 0],
                scale: [1, 0.9, 1.12, 1],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="liquid-orb liquid-orb-c absolute bottom-[-10%] left-[30%] h-[42vw] max-h-[400px] w-[42vw] max-w-[400px] rounded-full bg-[#FF5F1F]/22 blur-[75px] md:blur-[110px] max-md:opacity-60"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 50, -60, 0],
                y: [0, -55, 20, 0],
                scale: [1, 1.2, 0.88, 1],
              }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Frosted glass plane + edge highlight */}
      <div className="absolute inset-0 backdrop-blur-[2px] md:backdrop-blur-[3px]" />
      <div
        className="pointer-events-none absolute inset-[12%] rounded-[2rem] border border-white/10"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,95,31,0.08)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
    </div>
  );
}
