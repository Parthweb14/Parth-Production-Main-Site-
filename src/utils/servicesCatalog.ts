import { STAGE_IMAGES } from '@/utils/media';

/** Title-case gallery/service label: "ROAD SHOWS" → "Road Shows" */
export function toGalleryCategory(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Collapse near-duplicate labels so "Corporate" and "Corporate Events"
 * resolve to one gallery/service category.
 */
export function canonicalizeCategory(title: string): string {
  const base = toGalleryCategory(title);
  const key = base.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (key === 'corporate' || key === 'corporate event' || key === 'corporate events') {
    return 'Corporate Events';
  }
  return base;
}

export function serviceSlug(title: string): string {
  return canonicalizeCategory(title).toLowerCase().replace(/\s+/g, '-');
}

export type PublicServiceBlock = {
  id: number;
  title: string;
  badge: string;
  subtitle: string;
  summary: string;
  detail: string;
  hero: string;
  gallery: string[];
  bookLabel: string;
  highlights: string[];
};

export const DEFAULT_SERVICE_BLOCKS: PublicServiceBlock[] = [
  {
    id: 2,
    title: 'Concerts',
    badge: '01',
    subtitle: 'Arena-Ready Systems',
    summary: 'Line arrays, heavy truss, and light programming built for festival-scale energy.',
    detail:
      'Concert systems engineered for clarity under pressure — line arrays, digital consoles, heavy truss, and lighting looks programmed to the set.',
    hero: STAGE_IMAGES[1].src,
    gallery: [STAGE_IMAGES[7].src, STAGE_IMAGES[1].src, STAGE_IMAGES[6].src],
    bookLabel: 'Concert',
    highlights: ['Line arrays', 'Heavy truss', 'Cue-mapped lights', 'FOH mix'],
  },
  {
    id: 1,
    title: 'Weddings',
    badge: '02',
    subtitle: 'Ceremony to Reception',
    summary: 'Bridal entries, varmala cues, and dance-floor lighting that stay cinematic and intimate.',
    detail:
      'Sound, light, and SFX timed to every wedding beat — from entry looks to open dance floor — so guests stay in the feeling.',
    hero: STAGE_IMAGES[0].src,
    gallery: [STAGE_IMAGES[0].src, STAGE_IMAGES[5].src, STAGE_IMAGES[6].src],
    bookLabel: 'Wedding',
    highlights: ['Entry looks', 'Dance floor', 'Cold sparklers', 'DJ flow'],
  },
  {
    id: 3,
    title: 'Festivals',
    badge: '03',
    subtitle: 'Garba to EDM',
    summary: 'Wide coverage sound, laser skies, and generator-backed nights that never drop.',
    detail:
      'Outdoor festival systems built for coverage and stamina — wide-field audio, lasers, and power grids for long sets.',
    hero: STAGE_IMAGES[2].src,
    gallery: [STAGE_IMAGES[2].src, STAGE_IMAGES[6].src, STAGE_IMAGES[8].src],
    bookLabel: 'Festival',
    highlights: ['Wide coverage', 'Lasers', 'Power grid', 'Long-set stamina'],
  },
  {
    id: 4,
    title: 'Corporate Events',
    badge: '04',
    subtitle: 'Keynotes & Launches',
    summary: 'Clean speech, LED canvases, and polished stages for launches and keynotes.',
    detail:
      'Corporate production with clarity first — wireless mics, LED walls, and silent power that keep the room focused.',
    hero: STAGE_IMAGES[3].src,
    gallery: [STAGE_IMAGES[3].src, STAGE_IMAGES[7].src, STAGE_IMAGES[4].src],
    bookLabel: 'Corporate',
    highlights: ['Speech clarity', 'LED walls', 'Silent power', 'Brand polish'],
  },
  {
    id: 5,
    title: 'Road Shows',
    badge: '05',
    subtitle: 'Mobile Spectacle',
    summary: 'Mobile LED, touring audio, and quick-deploy rigs that travel with the campaign.',
    detail:
      'Road-ready spectacle — truck-mounted visuals, touring audio, and power fleets that survive day stages and night finales.',
    hero: STAGE_IMAGES[4].src,
    gallery: [STAGE_IMAGES[4].src, STAGE_IMAGES[8].src, STAGE_IMAGES[2].src],
    bookLabel: 'Road Show',
    highlights: ['Mobile LED', 'Tour audio', 'Quick deploy', 'Night finales'],
  },
];

export type DbServiceRow = {
  id: number;
  service_title: string;
  image_url: string;
  gallery_images?: string[];
  subtitle?: string;
  summary?: string;
  detail?: string;
  order_index?: number;
};

function resolveServiceUrl(url: string | undefined, fallback: string): string {
  if (!url || url.startsWith('/images/')) return fallback;
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return fallback;
}

export function mergePublicServices(rows: DbServiceRow[]): PublicServiceBlock[] {
  if (!rows?.length) return DEFAULT_SERVICE_BLOCKS;

  const byId = new Map(DEFAULT_SERVICE_BLOCKS.map((s) => [s.id, s]));
  const usedIds = new Set<number>();
  const result: PublicServiceBlock[] = [];

  const orderedRows = [...rows].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  for (const row of orderedRows) {
    usedIds.add(row.id);
    const title = canonicalizeCategory(row.service_title || 'Service');
    const base = byId.get(row.id);
    const heroFallback = base?.hero || STAGE_IMAGES[row.id % STAGE_IMAGES.length].src;
    const hero = resolveServiceUrl(row.image_url, heroFallback);
    const fallbackGallery = base?.gallery || [
      STAGE_IMAGES[0].src,
      STAGE_IMAGES[1].src,
      STAGE_IMAGES[2].src,
    ];
    const g0 = resolveServiceUrl(row.gallery_images?.[0], fallbackGallery[0]);
    const g1 = resolveServiceUrl(row.gallery_images?.[1], fallbackGallery[1]);
    const g2 = resolveServiceUrl(row.gallery_images?.[2], fallbackGallery[2]);
    const badge = String(result.length + 1).padStart(2, '0');

    if (base) {
      result.push({
        ...base,
        title,
        badge,
        hero,
        subtitle: row.subtitle || base.subtitle,
        summary: row.summary || base.summary,
        detail: row.detail || base.detail,
        gallery: [g0, g1, g2],
        bookLabel: title.replace(/s$/i, '') || title,
      });
    } else {
      result.push({
        id: row.id,
        title,
        badge,
        subtitle: row.subtitle || 'Custom Production',
        summary:
          row.summary ||
          `Professional sound, light, and stage systems for ${title.toLowerCase()} events.`,
        detail:
          row.detail ||
          `Parth Production delivers full-stack live production for ${title} — sound, light, SFX, and crew under one plan.`,
        hero,
        gallery: [g0, g1, g2],
        bookLabel: title,
        highlights: ['Sound', 'Lighting', 'SFX', 'Crew'],
      });
    }
  }

  for (const def of DEFAULT_SERVICE_BLOCKS) {
    if (
      !usedIds.has(def.id) &&
      !rows.some((r) => canonicalizeCategory(r.service_title) === def.title)
    ) {
      result.push(def);
    }
  }

  // Drop accidental Corporate duplicate if Corporate Events already exists
  const hasCorporateEvents = result.some((s) => canonicalizeCategory(s.title) === 'Corporate Events');
  return result.filter((s) => {
    if (!hasCorporateEvents) return true;
    const key = s.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    return key !== 'corporate';
  });
}

export const DEFAULT_ABOUT = {
  name: 'Parth Panchal',
  role: 'Lead DJ & Creative Director',
  badge: 'Founder & CEO',
  quote:
    "Music is not just what I do — it's who I am. Every event is a canvas, and together we paint memories.",
  description:
    'Built from late-night sets and early load-ins in Surat, Parth Production grew from a single DJ desk into a full crew for sound, light, SFX, truss, and finales.',
};