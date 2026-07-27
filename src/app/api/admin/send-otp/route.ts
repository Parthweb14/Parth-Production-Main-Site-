import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';
import { generateOtp, hashOtp, requireAdmin, safeErrorMessage } from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    const limited = await enforceRateLimit(req, 'admin-send-otp', {
      limit: 5,
      windowMs: 60 * 60 * 1000,
      lockAfter: 8,
      lockMs: 60 * 60 * 1000,
      identity: auth.username,
    });
    if (!limited.ok) return rateLimitResponse(limited);

    const creds = await vercelDb.getCredentials();
    const settings = await vercelDb.getSettings();

    const host = settings.smtp_host || 'smtp-relay.brevo.com';
    const port = parseInt(settings.smtp_port || '587', 10);
    const user = settings.smtp_user;
    const pass = settings.smtp_pass;
    const recipientEmail = settings.from_email || settings.email;

    if (!user || !pass || !recipientEmail) {
      return NextResponse.json(
        { error: 'SMTP is not fully configured in Admin Settings.' },
        { status: 400 }
      );
    }

    const otp = generateOtp();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `Parth Production Admin Security <${recipientEmail}>`,
      to: recipientEmail,
      subject: 'Admin verification code',
      text: `Your verification code is ${otp}. Valid for 10 minutes.`,
      html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>Valid for 10 minutes.</p>`,
    });

    // Hash-only storage after successful send
    creds.otpCode = hashOtp(otp);
    creds.otpExpiry = Date.now() + 10 * 60 * 1000;
    creds.otpAttempts = 0;
    await vercelDb.setCredentials(creds);

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err: unknown) {
    console.error('Send OTP Error:', err);
    return NextResponse.json({ error: safeErrorMessage(err, 'Failed to send OTP.') }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
