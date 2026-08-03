import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import {
  hashPassword,
  normalizeIdentity,
  passwordMeetsPolicy,
  PASSWORD_POLICY_MSG,
  safeErrorMessage,
  sanitizePassword,
  verifyOtp,
  verifyResetToken,
} from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';
import { captchaConfigured, verifyCaptchaToken } from '@/utils/captcha';

const GENERIC_FAIL = { error: 'Invalid or expired verification code.' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputCode = body.otp || body.token;
    const newUsername = body.newUsername;
    const newPassword = body.newPassword;
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : null;

    const limited = await enforceRateLimit(request, 'reset-confirm', {
      limit: 5,
      windowMs: 15 * 60 * 1000,
      lockAfter: 8,
      lockMs: 60 * 60 * 1000,
    });
    if (!limited.ok) {
      if (limited.locked && captchaConfigured()) {
        const captcha = await verifyCaptchaToken(captchaToken, request);
        if (!captcha.ok) return rateLimitResponse(limited);
      } else {
        return rateLimitResponse(limited);
      }
    }

    if (
      !inputCode ||
      !newUsername ||
      !newPassword ||
      typeof newUsername !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    const cleanUsername = normalizeIdentity(newUsername);
    const cleanPassword = sanitizePassword(newPassword);
    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }
    if (!passwordMeetsPolicy(cleanPassword)) {
      return NextResponse.json({ error: PASSWORD_POLICY_MSG }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();
    const dbHash = credentials.otpCode || credentials.resetToken;
    const dbExpiry = credentials.otpExpiry || credentials.resetTokenExpiry || 0;

    if (!dbHash || Date.now() > dbExpiry) {
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    const attempts = credentials.otpAttempts || 0;
    if (attempts >= 5) {
      credentials.otpCode = null;
      credentials.otpExpiry = null;
      credentials.resetToken = null;
      credentials.resetTokenExpiry = null;
      credentials.otpAttempts = 0;
      await vercelDb.setCredentials(credentials);
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    const otpOk = verifyOtp(String(inputCode), credentials.otpCode || null);
    const tokenOk = verifyResetToken(String(inputCode), credentials.resetToken || null);
    if (!otpOk && !tokenOk) {
      credentials.otpAttempts = attempts + 1;
      await vercelDb.setCredentials(credentials);
      return NextResponse.json(GENERIC_FAIL, { status: 400 });
    }

    credentials.username = cleanUsername;
    credentials.passwordHash = hashPassword(cleanPassword);
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.otpAttempts = 0;
    credentials.resetCount = (credentials.resetCount || 0) + 1;
    credentials.credentialsVersion = (credentials.credentialsVersion || 0) + 1;
    credentials.emailVerifiedAt = Date.now();
    credentials.active = true;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Credentials updated successfully.' });
  } catch (err: unknown) {
    console.error('Reset confirm error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
