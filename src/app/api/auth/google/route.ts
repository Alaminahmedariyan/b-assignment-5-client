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
  let body: { idToken?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request body.',
      },
      {
        status: 400,
      }
    );
  }

  const { idToken } = body;

  if (!idToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing Google token.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const backendResponse = await fetch(
      `${env.backendApiUrl}/api/v1/auth/google`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      }
    );

    const data: GoogleLoginResponse = await backendResponse.json();

    console.log('Backend Status:', backendResponse.status);
console.log('Backend Response:', data);

    if (!backendResponse.ok || !data.success || !data.data) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

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
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({
      success: true,
      message: data.message,
      role: data.data.role,
    });
  } catch (error) {
    console.error('Google login error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      {
        status: 500,
      }
    );
  }
}