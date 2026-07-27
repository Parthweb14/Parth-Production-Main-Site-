import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore Parth Production services: professional sound systems, stage lighting, SFX, truss, fireworks, and DJ production for every event scale.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Event Production Services | Parth Production',
    description:
      'Sound, lighting, SFX, truss, fireworks, and DJ — complete production for weddings, concerts, and corporate events.',
    url: '/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
