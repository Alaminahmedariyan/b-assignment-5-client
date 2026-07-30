import Link from 'next/link';
import { ArrowRight, Compass, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* ================================================================ */}
      {/* Background — reuses the hero section's texture                   */}
      {/* ================================================================ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/3 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />

        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        {/* ============================================================ */}
        {/* Rental-tag styled 404 badge                                   */}
        {/* ============================================================ */}

        <div className="relative mx-auto inline-flex items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-4">
          <span
            aria-hidden="true"
            className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full border border-border/60 bg-background"
          />

          <Compass className="size-6 text-primary" />
          <span className="font-display text-3xl font-bold tracking-tight text-primary">
            404
          </span>
        </div>

        <h1 className="mt-7 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          This gear {"isn't"} in stock.
        </h1>

        <p className="mt-3 text-muted-foreground">
          The page {"you're"} looking for {"doesn't"} exist, or may have been
          moved. {"Let's"} get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="cursor-pointer rounded-full px-7">
            <Link href="/">
              Back to home
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="cursor-pointer rounded-full px-7"
          >
            <Link href="/gear">
              <Search className="mr-2 size-4" />
              Browse gear
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}