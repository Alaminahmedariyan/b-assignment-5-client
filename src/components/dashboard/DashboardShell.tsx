'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings,
  Star,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';

import { logoutAction } from '@/app/(auth)/_actions/authActions';
import { Button } from '@/components/ui/button';

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

type DashboardShellProps = {
  role: UserRole;
  title: string;
  description: string;
  children: React.ReactNode;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navigationByRole: Record<UserRole, NavigationItem[]> = {
  CUSTOMER: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Browse Gear', href: '/gear', icon: Package },
    { label: 'My Rentals', href: '/dashboard/rentals', icon: Package },
    { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
  ],

  PROVIDER: [
    { label: 'Dashboard', href: '/provider', icon: LayoutDashboard },
    { label: 'My Gears', href: '/provider/gears', icon: Package },
    { label: 'Rentals', href: '/provider/rentals', icon: Package },
    { label: 'Reviews', href: '/provider/reviews', icon: Star },
  ],

  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Categories', href: '/admin/categories', icon: Package },
    { label: 'Gears', href: '/admin/gears', icon: Package },
    { label: 'Rentals', href: '/admin/rentals', icon: Package },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'GearUp',
  PROVIDER: 'GearUp Provider',
  ADMIN: 'GearUp Admin',
};

/**
 * Self-contained — doesn't import the public navbar's ThemeToggle, since
 * that path varies by project setup. Only depends on `next-themes`
 * (already a project dependency), so it can't 404 on a wrong import path.
 */
function InlineThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-9 rounded-full border border-border/60" />;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="cursor-pointer rounded-full border border-border/60"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </Button>
  );
}

export function DashboardShell({
  role,
  title,
  description,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const navigationItems = navigationByRole[role];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isActive = (href: string) =>
    href === navigationItems[0]?.href
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  // A plain function returning JSX — NOT a nested component. Calling it
  // as `{renderNavLinks()}` (rather than `<NavLinks />`) avoids React's
  // "components created during render" warning, since we're not
  // introducing a new component type on every render.
  const renderNavLinks = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileNavOpen(false)}
            className={navLinkClass(isActive(item.href))}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}

      <div className="my-2 border-t border-border/60" />

      <Link
        href="/profile"
        onClick={() => setMobileNavOpen(false)}
        className={navLinkClass(isActive('/profile'))}
      >
        <User className="size-4" />
        Profile
      </Link>

      <Link
        href="/settings"
        onClick={() => setMobileNavOpen(false)}
        className={navLinkClass(isActive('/settings'))}
      >
        <Settings className="size-4" />
        Settings
      </Link>

      <form action={logoutAction}>
        <Button
          type="submit"
          variant="ghost"
          className="w-full cursor-pointer justify-start gap-3 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </form>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      {/* ================================================================ */}
      {/* Top bar                                                           */}
      {/* ================================================================ */}

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              G
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {ROLE_LABELS[role]}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <InlineThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer md:hidden"
              onClick={() => setMobileNavOpen((previous) => !previous)}
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileNavOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-border/60 bg-background p-3 md:hidden">
            <nav className="space-y-1">{renderNavLinks()}</nav>
          </div>
        )}
      </header>

      {/* ================================================================ */}
      {/* Sidebar + Content                                                 */}
      {/* ================================================================ */}

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
            <nav className="space-y-1">{renderNavLinks()}</nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-8 space-y-1.5">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}