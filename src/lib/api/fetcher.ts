import { env } from '@/config/env';

interface ApiFetchOptions extends RequestInit {
  tags?: string[];
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    tags,
    headers,
    ...fetchOptions
  } = options;

  const url = `${env.backendApiUrl}${endpoint}`;

  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set(
      'Content-Type',
      'application/json',
    );
  }

  const response = await fetch(url, {
    ...fetchOptions,

    headers: requestHeaders,

    ...(tags?.length
      ? {
          next: {
            tags,
          },
        }
      : {}),
  });

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