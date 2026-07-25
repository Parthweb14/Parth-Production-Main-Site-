import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Space_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  style: ['normal', 'italic'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Parth Production | Premium DJ & Event Services',
  description: 'Creating unforgettable atmospheres with premium DJ performances, sound systems, and lighting for weddings, festivals, and corporate events.',
  keywords: ['DJ services', 'event management', 'wedding DJ', 'sound system', 'lighting design', 'Gujarat events'],
  icons: {
    icon: [
      { url: '/favicon-96x96.png?v=4', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico?v=4',
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Parth Production | Premium Event Services',
    description: '1000+ events completed. Professional DJ, sound, and lighting services.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parth Production | Premium Event Services',
    description: '1000+ events completed. Professional DJ, sound, and lighting services.',
  },
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${spaceMono.variable} dark h-full antialiased`}>
      <head>
        <link rel="preload" href="/Logo.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className="min-h-full bg-[#12100E] text-[#E7E3DC] flex flex-col font-mono select-none overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Load Lottie player for premium vector animations */}
        <Script 
          src="https://unpkg.com/@lottiefiles/lottie-player@2.0.4/dist/lottie-player.js" 
          strategy="beforeInteractive" 
        />
        {/* Prevent mobile pinch zoom and double-tap zoom */}
        <Script id="disable-zoom" strategy="afterInteractive">
          {`
            document.addEventListener('gesturestart', function (e) {
              e.preventDefault();
            });
            document.addEventListener('touchstart', function (e) {
              if (e.touches.length > 1) {
                e.preventDefault();
              }
            }, { passive: false });
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (e) {
              const now = (new Date()).getTime();
              if (now - lastTouchEnd <= 300) {
                e.preventDefault();
              }
              lastTouchEnd = now;
            }, false);
          `}
        </Script>
      </body>
    </html>
  );
}
