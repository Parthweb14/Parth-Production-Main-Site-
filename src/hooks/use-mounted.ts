'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => undefined;

/** Avoid hydration mismatches for client-only UI (theme toggles, portals). */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
