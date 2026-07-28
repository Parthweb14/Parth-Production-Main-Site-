import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import HelmetContext from '@/components/HelmetContext';

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
    default: 'Parth Production | Premium DJ, Sound & Lighting Events',
    template: '%s | Parth Production',
  },
  description:
    'Parth Production offers full-stack live event production. Premium DJ, sound systems, lighting, SFX, and truss for weddings, concerts, and corporate events in India.',
  keywords: [
    'Parth Production',
    'DJ services India',
    'wedding sound and light',
    'concert production',
    'corporate event DJ',
    'SFX',
    'truss rigging',
  ],
  authors: [{ name: 'Parth Production' }],
  creator: 'Parth Production',
  publisher: 'Parth Production',
  applicationName: 'Parth Production',
  category: 'Event Production',
  alternates: {
    canonical: 'https://parthproduction.in/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://parthproduction.in/',
    siteName: 'Parth Production',
    title: 'Parth Production | Premium DJ, Sound & Lighting Events',
    description: 'Full-stack live event production. Premium DJ, sound systems, lighting, SFX, and truss.',
    images: [
      {
        url: 'https://parthproduction.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Parth Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parth Production | Premium DJ, Sound & Lighting Events',
    description: 'Full-stack live event production. Premium DJ, sound systems, lighting, SFX, and truss.',
    images: ['https://parthproduction.in/og-image.jpg'],
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
      { url: '/favicon.ico?v=8', sizes: 'any' },
      { url: '/favicon-32x32.png?v=8', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png?v=8', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png?v=8', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=8',
    apple: [{ url: '/apple-touch-icon.png?v=8', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    // Google Search Console Verification Placeholder
    // <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
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
        <link rel="preload" href="/Parth logo .png" as="image" />
        <link rel="icon" href="/favicon.ico?v=8" sizes="any" />
        <link rel="icon" href="/favicon-96x96.png?v=8" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=8" />
        {/* Google Search Console Verification Placeholder */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" /> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-black text-white flex flex-col font-sans overflow-x-hidden">
        <HelmetContext>
          <AuthProvider>{children}</AuthProvider>
        </HelmetContext>
      </body>
    </html>
  );
}
