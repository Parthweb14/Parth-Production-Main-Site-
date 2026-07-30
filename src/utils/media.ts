export const ASSET_BASE = 'https://assets.parthproduction.in';

/** Local optimized dual-format videos (WebM + H.264 MP4) for fast mobile playback */
export const OPTIMIZED_VIDEO_BASE = '/videos/optimized';

export function mediaUrl(pathOrUrl: string | null | undefined, fallback = ''): string {
  if (!pathOrUrl) return fallback;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  if (pathOrUrl.startsWith('/')) return `${ASSET_BASE}${pathOrUrl}`;
  return `${ASSET_BASE}/${pathOrUrl}`;
}

/** Prefer absolute asset URLs; skip known-broken relative /images paths without host files. */
export function resolveGallerySrc(pathOrUrl: string, fallback: string): string {
  if (!pathOrUrl) return fallback;
  if (pathOrUrl.startsWith('https://assets.parthproduction.in')) return pathOrUrl;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  // Relative /images/* paths in DB were 404 — keep fallback until admin re-uploads
  if (pathOrUrl.startsWith('/images/')) return fallback;
  return mediaUrl(pathOrUrl, fallback);
}

/** Resolve admin/DB video URLs to playable absolute URLs. */
export function resolveVideoSrc(pathOrUrl: string, fallback = ''): string {
  if (!pathOrUrl) return fallback;
  const url = pathOrUrl.trim();
  if (!url) return fallback;

  // Prefer local optimized copies for known legacy asset filenames
  const optimized = mapToOptimizedVideo(url);
  if (optimized) return optimized;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Encode spaces in already-absolute URLs (common admin paste issue)
    return url.includes(' ') ? url.replace(/ /g, '%20') : url;
  }
  // Site-hosted optimized / public videos stay relative (same-origin, fastest)
  if (url.startsWith('/videos/optimized/')) {
    return url.includes(' ') ? url.replace(/ /g, '%20') : url;
  }
  if (url.startsWith('/videos/') || url.startsWith('/')) {
    const abs = `${ASSET_BASE}${url}`;
    return abs.includes(' ') ? abs.replace(/ /g, '%20') : abs;
  }
  const abs = mediaUrl(url, fallback);
  return abs.includes(' ') ? abs.replace(/ /g, '%20') : abs;
}

/** Map a video URL to dual sources (webm + mp4). */
export function videoSources(pathOrUrl: string): { mp4: string; webm: string } {
  const resolved = resolveVideoSrc(pathOrUrl, pathOrUrl);
  if (resolved.endsWith('.webm')) {
    return { webm: resolved, mp4: resolved.replace(/\.webm$/i, '.mp4') };
  }
  if (resolved.endsWith('.mp4')) {
    return { mp4: resolved, webm: resolved.replace(/\.mp4$/i, '.webm') };
  }
  return { mp4: resolved, webm: '' };
}

function mapToOptimizedVideo(url: string): string | null {
  const decoded = decodeURIComponent(url).toLowerCase();
  const map: Array<[RegExp, string]> = [
    [/hero\s*background|hero\.mp4|hero%20/i, `${OPTIMIZED_VIDEO_BASE}/hero.mp4`],
    [/video\s*1\s*\.mp4|video%201|show-1/i, `${OPTIMIZED_VIDEO_BASE}/show-1.mp4`],
    [/video\s*2\s*\.mp4|video%202|show-2/i, `${OPTIMIZED_VIDEO_BASE}/show-2.mp4`],
    [/video\s*3\.mp4|video%203|show-3/i, `${OPTIMIZED_VIDEO_BASE}/show-3.mp4`],
    [/video\s*4\.mp4|video%204|show-4/i, `${OPTIMIZED_VIDEO_BASE}/show-4.mp4`],
    [/video\s*5\.mp4|video%205|show-5/i, `${OPTIMIZED_VIDEO_BASE}/show-5.mp4`],
    [/video\s*6\.mp4|video%206|show-6/i, `${OPTIMIZED_VIDEO_BASE}/show-6.mp4`],
  ];
  for (const [re, dest] of map) {
    if (re.test(decoded) || re.test(url)) return dest;
  }
  return null;
}

