import 'server-only';



import type { User } from '@/types/user';
import { serverFetch } from '@/lib/api/server-fetcher';

interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export async function getCurrentUser(): Promise<
  CurrentUserResponse | null
> {
  try {
    const response =
      await serverFetch<CurrentUserResponse>(
        '/api/v1/users/me',
        {
          method: 'GET',
          cache: 'no-store',
        },
      );

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'You are not authorized.'
    ) {
      return null;
    }

    console.error(
      'Failed to fetch current user:',
      error,
    );

    return null;
  }
}