'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Play } from 'lucide-react';
import Image from 'next/image';

type VideoLightbox = {
  type: 'video';
  src: string;
  webmSrc?: string;
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
  const instanceId = useId();
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [paused, setPaused] = useState(false);
  const mediaKey = media ? `${media.type}:${media.src}` : '';

  useEffect(() => {
    if (!media) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
      window.removeEventListener('keydown', onKey);
    };
  }, [media, onClose]);

  // Reliable play: muted first (always allowed), then try unmute
  useEffect(() => {
    if (!media || media.type !== 'video') return;
    const el = videoRef.current;
    if (!el) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setVideoReady(false);
      setVideoError(false);
      setPaused(false);
    });

    const tryPlay = async () => {
      try {
        el.defaultMuted = true;
        el.muted = true;
        el.playsInline = true;
        el.setAttribute('playsinline', 'true');
        el.setAttribute('webkit-playsinline', 'true');
        // Stay muted — reliable on iOS/Android; tap-to-unmute often blocked
        await el.play();
        if (cancelled) return;
        setPaused(false);
      } catch {
        if (!cancelled) setPaused(true);
      }
    };

    const onCanPlay = () => {
      setVideoReady(true);
      void tryPlay();
    };

    const onError = () => {
      setVideoError(true);
      setVideoReady(false);
    };

    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onError);
    el.load();

    if (el.readyState >= 2) {
      setVideoReady(true);
      void tryPlay();
    }

    return () => {
      cancelled = true;
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onError);
      el.pause();
    };
  }, [media, mediaKey]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el || media?.type !== 'video') return;
    if (el.paused) {
      void el
        .play()
        .then(() => setPaused(false))
        .catch(() => setPaused(true));
    } else {
      el.pause();
      setPaused(true);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {media && (
        <motion.div
          key={`lightbox-${instanceId}-${mediaKey}`}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label={media.title || 'Media preview'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/92"
            aria-label="Close preview"
            onClick={onClose}
          />

          {/* Always-visible close — fixed to viewport + safe areas */}
          <button
            type="button"
            onClick={onClose}
            className="fixed z-[220] flex min-h-[48px] min-w-[48px] items-center gap-2 rounded-full border border-white/25 bg-[#0a1524]/95 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md transition-transform hover:scale-[1.03] hover:border-[#3A8FB8]/70 active:scale-[0.98]"
            style={{
              top: 'max(1rem, env(safe-area-inset-top, 0px) + 0.75rem)',
              right: 'max(1rem, env(safe-area-inset-right, 0px) + 0.75rem)',
            }}
            aria-label="Close"
          >
            <X className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            <span className="pr-0.5">Close</span>
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-5xl flex-col px-3 sm:px-6"
            style={{
              paddingTop: 'max(4.75rem, env(safe-area-inset-top, 0px) + 4rem)',
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px) + 0.75rem)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {media.title && (
              <p className="mb-3 text-center font-display text-sm font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-base">
                {media.title}
              </p>
            )}

            <div
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.7)] sm:rounded-3xl"
              onContextMenu={(e) => e.preventDefault()}
            >
              {media.type === 'video' ? (
                <div className="relative bg-black">
                  <video
                    key={media.src + (media.webmSrc || '')}
                    ref={videoRef}
                    controls={false}
                    controlsList="nodownload noplaybackrate noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="mx-auto max-h-[min(72dvh,780px)] w-full cursor-pointer select-none bg-black object-contain"
                    style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}
                    draggable={false}
                    onClick={togglePlay}
                    onPlay={() => setPaused(false)}
                    onPause={() => setPaused(true)}
                    onError={() => setVideoError(true)}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {media.webmSrc ? (
                      <source src={media.webmSrc} type="video/webm" />
                    ) : null}
                    <source src={media.src} type="video/mp4" />
                  </video>

                  {!videoError && paused && (
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/25"
                      aria-label="Play video"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-md sm:h-20 sm:w-20">
                        <Play className="h-7 w-7 fill-white sm:h-8 sm:w-8" />
                      </span>
                    </button>
                  )}

                  {!videoReady && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-[#3A8FB8]" />
                    </div>
                  )}

                  {videoError && (
                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-16 text-center sm:min-h-[320px]">
                      <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                        Video unavailable
                      </p>
                      <p className="max-w-sm text-sm text-white/60">
                        This clip could not be loaded. Close and try another video.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-2 rounded-full border border-[#3A8FB8]/50 bg-[#3A8FB8]/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="relative mx-auto h-[min(72dvh,780px)] min-h-[240px] w-full"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <Image
                    src={media.src}
                    alt={media.title || 'Stage gallery'}
                    fill
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="select-none object-contain"
                    priority
                    draggable={false}
                  />
                </div>
              )}
            </div>

            <p className="mt-3 text-center text-[11px] text-white/40 sm:text-xs">
              Tap outside or Close to exit
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
