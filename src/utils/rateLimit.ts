import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { vercelDb } from '@/utils/vercelDb';

type Bucket = {
  count: number;
  resetAt: number;
  lockedUntil?: number;
};

function clientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0]!.trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

function bucketKey(scope: string, id: string): string {
  const hash = createHash('sha256').update(`${scope}:${id}`).digest('hex').slice(0, 32);
  return `rl_${scope}_${hash}`;
}

async function readBucket(key: string): Promise<Bucket> {
  try {
    const raw = (await vercelDb.getRateLimit(key)) as Bucket | null;
    if (!raw || typeof raw !== 'object') return { count: 0, resetAt: 0 };
    return raw;
  } catch {
    return { count: 0, resetAt: 0 };
  }
}

async function writeBucket(key: string, bucket: Bucket): Promise<void> {
  try {
    await vercelDb.setRateLimit(key, bucket);
  } catch (err) {
    console.error('rateLimit write failed', err);
  }
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number; locked: boolean };

/**
 * Fixed-window limiter backed by Turso KV.
 * After lockAfter failures, sets lockedUntil (CAPTCHA / wait required).
 */
export async function enforceRateLimit(
  request: Request,
  scope: string,
  opts: {
    limit: number;
    windowMs: number;
    lockAfter?: number;
    lockMs?: number;
    identity?: string;
  }
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  const id = opts.identity ? `${ip}:${opts.identity.toLowerCase()}` : ip;
  const key = bucketKey(scope, id);
  const now = Date.now();
  const bucket = await readBucket(key);

  if (bucket.lockedUntil && bucket.lockedUntil > now) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((bucket.lockedUntil - now) / 1000),
      locked: true,
    };
  }

  if (!bucket.resetAt || now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + opts.windowMs;
    bucket.lockedUntil = undefined;
  }

  bucket.count += 1;

  const lockAfter = opts.lockAfter ?? opts.limit;
  if (bucket.count > lockAfter) {
    bucket.lockedUntil = now + (opts.lockMs ?? 15 * 60 * 1000);
    await writeBucket(key, bucket);
    return {
      ok: false,
      retryAfterSec: Math.ceil((bucket.lockedUntil - now) / 1000),
      locked: true,
    };
  }

  await writeBucket(key, bucket);

  if (bucket.count > opts.limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
      locked: false,
    };
  }

  return { ok: true, remaining: Math.max(0, opts.limit - bucket.count) };
}

export function rateLimitResponse(result: Extract<RateLimitResult, { ok: false }>) {
  return NextResponse.json(
    {
      error: result.locked
        ? 'Too many attempts. Temporarily locked. Complete CAPTCHA or try again later.'
        : 'Too many attempts. Please wait and try again.',
      retryAfterSec: result.retryAfterSec,
      captchaRequired: result.locked,
    },
    {
      status: 429,
      headers: { 'Retry-After': String(result.retryAfterSec) },
    }
  );
}
