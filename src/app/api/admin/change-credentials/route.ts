import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { hashPassword, requireAdmin, safeErrorMessage } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const { otp, newUsername, newPassword } = await request.json();

    if (
      !otp ||
      !newUsername ||
      !newPassword ||
      typeof newUsername !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 8
    ) {
      return NextResponse.json(
        { error: 'OTP, new username, and new password (min 8 chars) are required.' },
        { status: 400 }
      );
    }

    const credentials = await vercelDb.getCredentials();

    if (!credentials.otpCode || !credentials.otpExpiry) {
      return NextResponse.json({ error: 'No OTP requested. Send an OTP first.' }, { status: 400 });
    }
    if (Date.now() > credentials.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Request a new OTP.' }, { status: 400 });
    }
    if (credentials.otpCode.trim() !== String(otp).trim()) {
      return NextResponse.json({ error: 'Invalid OTP code.' }, { status: 401 });
    }

    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.username = newUsername.trim();
    credentials.passwordHash = hashPassword(newPassword);
    credentials.resetCount = (credentials.resetCount || 0) + 1;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({
      success: true,
      resetCount: credentials.resetCount,
    });
  } catch (err: unknown) {
    console.error('Change credentials error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
