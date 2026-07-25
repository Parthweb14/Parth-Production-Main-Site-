import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token missing.' }, { status: 401 });
    }

    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (Date.now() > payload.exp) {
        return NextResponse.json({ error: 'Admin session expired. Please log in again.' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token.' }, { status: 401 });
    }

    const credentials = await vercelDb.getCredentials();
    return NextResponse.json({
      username: credentials.username,
      password: credentials.passwordHash,
      recoveryKey: credentials.recoveryKey || 'KP-777-RESET',
      resetCount: credentials.resetCount || 0,
      resetPeriodStart: credentials.resetPeriodStart || null
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
