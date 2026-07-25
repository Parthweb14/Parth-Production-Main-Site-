import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(req: Request) {
  try {
    const creds = await vercelDb.getCredentials();
    const settings = await vercelDb.getSettings();

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to credentials database
    creds.otpCode = otp;
    creds.otpExpiry = expiry;
    await vercelDb.setCredentials(creds);

    // 2. Prepare SMTP Transporter
    const host = settings.smtp_host || 'smtp-relay.brevo.com';
    const port = parseInt(settings.smtp_port || '587', 10);
    const user = settings.smtp_user;
    const pass = settings.smtp_pass;
    const recipientEmail = settings.from_email || settings.email || 'parthproductionweb@gmail.com';

    if (!user || !pass) {
      return NextResponse.json({ 
        error: 'SMTP is not fully configured. Please fill in your SMTP Username and Password in Admin Settings first.' 
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `Parth Production Admin Security <${recipientEmail}>`,
      to: recipientEmail,
      subject: `🔑 Admin Verification Code: ${otp}`,
      text: `Hello Admin,\n\nYour One-Time Password (OTP) to update your admin username and password is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share this code with anyone.\n\nBest regards,\nParth Production Security Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #0d0f19; color: #ffffff; border-radius: 16px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #d4af37; margin-top: 0;">Verification Code Required</h2>
          <p style="font-size: 14px; color: #a1a1aa; leading-height: 1.6;">You requested to change your Admin credentials at <strong>Parth Production</strong>.</p>
          <div style="background-color: #161926; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; text-transform: uppercase; tracking: 2px; color: #71717a; font-weight: bold; display: block; margin-bottom: 8px;">Your 6-Digit OTP</span>
            <span style="font-size: 32px; font-weight: 800; color: #f59e0b; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #71717a;">This OTP is valid for 10 minutes. If you did not request this change, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: `OTP sent successfully to ${recipientEmail}` 
    });
  } catch (err: any) {
    console.error('Send OTP Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send OTP email via SMTP.' }, { status: 500 });
  }
}
