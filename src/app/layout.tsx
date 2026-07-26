import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Manrope, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import VisualFeedbackWidget from '@/components/VisualFeedbackWidget';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${instrumentSerif.variable} dark h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/Parth Logo .json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Parth logo .png" as="image" />
        <link rel="icon" href="/Parth logo .png?v=5" type="image/png" />
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
