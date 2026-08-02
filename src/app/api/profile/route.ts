import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { env } from '@/config/env';

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'You must be logged in.' },
      { status: 401 },
    );
  }
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, statusCode: 400, message: 'Invalid form data.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/api/v1/users/me`, {
      method: 'PATCH',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile PATCH proxy failed:', error);
    return NextResponse.json(
      { success: false, statusCode: 502, message: 'Backend unreachable.' },
      { status: 502 },
    );
  }
}