export const HERO_VIDEO = `${OPTIMIZED_VIDEO_BASE}/hero.mp4`;
export const LOGO_JSON = '/Parth Logo .json';
export const LOGO_PNG = '/Parth logo .png';
export const OWNER_IMAGE = `${ASSET_BASE}/Owner.png`;

export const SHOW_VIDEOS = [
  { title: 'Weddings', src: `${OPTIMIZED_VIDEO_BASE}/show-1.mp4` },
  { title: 'Concerts', src: `${OPTIMIZED_VIDEO_BASE}/show-2.mp4` },
  { title: 'Festivals', src: `${OPTIMIZED_VIDEO_BASE}/show-3.mp4` },
  { title: 'Corporate', src: `${OPTIMIZED_VIDEO_BASE}/show-4.mp4` },
  { title: 'Road Shows', src: `${OPTIMIZED_VIDEO_BASE}/show-5.mp4` },
  { title: 'SFX Nights', src: `${OPTIMIZED_VIDEO_BASE}/show-6.mp4` },
];

export const STAGE_IMAGES = [
  { title: 'Weddings', src: `${ASSET_BASE}/Image%206%20Weddings.png`, tag: 'Sound & Light' },
  { title: 'Concerts', src: `${ASSET_BASE}/Image%201%20Concert%20.png`, tag: 'Truss & Arrays' },
  { title: 'Festivals', src: `${ASSET_BASE}/Image%203%20Festivals.png`, tag: 'Full Production' },
  { title: 'Corporate', src: `${ASSET_BASE}/Image%202%20Corporate%20events.png`, tag: 'LED & Stage' },
  { title: 'Road Shows', src: `${ASSET_BASE}/Image%204%20Road%20show.png`, tag: 'Mobile Rigs' },
  { title: 'Reception', src: `${ASSET_BASE}/Image%207%20Weddings.png`, tag: 'DJ Artistic' },
  { title: 'Laser Arena', src: `${ASSET_BASE}/image%2010%20.png`, tag: 'SFX & Lights' },
  { title: 'Mainstage', src: `${ASSET_BASE}/Image%208%20Concert.png`, tag: 'Live Sound' },
  { title: 'Campaign', src: `${ASSET_BASE}/Image%205%20Road%20show.png`, tag: 'Fireworks Ready' },
];

/** Default homepage video rows for admin seed / public fallback */
export function defaultShowcaseVideos() {
  return SHOW_VIDEOS.map((v, i) => ({
    id: `video-${i + 1}`,
    title: v.title,
    video_url: v.src,
    order_index: i,
  }));
}

/** Default Stage Gallery rows for admin seed / public fallback */
export function defaultStageGallery() {
  const labels = [
    'Wedding Stage',
    'Concert Setup',
    'Festival Lighting',
    'Corporate Event',
    'Road Show',
    'DJ Performance',
    'LED Wall',
    'Mainstage Array',
    'Fireworks Show',
  ];
  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return order.map((imgIdx, i) => ({
    id: `stage-${i + 1}`,
    title: labels[i] || STAGE_IMAGES[imgIdx]?.title || `Stage ${i + 1}`,
    image_url: STAGE_IMAGES[imgIdx]?.src || '',
    order_index: i,
  }));
}

/** Home celebration showcase — Sound, Lighting, DJ only */
export const CRAFT = [
  {
    title: 'Sound',
    copy: 'Powerful line arrays, premium speakers, digital mixers, monitors, and crystal-clear sound engineered for every audience.',
    image: `${ASSET_BASE}/Image%208%20Concert.png`,
  },
  {
    title: 'Lighting',
    copy: 'Moving heads, beam lights, wash fixtures, lasers, and synchronized lighting programmed to match every beat.',
    image: `${ASSET_BASE}/image%2010%20.png`,
  },
  {
    title: 'DJ Artists',
    copy: 'Experienced DJs delivering energetic performances for weddings, concerts, festivals, clubs, and private events.',
    image: `${ASSET_BASE}/Image%206%20Weddings.png`,
  },
];
