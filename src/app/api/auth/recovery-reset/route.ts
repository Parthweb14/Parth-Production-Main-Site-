import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { recoveryKey, newPassword } = await request.json();

    if (!recoveryKey || !newPassword) {
      return NextResponse.json({ error: 'Recovery Key and New Password are required.' }, { status: 400 });
    }

    const credentials = await vercelDb.getCredentials();

    // Support multiple keys (db array recoveryKeys or single fallback list)
    const dbRecoveryKeys: string[] = credentials.recoveryKeys || [
      credentials.recoveryKey || 'KP-777-RESET',
      'KP-KADAM-RECOVER-99',
      'KP-SECURE-ADMIN-77'
    ];

    const isMatch = dbRecoveryKeys.some((k: string) => k.trim().toLowerCase() === recoveryKey.trim().toLowerCase());

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Master Recovery Key.' }, { status: 401 });
    }

    // Update password
    credentials.passwordHash = newPassword;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    credentials.resetCount = 0;
    
    await vercelDb.setCredentials(credentials);

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
