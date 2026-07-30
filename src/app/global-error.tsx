'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // In a real deployment, send this to your error-tracking service
    // (Sentry, LogRocket, etc.) instead of just the console.
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
          Something went wrong.
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. You can
          try again, or head back home.
        </p>

        {process.env.NODE_ENV !== 'production' && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl border border-border/60 bg-muted/40 p-3 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={reset}
            className="cursor-pointer rounded-full px-7"
          >
            <RotateCw className="mr-2 size-4" />
            Try again
          </Button>

          <Button
            asChild
            variant="outline"
            className="cursor-pointer rounded-full px-7"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}