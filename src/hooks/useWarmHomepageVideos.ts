'use client';

import { useEffect, useState } from 'react';
import { HERO_VIDEO, SHOW_VIDEOS, videoSources } from '@/utils/media';

export type VideoWarmStatus = {
  ready: boolean;
  heroReady: boolean;
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
    // Prefer MP4 everywhere for fastest decode start (baseline H.264 on iOS/Android)
    const primary = sources.mp4 || sources.webm || url;

    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      // Keep element briefly so browser HTTP cache retains bytes, then detach
      window.setTimeout(() => {
        video.removeAttribute('src');
        try {
          video.load();
        } catch {
          /* ignore */
        }
      }, 50);
      resolve(ok);
    };

    const timer = window.setTimeout(() => done(video.readyState >= 2), timeoutMs);

    video.addEventListener('canplay', () => done(true), { once: true });
    video.addEventListener('loadeddata', () => {
      if (video.readyState >= 2) done(true);
    });
    video.addEventListener('error', () => done(false), { once: true });

    video.src = primary;
    video.load();
  });
}

/**
 * Warm hero first (blocks page reveal), then showcase clips in background.
 */
export function useWarmHomepageVideos(enabled = true): VideoWarmStatus {
  const [status, setStatus] = useState<VideoWarmStatus>({
    ready: !enabled,
    heroReady: !enabled,
    loaded: 0,
    total: 1 + SHOW_VIDEOS.length,
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const urls = [HERO_VIDEO, ...SHOW_VIDEOS.map((v) => v.src)];
    const total = urls.length;

    (async () => {
      const heroOk = await warmOne(urls[0], 8000);
      if (cancelled) return;
      setStatus({ ready: false, heroReady: true, loaded: heroOk ? 1 : 1, total });

      // Showcase warm does not block the loader
      const rest = urls.slice(1);
      let loaded = 1;
      await Promise.all(
        rest.map(async (u) => {
          await warmOne(u, 10000);
          if (cancelled) return;
          loaded += 1;
          setStatus((s) => ({ ...s, loaded, ready: loaded >= total }));
        })
      );
      if (!cancelled) {
        setStatus((s) => ({ ...s, ready: true, loaded: total, total }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return status;
}

export function homepageVideoPreloadList(): string[] {
  // Hero first, then shows — MP4 only for broadest device support
  return [HERO_VIDEO, ...SHOW_VIDEOS.map((v) => videoSources(v.src).mp4 || v.src)];
}
