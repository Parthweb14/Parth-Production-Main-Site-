import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/utils/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}

export const dynamic = 'force-dynamic';
