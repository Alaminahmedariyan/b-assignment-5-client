'use client';

import Link from 'next/link';

import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  User as UserIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { User } from '@/types/user';

import { LogoutButton } from '../LogoutButton';

interface UserMenuProps {
  user: User;
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

export function UserMenu({
  user,
}: UserMenuProps) {
  const dashboardPath =
    getDashboardPath(
      user.role,
    );

  const initials =
    getUserInitials(
      user.name,
    );

  return (
    <DropdownMenu>

      {/* ============================================================ */}
      {/* Trigger                                                       */}
      {/* ============================================================ */}

      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer rounded-full px-2"
        >
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials}
          </div>

          <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
            {user.name}
          </span>

          <ChevronDown className="hidden size-4 sm:block" />
        </Button>
      </DropdownMenuTrigger>

      {/* ============================================================ */}
      {/* Dropdown                                                      */}
      {/* ============================================================ */}

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64"
      >

        {/* User Information */}

        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">

            <span className="truncate font-semibold">
              {user.name}
            </span>

            <span className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {user.role}
            </span>

          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Dashboard */}

        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href={dashboardPath}>
            <LayoutDashboard className="mr-2 size-4" />

            <span>
              Dashboard
            </span>
          </Link>
        </DropdownMenuItem>

        {/* Profile */}

        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/profile">
            <UserIcon className="mr-2 size-4" />

            <span>
              My Profile
            </span>
          </Link>
        </DropdownMenuItem>

        {/* Settings */}

        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/settings">
            <Settings className="mr-2 size-4" />

            <span>
              Settings
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}

        <div className="p-1">
          <LogoutButton />
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}