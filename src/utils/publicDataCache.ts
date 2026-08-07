/**
 * Shared in-browser cache for /api/public/data so homepage sections
 * (auth, carousels, footer, craft) don't each hit the network.
 */
type PublicData = Record<string, unknown>;

let inflight: Promise<PublicData> | null = null;
let cached: PublicData | null = null;
let cachedAt = 0;

const TTL_MS = 45_000;

export async function fetchPublicData(opts?: { force?: boolean }): Promise<PublicData> {
  const now = Date.now();
  if (!opts?.force && cached && now - cachedAt < TTL_MS) {
    return cached;
  }
  if (!opts?.force && inflight) return inflight;

  inflight = fetch('/api/public/data')
    .then(async (res) => {
      if (!res.ok) throw new Error(`public data ${res.status}`);
      const data = (await res.json()) as PublicData;
      cached = data;
      cachedAt = Date.now();
      return data;
    })
    .catch((err) => {
      cached = null;
      cachedAt = 0;
      throw err;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function clearPublicDataCache() {
  cached = null;
  cachedAt = 0;
  inflight = null;
}
