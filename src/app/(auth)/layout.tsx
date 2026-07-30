import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-[-15%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left Branding Section */}
          <section className="hidden lg:block">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Sparkles className="size-5" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                GearUp
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur">
                <ShieldCheck className="size-4 text-primary" />
                Secure & trusted gear rental
              </div>

              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl">
                Gear up for your
                <span className="block text-primary">
                  next adventure.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
                Discover, rent, and enjoy the perfect gear
                for your next experience. Everything you need,
                all in one place.
              </p>
            </div>

            {/* Bottom Highlight */}
            <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  500+
                </p>
                <p>Premium Gears</p>
              </div>

              <div className="h-10 w-px bg-border" />

              <div>
                <p className="text-2xl font-bold text-foreground">
                  1K+
                </p>
                <p>Happy Renters</p>
              </div>

              <div className="h-10 w-px bg-border" />

              <div>
                <p className="text-2xl font-bold text-foreground">
                  24/7
                </p>
                <p>Support</p>
              </div>
            </div>
          </section>

          {/* Auth Content */}
          <section className="flex w-full justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-8 flex justify-center lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="size-5" />
                  </div>

                  <span className="text-2xl font-bold tracking-tight">
                    GearUp
                  </span>
                </Link>
              </div>

              {children}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}