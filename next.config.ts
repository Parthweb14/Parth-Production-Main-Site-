import type { NextConfig } from "next";

const r2PublicUrl = process.env.R2_PUBLIC_URL || 'https://assets.kadamproduction.in';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.kadamproduction.in',
      },
    ],
    minimumCacheTTL: 31536000,
    formats: ['image/webp', 'image/avif'],
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
