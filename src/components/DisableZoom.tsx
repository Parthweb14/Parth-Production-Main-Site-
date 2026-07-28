'use client';

import { useEffect } from 'react';

/**
 * Locks pinch / gesture zoom on mobile for main site and admin.
 * Complements viewport maximumScale / userScalable=false.
 * Avoids blocking normal single-finger taps and buttons.
 */
export default function DisableZoom() {
  useEffect(() => {
    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener('gesturestart', preventGesture, { passive: false });
    document.addEventListener('gesturechange', preventGesture, { passive: false });
    document.addEventListener('gestureend', preventGesture, { passive: false });

    const preventMultiTouch = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    document.addEventListener('touchmove', preventMultiTouch, { passive: false });

    // Block double-tap zoom, but never on interactive controls
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          'a, button, input, textarea, select, label, [role="button"], [contenteditable="true"]'
        )
      ) {
        lastTouchEnd = Date.now();
        return;
      }
      const now = Date.now();
      if (now - lastTouchEnd <= 280) event.preventDefault();
      lastTouchEnd = now;
    };
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
      document.removeEventListener('touchmove', preventMultiTouch);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  return null;
}
