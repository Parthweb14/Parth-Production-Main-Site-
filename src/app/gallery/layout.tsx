import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Browse Parth Production event gallery — weddings, festivals, concerts, and corporate stages lit and amplified across Gujarat.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Event Gallery | Parth Production',
    description: 'Real stages, real nights — a look at our recent productions.',
    url: '/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
