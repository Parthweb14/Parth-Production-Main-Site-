import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';
import {
  generateOtp,
  hashOtp,
  normalizeIdentity,
} from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';
import { captchaConfigured, verifyCaptchaToken } from '@/utils/captcha';
import { assertSafeSmtpHost } from '@/utils/smtpSafety';

/** Identical wording whether or not the account exists. */
const GENERIC = { success: true, message: 'If that account exists, a reset code was sent.' };

export async function POST(request: Request) {
  const started = Date.now();
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email : '';
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : null;

    const limited = await enforceRateLimit(request, 'reset-request', {
      limit: 3,
      windowMs: 60 * 60 * 1000,
      lockAfter: 5,
      lockMs: 60 * 60 * 1000,
      identity: email,
      failClosed: true,
    });
    if (!limited.ok) {
      if (limited.locked && captchaConfigured()) {
        const captcha = await verifyCaptchaToken(captchaToken, request);
        if (!captcha.ok) return rateLimitResponse(limited);
      } else {
        return rateLimitResponse(limited);
      }
    }

    const settings = await vercelDb.getSettings();
    const credentials = await vercelDb.getCredentials();

    // Only configured admin identities — no hardcoded public emails
    const candidates = [settings.email, credentials.username, settings.from_email]
      .filter(Boolean)
      .map((v) => normalizeIdentity(String(v)));

    const isEmailMatch = email ? candidates.includes(normalizeIdentity(email)) : false;

    if (isEmailMatch) {
      const host = await assertSafeSmtpHost(settings.smtp_host || 'smtp-relay.brevo.com');
      const port = parseInt(settings.smtp_port || '587', 10);
      const user = settings.smtp_user;
      const pass = settings.smtp_pass;
      const recipientEmail = settings.from_email || settings.email;

      if (user && pass && recipientEmail) {
        const otp = generateOtp();
        try {
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
          });

          await transporter.sendMail({
            from: `Parth Production Admin Security <${recipientEmail}>`,
            to: recipientEmail,
            subject: 'Password reset verification code',
            text: `Your password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
            html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
          });

          // Persist HASH only after successful send — never plaintext OTP
          credentials.otpCode = hashOtp(otp);
          credentials.otpExpiry = Date.now() + 10 * 60 * 1000;
          credentials.otpAttempts = 0;
          credentials.resetToken = null;
          credentials.resetTokenExpiry = null;
          await vercelDb.setCredentials(credentials);
        } catch {
          console.error('SMTP email send error');
          // Do not reveal SMTP failure details; still return GENERIC
        }
      }
    }

    // Pad timing so miss vs hit is harder to distinguish
    const elapsed = Date.now() - started;
    if (elapsed < 400) {
      await new Promise((r) => setTimeout(r, 400 - elapsed));
    }

    return NextResponse.json(GENERIC);
  } catch (err: unknown) {
    console.error('Reset request error:', err);
    // Still avoid enumeration on errors
    return NextResponse.json(GENERIC);
  }
}

export const dynamic = 'force-dynamic';
