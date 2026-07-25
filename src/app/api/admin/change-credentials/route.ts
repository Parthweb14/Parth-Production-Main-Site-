import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { token, otp, newUsername, newPassword } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token missing.' }, { status: 401 });
    }

    // 1. Verify token
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (Date.now() > payload.exp) {
        return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session token.' }, { status: 401 });
    }

    if (!otp || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'OTP, New Username, and New Password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    // Verify OTP
    if (!credentials.otpCode || !credentials.otpExpiry) {
      return NextResponse.json({ error: 'No OTP requested. Please click "Send OTP to Email" first.' }, { status: 400 });
    }

    if (Date.now() > credentials.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    if (credentials.otpCode.trim() !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid 6-Digit OTP code. Please check your email inbox.' }, { status: 401 });
    }

    // Clear OTP after successful use
    credentials.otpCode = null;
    credentials.otpExpiry = null;

    // Update credentials (Unlimited changes allowed)
    credentials.username = newUsername;
    credentials.passwordHash = newPassword;
    credentials.resetCount = (credentials.resetCount || 0) + 1;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ 
      success: true, 
      resetCount: credentials.resetCount
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
