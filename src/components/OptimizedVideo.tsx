'use client';

import { forwardRef, useEffect, useRef, type VideoHTMLAttributes } from 'react';
import { videoSources } from '@/utils/media';

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> & {
  src: string;
  /** Prefer webm when available, mp4 fallback for iOS */
  preferWebm?: boolean;
  /** Force a single MP4 source (fastest start on iOS/Android) */
  mp4Only?: boolean;
};

/**
 * Dual-source video with iOS-safe attributes and stall recovery.
 * Use mp4Only for hero / critical above-the-fold clips.
 */
const OptimizedVideo = forwardRef<HTMLVideoElement, Props>(function OptimizedVideo(
  {
    src,
    preferWebm = true,
    mp4Only = false,
    onLoadedData,
    onCanPlay,
    muted = true,
    playsInline = true,
    autoPlay,
    poster,
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
    el.disableRemotePlayback = true;

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
    el.addEventListener('waiting', recover);
    el.addEventListener('canplay', tryPlay);
    el.addEventListener('loadeddata', tryPlay);
    el.addEventListener('playing', tryPlay);

    const onVis = () => {
      if (!document.hidden) recover();
    };
    document.addEventListener('visibilitychange', onVis);

    tryPlay();

    return () => {
      el.removeEventListener('stalled', onStall);
      el.removeEventListener('waiting', recover);
      el.removeEventListener('canplay', tryPlay);
      el.removeEventListener('loadeddata', tryPlay);
      el.removeEventListener('playing', tryPlay);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [src, muted, autoPlay]);

  const setRefs = (node: HTMLVideoElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const isApple =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  // Hero / critical: single MP4 src is fastest (no dual-source negotiation)
  if (mp4Only || isApple) {
    return (
      <video
        ref={setRefs}
        src={sources.mp4 || src}
        poster={poster}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        preload="auto"
        onLoadedData={onLoadedData}
        onCanPlay={onCanPlay}
        {...rest}
      />
    );
  }

  const useWebmFirst = preferWebm;
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
      poster={poster}
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
