import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import VisualFeedbackWidget from '@/components/VisualFeedbackWidget';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://parthproduction.in';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Parth Production | Event Sound, Light & Stage Production Gujarat',
    template: '%s | Parth Production',
  },
  description:
    'Parth Production delivers professional sound, lighting, SFX, truss, fireworks, and DJ production for weddings, festivals, concerts, and corporate events across Surat and Gujarat.',
  keywords: [
    'Parth Production',
    'event production Surat',
    'sound system rental Gujarat',
    'stage lighting Surat',
    'wedding DJ Surat',
    'SFX fireworks Gujarat',
    'concert production India',
    'truss stage setup',
    'corporate event production',
    'Palanpur Surat events',
  ],
  authors: [{ name: 'Parth Production' }],
  creator: 'Parth Production',
  publisher: 'Parth Production',
  applicationName: 'Parth Production',
  category: 'Event Production',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Parth Production',
    title: 'Parth Production | Unforgettable Event Production',
    description:
      'Sound, light, SFX, truss, fireworks, and DJ production for weddings, festivals, concerts, and corporate events across India.',
    images: [
      {
        url: '/favicon-512x512.png?v=7',
        width: 512,
        height: 512,
        alt: 'Parth Production logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parth Production | Event Sound, Light & Stage',
    description:
      'Professional event production — sound, lighting, SFX, fireworks, and DJ for weddings and stages across Gujarat.',
    images: ['/favicon-512x512.png?v=7'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=7', sizes: 'any' },
      { url: '/favicon-32x32.png?v=7', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png?v=7', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png?v=7', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=7',
    apple: [{ url: '/apple-touch-icon.png?v=7', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    // Add Search Console token via NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION when available
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Parth Production',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      email: 'parthproduction123@gmail.com',
      telephone: ['+919537330003', '+918866655651'],
      sameAs: [],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'Parth Production',
      image: `${SITE_URL}/logo.png`,
      url: SITE_URL,
      telephone: '+919537330003',
      email: 'parthproduction123@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Gaurav Path Road, Palanpur',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      areaServed: ['Surat', 'Gujarat', 'India'],
      priceRange: '$$',
      description:
        'One-stop event production for sound, lighting, SFX, truss, fireworks, and DJ services.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Parth Production',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${playfair.variable} dark h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/Parth Logo .json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Parth logo .png" as="image" />
        <link rel="icon" href="/favicon.ico?v=7" sizes="any" />
        <link rel="icon" href="/favicon-96x96.png?v=7" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=7" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-black text-white flex flex-col font-sans overflow-x-hidden">
        <AuthProvider>
          {children}
          <VisualFeedbackWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
