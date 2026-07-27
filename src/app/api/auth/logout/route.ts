import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, clearSessionCookieOptions } from '@/utils/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', clearSessionCookieOptions());
  return res;
}

export const dynamic = 'force-dynamic';
