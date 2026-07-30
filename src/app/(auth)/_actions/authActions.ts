'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import { apiFetch } from '@/lib/api/fetcher';

export type AuthActionState = {
  success: boolean;
  message: string;
};

type AuthTokenResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  nidUrl?: string;
  role?: 'CUSTOMER' | 'PROVIDER';
};

type RegisterResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

type JwtPayloadWithRole = {
  id: string;
  email: string;
  role: string;
};

/* -------------------------------------------------------------------------- */
/*                                   Login                                    */
/* -------------------------------------------------------------------------- */

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return {
      success: false,
      message: 'Email and password are required.',
    };
  }

  try {
    const result = await apiFetch<AuthTokenResponse>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
        cache: 'no-store',
      },
    );

    if (
      !result.success ||
      !result.data?.accessToken ||
      !result.data?.refreshToken
    ) {
      return {
        success: false,
        message:
          result.message ||
          'Unable to login. Please try again.',
      };
    }

    const cookieStore = await cookies();

    const isProduction =
      process.env.NODE_ENV === 'production';

    cookieStore.set(
      'accessToken',
      result.data.accessToken,
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      },
    );

    cookieStore.set(
      'refreshToken',
      result.data.refreshToken,
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    cookieStore.delete('authHint');

    const decodedToken = jwtDecode<JwtPayloadWithRole>(result.data.accessToken);
    const userRole = decodedToken?.role;

    if (userRole === 'ADMIN') {
      redirect('/admin');
    }

    if (userRole === 'PROVIDER') {
      redirect('/provider');
    }

    redirect('/dashboard');
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error(
      'Login action error:',
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Register                                  */
/* -------------------------------------------------------------------------- */

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData
    .get('name')
    ?.toString()
    .trim();

  const email = formData
    .get('email')
    ?.toString()
    .trim();

  const password = formData
    .get('password')
    ?.toString();

  const phone = formData
    .get('phone')
    ?.toString()
    .trim();

  const address = formData
    .get('address')
    ?.toString()
    .trim();

  const nidUrl = formData
    .get('nidUrl')
    ?.toString()
    .trim();

  // ↓ new — role toggle from RegisterForm ("CUSTOMER" | "PROVIDER").
  // Anything else (or missing) safely falls back to CUSTOMER — the
  // backend independently re-validates this too, never trusting the
  // client alone for role assignment.
  const roleInput = formData.get('role')?.toString();
  const role: 'CUSTOMER' | 'PROVIDER' =
    roleInput === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';

  if (!name || !email || !password) {
    return {
      success: false,
      message:
        'Name, email and password are required.',
    };
  }

  const payload: RegisterPayload = {
    name,
    email,
    password,
    role,

    ...(phone
      ? {
          phone,
        }
      : {}),

    ...(address
      ? {
          address,
        }
      : {}),

    ...(nidUrl
      ? {
          nidUrl,
        }
      : {}),
  };

  try {
    const result =
      await apiFetch<RegisterResponse>(
        '/api/v1/users/register',
        {
          method: 'POST',
          body: JSON.stringify(payload),
          cache: 'no-store',
        },
      );

    if (!result.success) {
      return {
        success: false,
        message:
          result.message ||
          'Unable to create your account.',
      };
    }

    const cookieStore = await cookies();

    const isProduction =
      process.env.NODE_ENV === 'production';

    cookieStore.set(
      'authHint',
      'registered',
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      },
    );

    return {
      success: true,
      message:
        result.message ||
        'Registration successful. Please login.',
    };
  } catch (error) {
    console.error(
      'Registration action error:',
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Logout                                   */
/* -------------------------------------------------------------------------- */

export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('authHint');
  } catch (error) {
    console.error(
      'Logout action error:',
      error,
    );
  }

  redirect('/login');
}