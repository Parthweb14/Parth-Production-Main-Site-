import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { hashPassword, safeErrorMessage } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { otp, token, newUsername, newPassword } = await request.json();
    const inputCode = otp || token;

    if (
      !inputCode ||
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
    const dbOtp = credentials.otpCode || credentials.resetToken;
    const dbExpiry = credentials.otpExpiry || credentials.resetTokenExpiry || 0;

    if (!dbOtp || dbOtp.trim() !== String(inputCode).trim() || Date.now() > dbExpiry) {
      return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
    }

    credentials.username = newUsername.trim();
    credentials.passwordHash = hashPassword(newPassword);
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.resetCount = (credentials.resetCount || 0) + 1;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Admin credentials updated successfully.' });
  } catch (err: unknown) {
    console.error('Reset confirm error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
