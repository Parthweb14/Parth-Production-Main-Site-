import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import {
  ADMIN_COOKIE,
  assertSameOrigin,
  createSessionToken,
  hashPassword,
  passwordMeetsPolicy,
  PASSWORD_POLICY_MSG,
  requireAdmin,
  safeErrorMessage,
  sessionCookieOptions,
  verifyOtp,
} from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';

const GENERIC_FAIL = { error: 'Invalid or expired verification code.' };

export async function POST(request: Request) {
  try {
    const originBlock = assertSameOrigin(request);
    if (originBlock) return originBlock;

    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const limited = await enforceRateLimit(request, 'change-credentials', {
      limit: 8,
      windowMs: 15 * 60 * 1000,
      lockAfter: 12,
      identity: auth.username,
      failClosed: true,
    });
    if (!limited.ok) return rateLimitResponse(limited);

    const { otp, newUsername, newPassword } = await request.json();

    if (
      !otp ||
      !newUsername ||
      !newPassword ||
      typeof newUsername !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    if (!passwordMeetsPolicy(newPassword)) {
      return NextResponse.json({ error: PASSWORD_POLICY_MSG }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    if (!credentials.otpCode || !credentials.otpExpiry) {
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }
    if (Date.now() > credentials.otpExpiry) {
      credentials.otpCode = null;
      credentials.otpExpiry = null;
      await vercelDb.setCredentials(credentials);
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    const attempts = credentials.otpAttempts || 0;
    if (attempts >= 5) {
      credentials.otpCode = null;
      credentials.otpExpiry = null;
      credentials.otpAttempts = 0;
      await vercelDb.setCredentials(credentials);
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    if (!verifyOtp(String(otp), credentials.otpCode)) {
      credentials.otpAttempts = attempts + 1;
      await vercelDb.setCredentials(credentials);
      return NextResponse.json(GENERIC_FAIL, { status: 401 });
    }

    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.otpAttempts = 0;
    credentials.username = newUsername.trim();
    credentials.passwordHash = hashPassword(newPassword);
    credentials.resetCount = (credentials.resetCount || 0) + 1;
    credentials.credentialsVersion = (credentials.credentialsVersion || 0) + 1;
    credentials.emailVerifiedAt = Date.now();
    credentials.active = true;

    await vercelDb.setCredentials(credentials);

    const token = await createSessionToken(
      credentials.username,
      credentials.credentialsVersion ?? 0
    );
    const response = NextResponse.json({
      success: true,
      resetCount: credentials.resetCount,
      user: {
        id: 'admin',
        username: credentials.username,
      },
    });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (err: unknown) {
    console.error('Change credentials error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
