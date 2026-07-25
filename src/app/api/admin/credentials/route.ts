import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { requireAdmin, safeErrorMessage } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const credentials = await vercelDb.getCredentials();
    return NextResponse.json({
      username: credentials.username,
      resetCount: credentials.resetCount || 0,
      resetPeriodStart: credentials.resetPeriodStart || null,
      hasPassword: Boolean(credentials.passwordHash),
    });
  } catch (err: unknown) {
    console.error('Credentials error:', err);
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
