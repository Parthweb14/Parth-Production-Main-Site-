import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Parth Production | Create your Universe✨',
  description: 'A Universe of premium soundscapes, event lighting, and modular truss rigs engineered for weddings, festivals, and concerts.',
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
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <head>
        <link rel="preload" href="/Logo.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className="min-h-full bg-black text-white flex flex-col font-sans select-none overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script 
          src="https://unpkg.com/@lottiefiles/lottie-player@2.0.4/dist/lottie-player.js" 
          strategy="beforeInteractive" 
        />
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
