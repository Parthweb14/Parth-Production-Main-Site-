import { NextResponse } from 'next/server';
import { enforceRateLimit, rateLimitResponse } from '@/utils/rateLimit';
import { safeErrorMessage } from '@/utils/auth';

/** Feedback widget removed from UI — keep endpoint locked down against abuse. */
export async function POST(request: Request) {
  try {
    const limited = await enforceRateLimit(request, 'feedback', {
      limit: 5,
      windowMs: 15 * 60 * 1000,
      lockAfter: 10,
      failClosed: true,
    });
    if (!limited.ok) return rateLimitResponse(limited);

    const body = await request.json().catch(() => null);
    const notes = typeof body?.notes === 'string' ? body.notes.slice(0, 8000) : '';
    if (!notes.trim()) {
      return NextResponse.json({ error: 'Notes required.' }, { status: 400 });
    }

    // Do not persist or echo feedback content.
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Not found.' }, { status: 404 });
}

export const dynamic = 'force-dynamic';
