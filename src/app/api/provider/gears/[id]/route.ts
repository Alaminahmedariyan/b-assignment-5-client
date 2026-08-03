import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 401,
        message: 'You must be logged in to update gear.',
      },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, statusCode: 400, message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/api/v1/gears/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Gear PATCH proxy failed:', error);
    return NextResponse.json(
      { success: false, statusCode: 502, message: 'Backend unreachable.' },
      { status: 502 },
    );
  }
}

/**
 * Delete — GearForm's provider "Delete" action (My Gears page) needs
 * this too; added alongside PATCH since both live under the same
 * dynamic [id] route file.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 401,
        message: 'You must be logged in to delete gear.',
      },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/api/v1/gears/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Gear DELETE proxy failed:', error);
    return NextResponse.json(
      { success: false, statusCode: 502, message: 'Backend unreachable.' },
      { status: 502 },
    );
  }
}