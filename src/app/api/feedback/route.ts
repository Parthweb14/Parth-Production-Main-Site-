import { NextResponse } from 'next/server';
import { requireAdmin, safeErrorMessage } from '@/utils/auth';

// Feedback is admin-only; filesystem writes are unreliable on serverless.
export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    console.info('Admin feedback received', {
      page: typeof body?.page === 'string' ? body.page.slice(0, 200) : '/',
      notes: typeof body?.notes === 'string' ? body.notes.slice(0, 2000) : '',
      rating: typeof body?.rating === 'number' ? body.rating : null,
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json({ feedback: [] });
}

export const dynamic = 'force-dynamic';
