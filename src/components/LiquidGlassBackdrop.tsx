'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  /** warm = orange brand orbs; cool = silver/white glass without orange wash */
  tone?: 'warm' | 'cool';
};

/** Slow morphing gradient orbs for liquid-glass heroes. */
export default function LiquidGlassBackdrop({ tone = 'warm' }: Props) {
  const reduceMotion = useReducedMotion();
  const cool = tone === 'cool';

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]" aria-hidden>
      <div
        className={`absolute inset-0 ${
          cool
            ? 'bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_55%)]'
            : 'bg-[radial-gradient(ellipse_at_center,_rgba(255,95,31,0.12)_0%,_transparent_55%)]'
        }`}
      />

      <motion.div
        className={`liquid-orb liquid-orb-a absolute -left-[15%] top-[10%] h-[55vw] max-h-[520px] w-[55vw] max-w-[520px] rounded-full blur-[80px] md:blur-[100px] ${
          cool ? 'bg-white/25' : 'bg-[#FF5F1F]/35'
        }`}
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
        className={`liquid-orb liquid-orb-b absolute -right-[10%] top-[25%] h-[48vw] max-h-[460px] w-[48vw] max-w-[460px] rounded-full blur-[70px] md:blur-[95px] ${
          cool ? 'bg-white/18' : 'bg-[#FFB347]/28'
        }`}
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
        className={`liquid-orb liquid-orb-c absolute bottom-[-10%] left-[30%] h-[42vw] max-h-[400px] w-[42vw] max-w-[400px] rounded-full blur-[75px] md:blur-[110px] max-md:opacity-60 ${
          cool ? 'bg-zinc-300/20' : 'bg-[#FF5F1F]/22'
        }`}
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

      {/* Extra cool-tone shimmer ribbons */}
      {cool && (
        <>
          <motion.div
            className="absolute left-1/4 top-1/3 h-px w-[40%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={reduceMotion ? undefined : { opacity: [0.15, 0.55, 0.15], x: [-40, 40, -40] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-1/5 bottom-1/3 h-px w-[35%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={reduceMotion ? undefined : { opacity: [0.1, 0.45, 0.1], x: [30, -30, 30] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="absolute inset-0 backdrop-blur-[2px] md:backdrop-blur-[3px]" />
      <div
        className="pointer-events-none absolute inset-[12%] rounded-[2rem] border border-white/10"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
          boxShadow: cool
            ? 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.06)'
            : 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,95,31,0.08)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
    </div>
  );
}
