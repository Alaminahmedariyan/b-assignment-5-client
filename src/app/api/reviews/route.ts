import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'You must be logged in.' },
      { status: 401 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, statusCode: 400, message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Reviews POST proxy failed:', error);
    return NextResponse.json(
      { success: false, statusCode: 502, message: 'Backend unreachable.' },
      { status: 502 },
    );
  }
}