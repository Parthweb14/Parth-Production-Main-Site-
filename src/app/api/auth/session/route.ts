import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySessionToken } from '@/utils/auth';

export async function GET() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: 'admin-id-1', email: 'parthproductionweb@gmail.com', username: session.username },
  });
}

export const dynamic = 'force-dynamic';
