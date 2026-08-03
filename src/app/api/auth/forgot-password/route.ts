import { NextResponse } from 'next/server';
import { env } from '@/config/env';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${env.backendApiUrl}/api/v1/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    // 👇 এটা যোগ করুন
    console.log('Backend Response:', data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
      },
      {
        status: 500,
      },
    );
  }
}