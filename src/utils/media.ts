export const ASSET_BASE = 'https://assets.parthproduction.in';

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

  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Encode spaces in already-absolute URLs (common admin paste issue)
    return url.includes(' ') ? url.replace(/ /g, '%20') : url;
  }
  if (url.startsWith('/videos/') || url.startsWith('/')) {
    const abs = `${ASSET_BASE}${url}`;
    return abs.includes(' ') ? abs.replace(/ /g, '%20') : abs;
  }
  const abs = mediaUrl(url, fallback);
  return abs.includes(' ') ? abs.replace(/ /g, '%20') : abs;
}

/** Prefer explicit webm_url; auto-pair only for compressed /uploads/*.mp4 siblings. */
export function resolveWebmSrc(mp4OrAny: string, webmUrl?: string | null): string {
  if (webmUrl) return resolveVideoSrc(webmUrl, '');
  const src = resolveVideoSrc(mp4OrAny, '');
  if (!src) return '';
  if (/\.webm($|\?)/i.test(src)) return src;
  if (/\/uploads\/.+\.mp4($|\?)/i.test(src)) {
    return src.replace(/\.mp4(?=$|\?)/i, '.webm');
  }
  return '';
}

export const HERO_VIDEO = '/videos/optimized/hero.mp4';
export const HERO_VIDEO_FALLBACK = `${ASSET_BASE}/Hero%20Background%20video%20-%20Trim.mp4`;
export const HERO_POSTER = '/videos/optimized/hero-poster.jpg';
export const LOGO_JSON = '/Parth Logo .json';
export const LOGO_PNG = '/Parth logo .png';
/** Tighter wordmark for login (Cloudflare R2) — less top/bottom padding */
/** Tight crop of the square CDN wordmark (no empty vertical padding). */
export const LOGO_LOGIN_PNG = '/parth-logo-login.png';
export const OWNER_IMAGE = `${ASSET_BASE}/Owner.png`;

export const SHOW_VIDEOS = [
  { title: 'Weddings', src: `${ASSET_BASE}/Video%201%20.mp4` },
  { title: 'Concerts', src: `${ASSET_BASE}/Video%202%20.mp4` },
  { title: 'Festivals', src: `${ASSET_BASE}/Video%203.mp4` },
  { title: 'Corporate', src: `${ASSET_BASE}/Video%204.mp4` },
  { title: 'Road Shows', src: `${ASSET_BASE}/Video%205.mp4` },
  { title: 'SFX Nights', src: `${ASSET_BASE}/Video%206.mp4` },
];

export const STAGE_IMAGES = [
  { title: 'Weddings', src: `${ASSET_BASE}/Image%206%20Weddings.png`, tag: 'Sound & Light' },
  { title: 'Concerts', src: `${ASSET_BASE}/Image%201%20Concert%20.png`, tag: 'Truss & Arrays' },
  { title: 'Festivals', src: `${ASSET_BASE}/Image%203%20Festivals.png`, tag: 'Full Production' },
  { title: 'Corporate Events', src: `${ASSET_BASE}/Image%202%20Corporate%20events.png`, tag: 'LED & Stage' },
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
