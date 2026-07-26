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

export const HERO_VIDEO = `${ASSET_BASE}/Hero%20Background%20video%20-%20Trim.mp4`;
export const LOGO_JSON = '/Parth Logo .json';
export const LOGO_PNG = '/Parth logo .png';
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
  { title: 'Corporate', src: `${ASSET_BASE}/Image%202%20Corporate%20events.png`, tag: 'LED & Stage' },
  { title: 'Road Shows', src: `${ASSET_BASE}/Image%204%20Road%20show.png`, tag: 'Mobile Rigs' },
  { title: 'Reception', src: `${ASSET_BASE}/Image%207%20Weddings.png`, tag: 'DJ Artistic' },
  { title: 'Laser Arena', src: `${ASSET_BASE}/image%2010%20.png`, tag: 'SFX & Lights' },
  { title: 'Mainstage', src: `${ASSET_BASE}/Image%208%20Concert.png`, tag: 'Live Sound' },
  { title: 'Campaign', src: `${ASSET_BASE}/Image%205%20Road%20show.png`, tag: 'Fireworks Ready' },
];

export const CRAFT = [
  { title: 'Sound', copy: 'Line arrays, monitors, and mixes that cut clean through every crowd.', image: `${ASSET_BASE}/Image%208%20Concert.png` },
  { title: 'Light', copy: 'Moving heads, washes, and laser looks programmed to the beat.', image: `${ASSET_BASE}/image%2010%20.png` },
  { title: 'SFX', copy: 'Cold sparklers, fog, CO₂, and cue-timed atmosphere.', image: `${ASSET_BASE}/Image%203%20Festivals.png` },
  { title: 'Truss', copy: 'Certified structures for LED, audio, and aerial fixtures.', image: `${ASSET_BASE}/Image%201%20Concert%20.png` },
  { title: 'Firework', copy: 'Pyro and skyline moments for finales that get remembered.', image: `${ASSET_BASE}/Image%205%20Road%20show.png` },
  { title: 'DJ Artistic', copy: 'Sets and transitions shaped for weddings, festivals, and clubs.', image: `${ASSET_BASE}/Image%206%20Weddings.png` },
];
