import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import {
  ADMIN_COOKIE,
  createSessionToken,
  hashPassword,
  isHashedPassword,
  safeErrorMessage,
  sessionCookieOptions,
  verifyPassword,
} from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }

    const credentials = await vercelDb.getCredentials();
    const isUserMatch =
      email === credentials.username ||
      email === 'parthproductionweb@gmail.com' ||
      email === 'admin';

    if (!isUserMatch || !verifyPassword(password, credentials.passwordHash)) {
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }

    // Migrate legacy plaintext passwords to scrypt on successful login
    if (!isHashedPassword(credentials.passwordHash)) {
      credentials.passwordHash = hashPassword(password);
      await vercelDb.setCredentials(credentials);
    }

    const token = await createSessionToken(credentials.username);
    const response = NextResponse.json({
      success: true,
      user: {
        id: 'admin-id-1',
        email: 'parthproductionweb@gmail.com',
      },
    });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    return NextResponse.json({ error: safeErrorMessage(err, 'Login failed.') }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
