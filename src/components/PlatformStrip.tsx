'use client';

import { motion } from 'framer-motion';

const NODES = [
  { label: 'Sound', meta: 'Line arrays' },
  { label: 'Light', meta: 'Cue maps' },
  { label: 'SFX', meta: 'Timed hits' },
  { label: 'Truss', meta: 'Load rated' },
  { label: 'Pyro', meta: 'Finales' },
  { label: 'DJ', meta: 'Live sets' },
];

export default function PlatformStrip() {
  return (
    <section className="relative border-b border-white/10 bg-[#070B1A] overflow-hidden">
      <div className="absolute inset-0 site-grid opacity-25" />
      <div className="absolute left-1/2 top-0 h-40 w-[28rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <p className="section-label mb-3">Production OS</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold uppercase tracking-tight text-white">
              One crew. One system.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
                Every cue connected.
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
            Built like software ops for live nights — modular rigs that sync audio, light, and SFX
            into one run-of-show.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {NODES.map((node, i) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-5 group"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                  Node 0{i + 1}
                </span>
              </div>
              <p className="font-display text-xl md:text-2xl font-semibold uppercase tracking-tight text-white">
                {node.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 uppercase tracking-[0.16em]">{node.meta}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
