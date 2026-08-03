import { CRAFT, STAGE_IMAGES } from '@/utils/media';

export type CraftCard = {
  id: string;
  title: string;
  copy: string;
  image_url: string;
  order_index: number;
};

export type CraftContent = {
  eyebrow: string;
  heading: string;
  italic_line: string;
  description: string;
  featured_image_url: string;
  featured_title: string;
  featured_badge: string;
  cards: CraftCard[];
};

export const DEFAULT_CRAFT: CraftContent = {
  eyebrow: 'Designed For Every Celebration',
  heading: 'Bringing Every Moment',
  italic_line: 'To Life.',
  description:
    'Sound, lighting, and professional DJs delivering unforgettable experiences for weddings, concerts, festivals, and corporate events.',
  featured_image_url: STAGE_IMAGES[1]?.src || CRAFT[0].image,
  featured_title: 'Live production',
  featured_badge: 'Stage ready',
  cards: CRAFT.map((c, i) => ({
    id: `craft-${i + 1}`,
    title: c.title,
    copy: c.copy,
    image_url: c.image,
    order_index: i,
  })),
};
