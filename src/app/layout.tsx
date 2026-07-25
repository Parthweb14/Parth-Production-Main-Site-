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
  title: 'Parth Production | Sound, Light & Stage',
  description:
    'Premium soundscapes, event lighting, and modular stage systems for weddings, festivals, and concerts across India.',
  keywords: [
    'Parth Production',
    'event management',
    'wedding production',
    'sound system',
    'lighting design',
    'Gujarat events',
  ],
  icons: {
    icon: [
      { url: '/favicon-96x96.png?v=4', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico?v=4',
    apple: [{ url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' }],
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
        <link rel="preload" href="/Logo.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className="min-h-full bg-black text-white flex flex-col font-sans overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
