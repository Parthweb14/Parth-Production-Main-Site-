'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

type VideoLightbox = {
  type: 'video';
  src: string;
  title?: string;
};

type ImageLightbox = {
  type: 'image';
  src: string;
  title?: string;
};

export type LightboxMedia = VideoLightbox | ImageLightbox;

type Props = {
  media: LightboxMedia | null;
  onClose: () => void;
};

export default function MediaLightbox({ media, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!media) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [media, onClose]);

  useEffect(() => {
    if (media?.type !== 'video') return;
    const el = videoRef.current;
    if (!el) return;
    void el.play().catch(() => undefined);
  }, [media]);

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={media.title || 'Media preview'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            aria-label="Close preview"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-5xl flex-col"
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <p className="truncate font-display text-sm font-semibold uppercase tracking-wide text-white/90 sm:text-base">
                {media.title || (media.type === 'video' ? 'Video' : 'Stage')}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-[#3A8FB8]/60 hover:bg-[#3A8FB8]/15"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:rounded-3xl">
              {media.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={media.src}
                  controls
                  autoPlay
                  playsInline
                  className="mx-auto max-h-[min(78dvh,820px)] w-full bg-black object-contain"
                />
              ) : (
                <div className="relative mx-auto h-[min(78dvh,820px)] w-full min-h-[240px]">
                  <Image
                    src={media.src}
                    alt={media.title || 'Stage gallery'}
                    fill
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
