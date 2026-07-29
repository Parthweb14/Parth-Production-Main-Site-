import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ADMIN = new Set(['/admin/login', '/admin/reset-password']);

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') || PUBLIC_ADMIN.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token')?.value;
  const key = secretKey();

  if (!token || !key) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Enforce credentialsVersion via existing session API (fail closed).
    const sessionUrl = new URL('/api/auth/session', request.nextUrl.origin);
    const sessionRes = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      cache: 'no-store',
    });
    if (!sessionRes.ok) {
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.set('admin_token', '', { path: '/', maxAge: 0 });
      return res;
    }
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    res.cookies.set('admin_token', '', { path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
