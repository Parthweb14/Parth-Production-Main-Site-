import type { NextConfig } from "next";

const r2PublicUrl = process.env.R2_PUBLIC_URL || 'https://pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev';

let r2Hostname = 'pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev';
try {
  r2Hostname = new URL(r2PublicUrl).hostname;
} catch {
  // fallback
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.parthproduction.in',
      },
      {
        protocol: 'https',
        hostname: 'assets.kadamproduction.in',
      },
      {
        protocol: 'https',
        hostname: 'pub-f7e582206f9d4cf49fa1d710c6c8b5e9.r2.dev',
      },
      {
        protocol: 'https',
        hostname: r2Hostname,
      },
    ],
    minimumCacheTTL: 31536000,
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${r2PublicUrl}/images/:path*`,
      },
      {
        source: '/videos/:path*',
        destination: `${r2PublicUrl}/videos/:path*`,
      },
    ];
  },
};

export default nextConfig;
