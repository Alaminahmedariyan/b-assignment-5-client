import { NextResponse, type NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

interface DecodedToken {
  id: string;
  email: string;
  role: Role;
  exp: number;
}

/**
 * Route prefix → roles allowed to view it. Anything not listed here is
 * public and middleware doesn't touch it.
 */
const PROTECTED_ROUTES: { prefix: string; roles: Role[] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/provider', roles: ['PROVIDER'] },
  { prefix: '/dashboard', roles: ['CUSTOMER'] },
  // Any authenticated role can view these:
  { prefix: '/profile', roles: ['CUSTOMER', 'PROVIDER', 'ADMIN'] },
  { prefix: '/settings', roles: ['CUSTOMER', 'PROVIDER', 'ADMIN'] },
];

const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/dashboard',
  PROVIDER: '/provider',
  ADMIN: '/admin',
};

const AUTH_PAGES = ['/login', '/register'];

/**
 * ⚠️ IMPORTANT — this is a UX layer, not the real security boundary.
 * We decode the JWT here WITHOUT verifying its signature (jwt-decode
 * just base64-decodes; the Edge runtime can't easily do the same HMAC
 * verification your backend's `auth` middleware does with your JWT
 * secret). This is fine for *redirecting* someone away from a page
 * their role can't use — but every actual data request still goes
 * through your backend, which re-verifies the token signature and
 * role properly. A forged/tampered token might slip past this
 * middleware's redirect, but it will always be rejected by the
 * backend when it tries to fetch real data. Don't remove the
 * backend-side auth() checks thinking this middleware replaces them.
 */
function getValidUser(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Treat an expired token as "not logged in" for redirect purposes —
    // the backend will also reject it, but there's no point sending
    // someone to a page that will just fail to load data.
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = getValidUser(request);

  // Logged-in users don't need the login/register pages — send them
  // straight to their dashboard instead.
  if (user && AUTH_PAGES.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[user.role], request.url),
    );
  }

  const matchedRoute = PROTECTED_ROUTES.find((route) =>
    pathname.startsWith(route.prefix),
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Not logged in at all — bounce to login, remembering where they
  // were headed so they can continue after signing in.
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in, but wrong role for this route — send them to their own
  // home instead of showing a broken/empty page.
  if (!matchedRoute.roles.includes(user.role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[user.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/provider/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};