import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import {
  ADMIN_COOKIE,
  createSessionToken,
  hashPassword,
  isHashedPassword,
  normalizeIdentity,
  safeErrorMessage,
  sessionCookieOptions,
  verifyPasswordAntiEnum,
} from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';
import { captchaConfigured, verifyCaptchaToken } from '@/utils/captcha';

const GENERIC_FAIL = { error: 'Invalid login credentials.' };

export async function POST(request: Request) {
  const started = Date.now();
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : null;

    const limited = await enforceRateLimit(request, 'login', {
      limit: 8,
      windowMs: 15 * 60 * 1000,
      lockAfter: 12,
      lockMs: 30 * 60 * 1000,
      identity: email,
    });
    if (!limited.ok) {
      if (limited.locked && captchaConfigured()) {
        const captcha = await verifyCaptchaToken(captchaToken, request);
        if (!captcha.ok) return rateLimitResponse(limited);
        // CAPTCHA passed — allow this attempt through without clearing lock entirely
      } else {
        return rateLimitResponse(limited);
      }
    }

    if (!email || !password) {
      return NextResponse.json(GENERIC_FAIL, { status: 401 });
    }

    const credentials = await vercelDb.getCredentials();
    const userMatched =
      normalizeIdentity(email) === normalizeIdentity(credentials.username);

    // Always run slow verify (dummy hash if user unknown) — kills timing enumeration
    const passwordOk = verifyPasswordAntiEnum(password, credentials.passwordHash, userMatched);

    // Inactive accounts (awaiting email ownership proof) fail with same message
    const accountActive = credentials.active !== false;

    if (!passwordOk || !accountActive) {
      const elapsed = Date.now() - started;
      if (elapsed < 350) {
        await new Promise((r) => setTimeout(r, 350 - elapsed));
      }
      return NextResponse.json(GENERIC_FAIL, { status: 401 });
    }

    // Migrate legacy plaintext / old scrypt params on successful login
    if (!isHashedPassword(credentials.passwordHash)) {
      credentials.passwordHash = hashPassword(password);
      await vercelDb.setCredentials(credentials);
    }

    const token = await createSessionToken(
      credentials.username,
      credentials.credentialsVersion ?? 0
    );
    const response = NextResponse.json({
      success: true,
      user: {
        id: 'admin',
        username: credentials.username,
      },
    });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    return NextResponse.json({ error: safeErrorMessage(err, 'Login failed.') }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
