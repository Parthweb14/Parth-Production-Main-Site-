'use client';

import { useEffect, useState } from 'react';
import { HERO_VIDEO, SHOW_VIDEOS, videoSources } from '@/utils/media';

export type VideoWarmStatus = {
  ready: boolean;
  loaded: number;
  total: number;
};

function warmOne(url: string, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || typeof document === 'undefined') {
      resolve(false);
      return;
    }

    const sources = videoSources(url);
    const isApple =
      /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const primary = isApple ? sources.mp4 || sources.webm : sources.webm || sources.mp4;
    const fallback = primary === sources.mp4 ? sources.webm : sources.mp4;

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
      resolve(ok);
    };

    const timer = window.setTimeout(() => done(false), timeoutMs);

    video.addEventListener('canplaythrough', () => done(true), { once: true });
    video.addEventListener('loadeddata', () => {
      // Good enough buffer for hero/cards if canplaythrough is slow on cellular
      if (video.readyState >= 2) done(true);
    });
    video.addEventListener('error', () => {
      if (fallback && video.src !== fallback) {
        video.src = fallback;
        video.load();
        return;
      }
      done(false);
    });

    video.src = primary || url;
    video.load();
  });
}

/** Preload hero + Beyond Events clips while the page loader is visible. */
export function useWarmHomepageVideos(enabled = true): VideoWarmStatus {
  const [status, setStatus] = useState<VideoWarmStatus>({
    ready: !enabled,
    loaded: 0,
    total: 1 + SHOW_VIDEOS.length,
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const urls = [HERO_VIDEO, ...SHOW_VIDEOS.map((v) => v.src)];
    const total = urls.length;

    (async () => {
      let loaded = 0;
      // Warm hero first (priority), then showcase in parallel batches
      await warmOne(urls[0], 12000);
      if (cancelled) return;
      loaded += 1;
      setStatus({ ready: false, loaded, total });

      const rest = urls.slice(1);
      const batchSize = 3;
      for (let i = 0; i < rest.length; i += batchSize) {
        const batch = rest.slice(i, i + batchSize);
        const results = await Promise.all(batch.map((u) => warmOne(u, 10000)));
        if (cancelled) return;
        loaded += results.length;
        setStatus({ ready: false, loaded, total });
      }

      if (!cancelled) setStatus({ ready: true, loaded: total, total });
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return status;
}

/** List of homepage video URLs for <link rel="preload"> hints */
export function homepageVideoPreloadList(): string[] {
  return [HERO_VIDEO, ...SHOW_VIDEOS.map((v) => videoSources(v.src).mp4 || v.src)];
}
