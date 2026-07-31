import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

const BACKEND_TIMEOUT_MS = 15000;

export async function POST(request: Request) {
  const body = await request.json();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 401,
        message: 'You must be logged in to request a rental.',
      },
      { status: 401 },
    );
  }

  // A timeout here is what turns a silent, infinite-spinner hang into
  // a real, visible error — without this, if the backend is slow, cold-
  // starting, or unreachable, this fetch just waits forever and the
  // button on the frontend never resolves either way.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    const response = await fetch(`${env.backendApiUrl}/api/v1/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    clearTimeout(timeoutId);

    const isTimeout =
      error instanceof Error && error.name === 'AbortError';

    console.error('POST /api/rentals -> backend call failed:', error);

    return NextResponse.json(
      {
        success: false,
        statusCode: 504,
        message: isTimeout
          ? 'The server took too long to respond. Please check your backend is running and reachable, then try again.'
          : 'Could not reach the backend server. Please verify BACKEND_API_URL in your .env and that the backend is running.',
      },
      { status: 504 },
    );
  }
}