import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  };
}

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: 'Missing Google token.' },
      { status: 400 },
    );
  }

  // Server-to-server call to the backend — no accessToken cookie exists
  // yet, since this IS the login step.
  const backendResponse = await fetch(
    `${env.backendApiUrl}/api/v1/auth/google`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  );

  const data: GoogleLoginResponse = await backendResponse.json();

  if (!backendResponse.ok || !data.success || !data.data) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  // Read tokens straight from the JSON body and set our own cookies —
  // the same proven approach loginAction already uses for email/password
  // login, since Set-Cookie headers from a server-to-server fetch don't
  // reach the browser automatically.
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set('accessToken', data.data.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  cookieStore.set('refreshToken', data.data.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    success: true,
    message: data.message,
    role: data.data.role,
  });
}