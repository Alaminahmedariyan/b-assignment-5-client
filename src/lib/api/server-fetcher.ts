import { env } from '@/config/env';
import { cookies } from 'next/headers';

interface ServerFetchOptions extends RequestInit {
  tags?: string[];
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const {
    tags,
    headers,
    ...fetchOptions
  } = options;

  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get('accessToken')?.value;

  const refreshToken =
    cookieStore.get('refreshToken')?.value;

  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set(
      'Content-Type',
      'application/json',
    );
  }

  /*
   * Forward authentication cookies
   * from Next.js to backend API.
   */
  const cookiesToForward: string[] = [];

  if (accessToken) {
    cookiesToForward.push(
      `accessToken=${accessToken}`,
    );
  }

  if (refreshToken) {
    cookiesToForward.push(
      `refreshToken=${refreshToken}`,
    );
  }

  if (cookiesToForward.length > 0) {
    requestHeaders.set(
      'Cookie',
      cookiesToForward.join('; '),
    );
  }

  const response = await fetch(
    `${env.backendApiUrl}${endpoint}`,
    {
      ...fetchOptions,

      headers: requestHeaders,

      ...(tags?.length
        ? {
            next: {
              tags,
            },
          }
        : {}),
    },
  );

  if (!response.ok) {
    let errorMessage =
      'Something went wrong while communicating with the server.';

    try {
      const errorData = await response.json();

      errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorMessage;
    } catch {
      // Keep default error message.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}