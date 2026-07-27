import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export {
  generateOtp,
  generateResetToken,
  hashOtp,
  hashPassword,
  hashRecoveryKey,
  hashResetToken,
  isHashedPassword,
  passwordMeetsPolicy,
  PASSWORD_POLICY_MSG,
  verifyOtp,
  verifyPassword,
  verifyPasswordAntiEnum,
  verifyRecoveryKey,
  verifyResetToken,
} from './password';

const COOKIE_NAME = 'admin_token';
const SESSION_HOURS = 24;

function sessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  username: string,
  credentialsVersion = 0
): Promise<string> {
  return new SignJWT({ username, role: 'admin', cv: credentialsVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(sessionSecret());
}

export async function verifySessionToken(
  token: string
): Promise<{ username: string; credentialsVersion: number } | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    if (payload.role !== 'admin' || typeof payload.username !== 'string') return null;
    const cv = typeof payload.cv === 'number' ? payload.cv : 0;
    return { username: payload.username, credentialsVersion: cv };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_HOURS * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export function clearSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 0,
  };
}

export const ADMIN_COOKIE = COOKIE_NAME;

export async function getTokenFromRequest(request: Request | NextRequest): Promise<string | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  // Cookie-only sessions — do not accept Bearer (reduces token leakage surface)
  return null;
}

export async function requireAdmin(request: Request | NextRequest): Promise<
  { ok: true; username: string } | { ok: false; response: NextResponse }
> {
  const token = await getTokenFromRequest(request);
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) };
  }
  const session = await verifySessionToken(token);
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 }) };
  }

  try {
    const creds = await vercelDb.getCredentials();
    const currentCv = creds.credentialsVersion ?? 0;
    if (session.credentialsVersion !== currentCv) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Session revoked. Please sign in again.' }, { status: 401 }),
      };
    }
  } catch {
    /* if DB unavailable, fall through with JWT-only check */
  }

  return { ok: true, username: session.username };
}

export async function readServerSession(): Promise<{ username: string } | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function publicSettings<T extends Record<string, unknown>>(settings: T): Omit<T, 'smtp_pass' | 'smtp_user'> {
  const safe = { ...settings } as T & { smtp_pass?: string; smtp_user?: string };
  delete safe.smtp_pass;
  delete safe.smtp_user;
  return safe;
}

export function safeErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (process.env.NODE_ENV !== 'production' && err instanceof Error) return err.message;
  return fallback;
}

/** Normalize identity for comparisons without leaking via case branches. */
export function normalizeIdentity(value: string): string {
  return value.trim().toLowerCase();
}
