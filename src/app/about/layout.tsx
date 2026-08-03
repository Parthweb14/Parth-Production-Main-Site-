import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet Parth Production — Surat-based event producers crafting sound, light, and stage experiences for weddings, festivals, and corporate nights across Gujarat.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Parth Production',
    description:
      'Our story, philosophy, and the team behind unforgettable stages in Surat and beyond.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
