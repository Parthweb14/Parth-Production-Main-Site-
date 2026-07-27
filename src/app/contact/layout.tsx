import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Parth Production in Surat for quotes on sound, lighting, SFX, and full event production. Call or WhatsApp to book your stage.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Parth Production',
    description: 'Get a quote for your next wedding, festival, concert, or corporate event.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
