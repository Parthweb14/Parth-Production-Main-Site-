import { NextResponse } from 'next/server';
import { requireAdmin, safeErrorMessage } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notes = typeof body?.notes === 'string' ? body.notes.slice(0, 8000) : '';
    const page = typeof body?.page === 'string' ? body.page.slice(0, 200) : '/';
    if (!notes.trim()) {
      return NextResponse.json({ error: 'Notes required.' }, { status: 400 });
    }
    console.info('Visual feedback note', { page, notes });
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
