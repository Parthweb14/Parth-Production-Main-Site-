import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(req: Request) {
  try {
    const { testEmail, smtp_host, smtp_port, smtp_user, smtp_pass, from_email } = await req.json();

    if (!testEmail) {
      return NextResponse.json({ error: 'Please provide a recipient test email address.' }, { status: 400 });
    }

    // Use passed settings or fallback to saved database settings
    const settings = await vercelDb.getSettings();
    const host = smtp_host || settings.smtp_host || 'smtp-relay.brevo.com';
    const port = parseInt(smtp_port || settings.smtp_port || '587', 10);
    const user = smtp_user || settings.smtp_user;
    const pass = smtp_pass || settings.smtp_pass;
    const from = from_email || settings.from_email || 'parthproductionweb@gmail.com';

    if (!user || !pass) {
      return NextResponse.json({ error: 'SMTP Username and Password are required to send emails.' }, { status: 400 });
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
      from: `Parth Production <${from}>`,
      to: testEmail,
      subject: 'Parth Production - Test Email Notification',
      text: `Hello!\n\nThis is a test email from your Parth Production Admin Dashboard.\nYour SMTP settings (Host: ${host}, Port: ${port}) are configured correctly!\n\nBest regards,\nParth Production Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0d0d11; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #d4af37; margin-top: 0;">SMTP Connection Verified! ✅</h2>
          <p style="font-size: 14px; color: #cccccc;">This is a test email from your <strong>Parth Production Admin Dashboard</strong>.</p>
          <div style="background-color: #17171e; padding: 15px; border-radius: 8px; border: 1px solid #2e2e3a; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 13px; color: #a1a1aa;"><strong>SMTP Host:</strong> ${host}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #a1a1aa;"><strong>Port:</strong> ${port}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #a1a1aa;"><strong>From Address:</strong> ${from}</p>
          </div>
          <p style="font-size: 12px; color: #71717a;">Sent successfully via NodeMailer & custom SMTP relay.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: `Test email sent successfully to ${testEmail}` });
  } catch (err: any) {
    console.error('SMTP Test Email Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send test email.' }, { status: 500 });
  }
}
