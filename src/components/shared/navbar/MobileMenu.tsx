'use client';

import Link from 'next/link';

import {
  LayoutDashboard,
  Settings,
  User as UserIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { User } from '@/types/user';

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  user: User | null;
  navItems: NavItem[];
  pathname: string;
  onClose: () => void;
}

const getUserInitials = (
  name: string,
) => {
  if (!name?.trim()) {
    return 'U';
  }

  return name
    .trim()
    .split(/\s+/)
    .map(
      (part) =>
        part.charAt(0),
    )
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const getDashboardPath = (
  role: User['role'],
) => {
  switch (role) {
    case 'ADMIN':
      return '/admin';

    case 'PROVIDER':
      return '/provider';

    case 'CUSTOMER':
    default:
      return '/dashboard';
  }
};

export function MobileMenu({
  user,
  navItems,
  pathname,
  onClose,
}: MobileMenuProps) {

  const isActiveRoute = (
    href: string,
  ) => {
    if (href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  };

  const dashboardPath = user
    ? getDashboardPath(
        user.role,
      )
    : '/dashboard';

  return (
    <div className="border-t bg-background md:hidden">

      <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">

        {/* ======================================================== */}
        {/* Navigation                                                */}
        {/* ======================================================== */}

        {navItems.map(
          (item) => {

            const isActive =
              isActiveRoute(
                item.href,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          },
        )}

        {/* ======================================================== */}
        {/* Authenticated                                             */}
        {/* ======================================================== */}

        {user ? (
          <div className="mt-3 space-y-3 border-t pt-4">

            {/* User */}

            <div className="flex items-center gap-3 px-3 py-2">

              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {getUserInitials(
                  user.name,
                )}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>

                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {user.role}
                </span>

              </div>
            </div>

            {/* Dashboard */}

            <Button
              variant="outline"
              asChild
              className="w-full cursor-pointer justify-start"
            >
              <Link
                href={dashboardPath}
                onClick={onClose}
              >
                <LayoutDashboard className="mr-2 size-4" />

                Dashboard
              </Link>
            </Button>

            {/* Profile */}

            <Button
              variant="outline"
              asChild
              className="w-full cursor-pointer justify-start"
            >
              <Link
                href="/profile"
                onClick={onClose}
              >
                <UserIcon className="mr-2 size-4" />

                My Profile
              </Link>
            </Button>

            {/* Settings */}

            <Button
              variant="outline"
              asChild
              className="w-full cursor-pointer justify-start"
            >
              <Link
                href="/settings"
                onClick={onClose}
              >
                <Settings className="mr-2 size-4" />

                Settings
              </Link>
            </Button>

            {/* Logout */}

            <form
              action={async () => {
                const {
                  logoutAction,
                } = await import(
                  '@/app/(auth)/_actions/authActions'
                );

                await logoutAction();
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                className="w-full cursor-pointer justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Sign out
              </Button>
            </form>

          </div>
        ) : (

          /* ====================================================== */
          /* Guest                                                   */
          /* ====================================================== */

          <div className="mt-3 flex flex-col gap-2 border-t pt-4">

            <Button
              variant="outline"
              asChild
              className="w-full cursor-pointer"
            >
              <Link
                href="/login"
                onClick={onClose}
              >
                Log in
              </Link>
            </Button>

            <Button
              asChild
              className="w-full cursor-pointer"
            >
              <Link
                href="/register"
                onClick={onClose}
              >
                Sign up
              </Link>
            </Button>

          </div>
        )}

      </nav>
    </div>
  );
}