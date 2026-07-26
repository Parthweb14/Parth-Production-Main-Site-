'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  tone?: 'warm' | 'cool';
};

/** Infinite aurora backdrop — deep navy SaaS, cyan/sky orbs (no orange). */
export default function LiquidGlassBackdrop({ tone = 'cool' }: Props) {
  const reduceMotion = useReducedMotion();
  void tone;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0E27]" aria-hidden>
      <div className="absolute inset-0 site-grid opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.12)_0%,_transparent_55%)]" />

      <motion.div
        className="liquid-orb liquid-orb-a absolute -left-[12%] top-[8%] h-[52vw] max-h-[480px] w-[52vw] max-w-[480px] rounded-full bg-cyan-400/25 blur-[90px]"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 70, -30, 0], y: [0, 40, -25, 0], scale: [1, 1.12, 0.96, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="liquid-orb liquid-orb-b absolute -right-[8%] top-[28%] h-[46vw] max-h-[420px] w-[46vw] max-w-[420px] rounded-full bg-sky-500/22 blur-[85px]"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -60, 25, 0], y: [0, -35, 50, 0], scale: [1, 0.92, 1.1, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="liquid-orb liquid-orb-c absolute bottom-[-12%] left-[28%] h-[40vw] max-h-[380px] w-[40vw] max-w-[380px] rounded-full bg-indigo-500/20 blur-[95px]"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 45, -50, 0], y: [0, -45, 18, 0], scale: [1, 1.15, 0.9, 1] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27]/50 via-transparent to-[#0A0E27]/85" />
    </div>
  );
}
