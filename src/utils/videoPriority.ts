import {
  SHOW_VIDEOS,
  resolveVideoSrc,
  resolveWebmSrc,
  showcaseFallbackForTitle,
  HERO_VIDEO,
} from '@/utils/media';
import { fetchPublicData } from '@/utils/publicDataCache';

const warmed = new Set<string>();
const warmNodes: HTMLVideoElement[] = [];

/** Keep a soft cap so we don't flood mobile bandwidth. */
const MAX_WARM = 3;

/**
 * Start buffering a video ASAP (hero / Beyond Events priority).
 * Uses a detached muted <video preload="auto"> so decode can begin
 * before the visible carousel mounts the same URL.
 */
export function warmVideoUrl(url: string | null | undefined, priority: 'high' | 'auto' = 'auto') {
  if (typeof window === 'undefined' || !url) return;
  const src = url.trim();
  if (!src || warmed.has(src)) return;
  warmed.add(src);

  try {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);
  } catch {
    /* ignore */
  }

  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    video.src = src;
    // Kick the network stack without attaching to the DOM.
    void video.load();
    warmNodes.push(video);
  } catch {
    /* ignore */
  }
}

/** Resolve the first N showcase MP4s from API cache or static fallbacks. */
export async function resolvePriorityVideoUrls(limit = MAX_WARM): Promise<string[]> {
  const urls: string[] = [];
  const push = (u: string) => {
    if (u && !urls.includes(u) && urls.length < limit) urls.push(u);
  };

  push(typeof HERO_VIDEO === 'string' ? HERO_VIDEO : '');

  try {
    const data = await fetchPublicData();
    const videos = data.videos as
      | { title?: string; video_url?: string; webm_url?: string }[]
      | undefined;
    if (videos?.length) {
      for (const [i, v] of videos.entries()) {
        const fallback = showcaseFallbackForTitle(v.title, i).src;
        // MP4 first — more reliable first-frame than waiting on WebM.
        push(resolveVideoSrc(v.video_url || '', fallback));
        if (urls.length >= limit) break;
      }
    }
  } catch {
    /* fallbacks below */
  }

  for (const clip of SHOW_VIDEOS) {
    push(clip.src);
    if (urls.length >= limit) break;
  }

  return urls;
}

/** Homepage entry: warm hero + first Beyond Events clips immediately. */
export function prioritizeHomepageVideos() {
  if (typeof window === 'undefined') return;

  // Instant fallbacks (no await) so bytes start before API returns.
  warmVideoUrl(HERO_VIDEO, 'high');
  warmVideoUrl(SHOW_VIDEOS[0]?.src, 'high');
  warmVideoUrl(SHOW_VIDEOS[1]?.src, 'auto');

  void resolvePriorityVideoUrls(MAX_WARM).then((urls) => {
    urls.forEach((url, i) => warmVideoUrl(url, i === 0 ? 'high' : 'auto'));
  });
}

/** After public data lands (AuthContext), warm any DB video URLs. */
export function warmVideosFromPublicData(data: Record<string, unknown>) {
  const videos = data.videos as
    | { title?: string; video_url?: string; webm_url?: string }[]
    | undefined;
  if (!videos?.length) return;

  videos.slice(0, MAX_WARM).forEach((v, i) => {
    const fallback = showcaseFallbackForTitle(v.title, i).src;
    const mp4 = resolveVideoSrc(v.video_url || '', fallback);
    warmVideoUrl(mp4, i === 0 ? 'high' : 'auto');
    // Optional WebM — do not block MP4 priority; only warm sibling lightly.
    const webm = resolveWebmSrc(v.video_url || mp4, v.webm_url);
    if (webm && i === 0) warmVideoUrl(webm, 'auto');
  });
}
