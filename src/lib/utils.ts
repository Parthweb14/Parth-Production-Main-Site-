import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely (clsx + tailwind-merge).
 * Required by shadcn/ui, Aceternity UI, Magic UI, and most copy-paste components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** No-op async delay helper for staggered Motion / Magic UI demos. */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Absolute URL helper for OG tags / share links. */
export function absoluteUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://parthproduction.in';
  if (path.startsWith('http')) return path;
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
