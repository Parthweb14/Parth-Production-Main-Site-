'use client';

import { useEffect, useRef } from 'react';

interface LottiePlayerProps {
  src: string;
  className?: string;
}

export default function LottiePlayer({ src, className }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let anim: any;

    // Dynamically import lottie-web to prevent SSR errors (window/document not defined)
    import('lottie-web').then((lottieModule) => {
      const lottie = lottieModule.default;
      if (!containerRef.current) return;
      
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: src,
      });
    });

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, [src]);

  return <div ref={containerRef} className={className} />;
}
