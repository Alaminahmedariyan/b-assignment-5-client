import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function getAccessTokenOrError() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      accessToken: null,
      error: NextResponse.json(
        { success: false, statusCode: 401, message: 'You must be logged in.' },
        { status: 401 },
      ),
    };
  }

  return { accessToken, error: null };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { accessToken, error } = await getAccessTokenOrError();
  if (error) return error;

  const body = await request.json();

  const response = await fetch(
    `${env.backendApiUrl}/api/v1/categories/${id}`,
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

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { accessToken, error } = await getAccessTokenOrError();
  if (error) return error;

  const response = await fetch(
    `${env.backendApiUrl}/api/v1/categories/${id}`,
    {
      method: 'DELETE',
      headers: { Cookie: `accessToken=${accessToken}` },
    },
  );

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}