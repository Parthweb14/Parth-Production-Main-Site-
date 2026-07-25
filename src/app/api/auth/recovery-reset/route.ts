import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { hashPassword, safeErrorMessage, verifyRecoveryKey } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { recoveryKey, newPassword } = await request.json();

    if (
      !recoveryKey ||
      !newPassword ||
      typeof recoveryKey !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 8
    ) {
      return NextResponse.json(
        { error: 'Recovery key and a new password (min 8 chars) are required.' },
        { status: 400 }
      );
    }

    const credentials = await vercelDb.getCredentials();
    const ok = verifyRecoveryKey(recoveryKey, credentials.recoveryKeyHash);

    if (!ok) {
      return NextResponse.json({ error: 'Invalid recovery key.' }, { status: 401 });
    }

    credentials.passwordHash = hashPassword(newPassword);
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.otpCode = null;
    credentials.otpExpiry = null;
    credentials.resetCount = (credentials.resetCount || 0) + 1;
    // Clear any legacy plaintext recovery keys from stored credentials
    delete credentials.recoveryKey;
    delete credentials.recoveryKeys;

    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err: unknown) {
    console.error('Recovery reset error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
