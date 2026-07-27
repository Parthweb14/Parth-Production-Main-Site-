import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import {
  hashPassword,
  passwordMeetsPolicy,
  PASSWORD_POLICY_MSG,
  safeErrorMessage,
  verifyRecoveryKey,
} from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';
import { captchaConfigured, verifyCaptchaToken } from '@/utils/captcha';

const GENERIC_FAIL = { error: 'Unable to reset password with the provided details.' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recoveryKey = body.recoveryKey;
    const newPassword = body.newPassword;
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : null;

    const limited = await enforceRateLimit(request, 'recovery-reset', {
      limit: 5,
      windowMs: 60 * 60 * 1000,
      lockAfter: 8,
      lockMs: 2 * 60 * 60 * 1000,
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
      !recoveryKey ||
      !newPassword ||
      typeof recoveryKey !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return NextResponse.json(GENERIC_FAIL, { status: 401 });
    }

    if (!passwordMeetsPolicy(newPassword)) {
      return NextResponse.json({ error: PASSWORD_POLICY_MSG }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();
    const ok = verifyRecoveryKey(recoveryKey, credentials.recoveryKeyHash);

    if (!ok) {
      return NextResponse.json(GENERIC_FAIL, { status: 401 });
    }

    credentials.passwordHash = hashPassword(newPassword);
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.otpAttempts = 0;
    credentials.resetCount = (credentials.resetCount || 0) + 1;
    credentials.credentialsVersion = (credentials.credentialsVersion || 0) + 1;
    credentials.active = true;
    delete credentials.recoveryKey;
    delete credentials.recoveryKeys;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err: unknown) {
    console.error('Recovery reset error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
