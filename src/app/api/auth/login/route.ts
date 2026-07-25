import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const credentials = await vercelDb.getCredentials();

    // Match username OR default email, and password
    const isUserMatch = email === credentials.username || email === 'parthproductionweb@gmail.com' || email === 'admin';
    const isPassMatch = password === credentials.passwordHash;

    if (isUserMatch && isPassMatch) {
      // Create a 24-hour expiration token
      const payload = {
        username: credentials.username,
        exp: Date.now() + 24 * 60 * 60 * 1000
      };
      const token = Buffer.from(JSON.stringify(payload)).toString('base64');
      
      return NextResponse.json({ 
        success: true, 
        token, 
        user: { 
          id: 'admin-id-1', 
          email: 'parthproductionweb@gmail.com' 
        } 
      });
    }

    return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
