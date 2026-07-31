'use client';

import Link from 'next/link';
import { Menu, Search, Sparkles, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { User } from '@/types/user';

import { UserMenu } from './navbar/UserMenu';
import { MobileMenu } from './navbar/MobileMenu';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Browse Gear', href: '/gear' },
  { label: 'Categories', href: '/#categories' },
  { label: 'How It Works', href: '/#how-it-works' },
];

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthenticated = Boolean(user);

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Was previously a decorative <Input> with no form/handler at all —
  // this is the actual fix. Submitting takes you to the real gear
  // listing pre-filtered by the search term.
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = searchQuery.trim();
    router.push(trimmed ? `/gear?search=${encodeURIComponent(trimmed)}` : '/gear');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="text-lg font-bold">G</span>
          </div>
          <span className="text-lg font-bold tracking-tight">GearUp</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {!isAuthenticated && (
            <Link
              href="/register?as=provider"
              className="flex items-center gap-1.5 py-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <Sparkles className="size-3.5" />
              Become a Provider
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search — now a real form */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden w-full max-w-xs lg:flex"
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-full border-border/60 bg-muted/40 pl-9 focus-visible:bg-background"
              />
            </div>
          </form>

          <ThemeToggle />

          {!isAuthenticated && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild className="cursor-pointer">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="cursor-pointer rounded-full px-5">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {user && <UserMenu user={user} />}

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer md:hidden"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile search — same fix, shown below the header on small screens */}
      <div className="border-t border-border/60 px-4 py-2.5 lg:hidden">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search gear..."
              className="h-9 w-full rounded-full border-border/60 bg-muted/40 pl-9"
            />
          </div>
        </form>
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          user={user}
          navItems={
            isAuthenticated
              ? NAV_ITEMS
              : [...NAV_ITEMS, { label: 'Become a Provider', href: '/register?as=provider' }]
          }
          pathname={pathname}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}