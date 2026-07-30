'use client';

import { forwardRef, useEffect, useRef, type VideoHTMLAttributes } from 'react';
import { videoSources } from '@/utils/media';

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> & {
  src: string;
  /** Prefer webm when available, mp4 fallback for iOS */
  preferWebm?: boolean;
};

/**
 * Dual-source video: WebM first (smaller/faster where supported),
 * MP4 H.264 fallback for iOS/Safari. Auto-recovers from stalls.
 */
const OptimizedVideo = forwardRef<HTMLVideoElement, Props>(function OptimizedVideo(
  {
    src,
    preferWebm = true,
    onLoadedData,
    onCanPlay,
    muted = true,
    playsInline = true,
    autoPlay,
    ...rest
  },
  ref
) {
  const innerRef = useRef<HTMLVideoElement | null>(null);
  const sources = videoSources(src);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    el.defaultMuted = Boolean(muted);
    el.muted = Boolean(muted);
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.setAttribute('x5-playsinline', 'true');

    const tryPlay = () => {
      if (autoPlay) void el.play().catch(() => undefined);
    };

    const recover = () => {
      if (el.readyState >= 2 && autoPlay) tryPlay();
    };

    const onStall = () => {
      try {
        if (Number.isFinite(el.currentTime)) {
          el.currentTime = Math.min(el.currentTime + 0.05, Math.max((el.duration || 1) - 0.1, 0));
        }
      } catch {
        /* ignore */
      }
      recover();
    };

    el.addEventListener('stalled', onStall);
    el.addEventListener('suspend', recover);
    el.addEventListener('waiting', recover);
    el.addEventListener('canplay', tryPlay);
    el.addEventListener('loadeddata', tryPlay);

    const onVis = () => {
      if (!document.hidden) recover();
    };
    document.addEventListener('visibilitychange', onVis);

    tryPlay();

    return () => {
      el.removeEventListener('stalled', onStall);
      el.removeEventListener('suspend', recover);
      el.removeEventListener('waiting', recover);
      el.removeEventListener('canplay', tryPlay);
      el.removeEventListener('loadeddata', tryPlay);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [src, muted, autoPlay]);

  const setRefs = (node: HTMLVideoElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Safari/iOS: prefer H.264 MP4. Chrome/Android: WebM often lighter.
  const isApple =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  const useWebmFirst = preferWebm && !isApple;

  const ordered = useWebmFirst
    ? [
        { src: sources.webm, type: 'video/webm' },
        { src: sources.mp4, type: 'video/mp4' },
      ]
    : [
        { src: sources.mp4, type: 'video/mp4' },
        { src: sources.webm, type: 'video/webm' },
      ];

  return (
    <video
      ref={setRefs}
      muted={muted}
      playsInline={playsInline}
      autoPlay={autoPlay}
      onLoadedData={onLoadedData}
      onCanPlay={onCanPlay}
      {...rest}
    >
      {ordered.map((s) => (s.src ? <source key={s.type} src={s.src} type={s.type} /> : null))}
    </video>
  );
});

export default OptimizedVideo;
