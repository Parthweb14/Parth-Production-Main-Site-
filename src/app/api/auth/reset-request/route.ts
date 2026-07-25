import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';
import { generateOtp, safeErrorMessage } from '@/utils/auth';

const GENERIC = { success: true, message: 'If that account exists, a reset code was sent.' };

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json(GENERIC);
    }

    const settings = await vercelDb.getSettings();
    const credentials = await vercelDb.getCredentials();

    const isEmailMatch =
      email.toLowerCase() === settings.email.toLowerCase() ||
      email.toLowerCase() === credentials.username.toLowerCase() ||
      email.toLowerCase() === (settings.from_email || '').toLowerCase() ||
      email.toLowerCase() === 'parthproductionweb@gmail.com' ||
      email.toLowerCase() === 'parthproduction123@gmail.com';

    if (!isEmailMatch) {
      return NextResponse.json(GENERIC);
    }

    const otp = generateOtp();
    credentials.otpCode = otp;
    credentials.otpExpiry = Date.now() + 10 * 60 * 1000;
    await vercelDb.setCredentials(credentials);

    const host = settings.smtp_host || 'smtp-relay.brevo.com';
    const port = parseInt(settings.smtp_port || '587', 10);
    const user = settings.smtp_user;
    const pass = settings.smtp_pass;
    const recipientEmail = settings.from_email || settings.email;

    if (user && pass && recipientEmail) {
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
          text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
          html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
        });
      } catch (smtpErr) {
        console.error('SMTP email send error:', smtpErr);
      }
    }

    return NextResponse.json(GENERIC);
  } catch (err: unknown) {
    console.error('Reset request error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
