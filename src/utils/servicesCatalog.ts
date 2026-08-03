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

export function serviceSlug(title: string): string {
  return toGalleryCategory(title).toLowerCase().replace(/\s+/g, '-');
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
    title: 'Corporate',
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
  subtitle?: string;
  summary?: string;
  detail?: string;
};

export function mergePublicServices(rows: DbServiceRow[]): PublicServiceBlock[] {
  if (!rows?.length) return DEFAULT_SERVICE_BLOCKS;

  const byId = new Map(DEFAULT_SERVICE_BLOCKS.map((s) => [s.id, s]));
  const usedIds = new Set<number>();
  const result: PublicServiceBlock[] = [];

  for (const row of rows) {
    usedIds.add(row.id);
    const title = toGalleryCategory(row.service_title || 'Service');
    const base = byId.get(row.id);
    const heroFallback = base?.hero || STAGE_IMAGES[row.id % STAGE_IMAGES.length].src;
    const hero =
      row.image_url && !row.image_url.startsWith('/images/')
        ? row.image_url.startsWith('http') || row.image_url.startsWith('/')
          ? row.image_url
          : heroFallback
        : heroFallback;

    if (base) {
      result.push({
        ...base,
        title,
        hero,
        subtitle: row.subtitle || base.subtitle,
        summary: row.summary || base.summary,
        detail: row.detail || base.detail,
        gallery: [hero, base.gallery[1], base.gallery[2]],
        bookLabel: title.replace(/s$/i, '') || title,
      });
    } else {
      const badge = String(result.length + 1).padStart(2, '0');
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
        gallery: [hero, STAGE_IMAGES[0].src, STAGE_IMAGES[1].src],
        bookLabel: title,
        highlights: ['Sound', 'Lighting', 'SFX', 'Crew'],
      });
    }
  }

  // Keep any default not yet in DB (first-run / partial DB)
  for (const def of DEFAULT_SERVICE_BLOCKS) {
    if (!usedIds.has(def.id) && !rows.some((r) => toGalleryCategory(r.service_title) === def.title)) {
      result.push(def);
    }
  }

  return result;
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