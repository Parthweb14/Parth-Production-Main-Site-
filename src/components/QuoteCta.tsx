'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { STAGE_IMAGES } from '@/utils/media';
import MediaImage from '@/components/MediaImage';

export default function QuoteCta() {
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;

  return (
    <section className="relative bg-black border-t border-white/10 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px] md:min-h-[520px]">
        <div className="relative min-h-[280px] lg:min-h-full order-2 lg:order-1">
          <MediaImage
            src={STAGE_IMAGES[2].src}
            alt="Parth Production stage"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 border border-accent/40 m-4 md:m-6 rounded-2xl pointer-events-none" />
        </div>

        <div className="relative order-1 lg:order-2 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-14 md:py-20 border-l border-white/10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.28em] text-accent font-bold mb-5"
          >
            Next show starts here
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.05] max-w-lg"
          >
            Your date.
            <br />
            Our system.
            <br />
            <span className="text-accent">One crew.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 text-white/60 text-sm md:text-base max-w-md leading-relaxed"
          >
            Tell us the venue and vibe — we lock sound, light, SFX, truss, and DJ into one production plan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              WhatsApp us
            </a>
            <Link href="/contact" className="btn-ghost">
              Contact
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
