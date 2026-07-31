import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'You must be logged in.' },
      { status: 401 },
    );
  }

  const body = await request.json();

  const response = await fetch(
    `${env.backendApiUrl}/api/v1/gears/${id}/moderate`,
    {
      method: 'PATCH',
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