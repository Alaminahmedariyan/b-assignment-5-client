'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  User,
  CircleUser,
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

import type { User as UserType } from '@/types/user';
import { LogoutButton } from '../LogoutButton';

interface UserMenuProps {
  user: UserType;
}

const getDashboardPath = (role: UserType['role']) => {
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

export function UserMenu({ user }: UserMenuProps) {
  const dashboardPath = getDashboardPath(user.role);

  return (
    <DropdownMenu>
      {/* ================= Trigger ================= */}

      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 cursor-pointer"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                <CircleUser className="h-6 w-6" />
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>

      {/* ================= Dropdown ================= */}

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                  <CircleUser className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold">
                {user.name}
              </span>

              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>

              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {user.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={dashboardPath}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="p-1">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}