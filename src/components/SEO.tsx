'use client';

import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
};

const SITE_URL = 'https://parthproduction.in';
const DEFAULT_TITLE = 'Parth Production | Premium DJ, Sound & Lighting Events';
const DEFAULT_DESCRIPTION =
  'Parth Production offers full-stack live event production. Premium DJ, sound systems, lighting, SFX, and truss for weddings, concerts, and corporate events in India.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Reusable per-page SEO tags via react-helmet-async.
 * Prefer Next.js `metadata` exports in layouts for crawler-critical pages;
 * use this for client-driven title/description updates.
 */
export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = `${SITE_URL}/`,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  const fullTitle = title.includes('Parth Production') ? title : `${title} | Parth Production`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}

export { SEO };
