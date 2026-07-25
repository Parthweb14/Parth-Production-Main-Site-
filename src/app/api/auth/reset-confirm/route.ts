import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { otp, token, newUsername, newPassword } = await request.json();

    const inputCode = otp || token;
    if (!inputCode || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'Missing 6-digit OTP, new username, or new password.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    const dbOtp = credentials.otpCode || credentials.resetToken;
    const dbExpiry = credentials.otpExpiry || credentials.resetTokenExpiry || 0;

    if (!dbOtp || dbOtp.trim() !== inputCode.trim()) {
      return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
    }

    if (Date.now() > dbExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    // Update credentials
    credentials.username = newUsername;
    credentials.passwordHash = newPassword;
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Admin credentials updated successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
