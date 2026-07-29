import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { vercelDb } from '@/utils/vercelDb';
import { assertSameOrigin, requireAdmin, safeErrorMessage } from '@/utils/auth';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';
import { assertSafeSmtpHost, assertSafeSmtpPort } from '@/utils/smtpSafety';

export async function POST(req: Request) {
  try {
    const originBlock = assertSameOrigin(req);
    if (originBlock) return originBlock;

    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    const limited = await enforceRateLimit(req, 'admin-test-smtp', {
      limit: 5,
      windowMs: 60 * 60 * 1000,
      lockAfter: 8,
      lockMs: 60 * 60 * 1000,
      identity: auth.username,
      failClosed: true,
    });
    if (!limited.ok) return rateLimitResponse(limited);

    const body = await req.json();
    const testEmail = body?.testEmail;
    if (!testEmail || typeof testEmail !== 'string') {
      return NextResponse.json({ error: 'Please provide a recipient test email address.' }, { status: 400 });
    }

    const settings = await vercelDb.getSettings();
    const rawHost = body.smtp_host || settings.smtp_host || 'smtp-relay.brevo.com';
    const host = await assertSafeSmtpHost(String(rawHost));
    const port = assertSafeSmtpPort(parseInt(body.smtp_port || settings.smtp_port || '587', 10));
    const user = body.smtp_user || settings.smtp_user;
    const pass =
      (typeof body.smtp_pass === 'string' && body.smtp_pass.trim()
        ? body.smtp_pass
        : settings.smtp_pass) || '';
    const from = body.from_email || settings.from_email || settings.email;

    if (!user || !pass || !from) {
      return NextResponse.json({ error: 'SMTP username, password, and from email are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `Parth Production <${from}>`,
      to: testEmail,
      subject: 'Parth Production - Test Email Notification',
      text: `SMTP test OK. Host: ${host}, Port: ${port}`,
      html: `<p>SMTP connection verified.</p><p>Host: ${host}<br/>Port: ${port}</p>`,
    });

    return NextResponse.json({ success: true, message: 'Test email sent successfully.' });
  } catch (err: unknown) {
    console.error('SMTP Test Email Error:', err);
    return NextResponse.json({ error: safeErrorMessage(err, 'Failed to send test email.') }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
