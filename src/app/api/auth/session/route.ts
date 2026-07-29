import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, clearSessionCookieOptions, verifySessionToken } from '@/utils/auth';
import { vercelDb } from '@/utils/vercelDb';

export async function GET() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    res.cookies.set(ADMIN_COOKIE, '', clearSessionCookieOptions());
    return res;
  }

  try {
    const creds = await vercelDb.getCredentials();
    if ((creds.credentialsVersion ?? 0) !== session.credentialsVersion) {
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      res.cookies.set(ADMIN_COOKIE, '', clearSessionCookieOptions());
      return res;
    }
  } catch {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    res.cookies.set(ADMIN_COOKIE, '', clearSessionCookieOptions());
    return res;
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: 'admin', username: session.username },
  });
}

export const dynamic = 'force-dynamic';
