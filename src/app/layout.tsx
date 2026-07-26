import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Parth Production | One Stop Solution For Unforgettable Moments',
  description:
    'Sound, light, SFX, truss, fireworks, and DJ production for weddings, festivals, concerts, and corporate events across India.',
  keywords: [
    'Parth Production',
    'event production',
    'sound system',
    'stage lighting',
    'SFX',
    'truss',
    'fireworks',
    'DJ',
    'Gujarat',
  ],
  icons: {
    icon: [
      { url: '/favicon-96x96.png?v=5', sizes: '96x96', type: 'image/png' },
      { url: '/Parth logo .png?v=5', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=5',
    apple: [{ url: '/apple-touch-icon.png?v=5', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} dark h-full antialiased`}>
      <head>
        <link rel="preload" href="/Parth Logo .json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Parth logo .png" as="image" />
        <link rel="icon" href="/Parth logo .png?v=5" type="image/png" />
      </head>
      <body className="min-h-full bg-[#050505] text-white flex flex-col font-sans overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
