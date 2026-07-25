import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const settings = await vercelDb.getSettings();
    const credentials = await vercelDb.getCredentials();

    // Verify if email matches admin contact email, admin username, or the official admin gmail
    const isEmailMatch = 
      email.toLowerCase() === settings.email.toLowerCase() || 
      email.toLowerCase() === credentials.username.toLowerCase() ||
      email.toLowerCase() === (settings.from_email || '').toLowerCase() ||
      email.toLowerCase() === 'parthproductionweb@gmail.com' ||
      email.toLowerCase() === 'parthproduction123@gmail.com';

    if (!isEmailMatch) {
      return NextResponse.json({ error: 'No admin account found with that email address.' }, { status: 404 });
    }

    // Generate 6-digit OTP & 10-minute expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    // Save OTP to DB
    credentials.otpCode = otp;
    credentials.otpExpiry = otpExpiry;
    await vercelDb.setCredentials(credentials);

    // Send OTP via SMTP if configured
    const host = settings.smtp_host || 'smtp-relay.brevo.com';
    const port = parseInt(settings.smtp_port || '587', 10);
    const user = settings.smtp_user;
    const pass = settings.smtp_pass;
    const recipientEmail = settings.from_email || settings.email || 'parthproductionweb@gmail.com';

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: host,
          port: port,
          secure: port === 465,
          auth: { user, pass },
        });

        await transporter.sendMail({
          from: `Parth Production Admin Security <${recipientEmail}>`,
          to: recipientEmail,
          subject: `🔑 Password Reset OTP: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #0d0f19; color: #ffffff; border-radius: 16px; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #d4af37; margin-top: 0;">Password Reset OTP</h2>
              <p style="font-size: 14px; color: #a1a1aa;">Use the following 6-digit OTP to reset your Parth Production admin password:</p>
              <div style="background-color: #161926; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: 800; color: #f59e0b; letter-spacing: 6px;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #71717a;">Valid for 10 minutes.</p>
            </div>
          `,
        });
      } catch (smtpErr) {
        console.error('SMTP email send error:', smtpErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `OTP sent to your email (${recipientEmail}).`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
