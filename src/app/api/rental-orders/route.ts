// src/app/api/rental-orders/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/config/env';

export async function POST(request: Request) {
  const body = await request.json();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: 'You must be logged in to request a rental.' },
      { status: 401 },
    );
  }

  const response = await fetch(
    `${env.backendApiUrl}/api/v1/rental-orders`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}