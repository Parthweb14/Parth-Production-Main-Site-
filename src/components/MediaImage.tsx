'use client';

import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
};

/** Plain img with one fallback hop — avoids next/image wipe on bad remote URLs. */
export default function MediaImage({ src, alt, className, fallback }: Props) {
  const [failedFor, setFailedFor] = useState<string | null>(null);
  const current = failedFor === src && fallback ? fallback : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (fallback && failedFor !== src) setFailedFor(src);
      }}
    />
  );
}
