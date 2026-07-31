import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

/**
 * Multipart create — the browser sends FormData directly (fields under
 * "data" as a JSON string per your validateRequest pattern, files under
 * "images"). We forward it as-is; only the auth cookie needs adding
 * since httpOnly cookies aren't visible to client-side fetch.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 401,
        message: 'You must be logged in to create gear.',
      },
      { status: 401 },
    );
  }

  const formData = await request.formData();

  const response = await fetch(`${env.backendApiUrl}/api/v1/gears`, {
    method: 'POST',
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}