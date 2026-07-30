import Link from 'next/link';
import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PaymentCancelPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function PaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const params = await searchParams;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <XCircle className="size-8" />
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
          Payment cancelled
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          No charge was made. Your rental order is still saved as
          pending payment — you can complete it anytime from your
          rentals page.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {params.order && (
            <Button asChild className="cursor-pointer rounded-full px-7">
              <Link href={`/dashboard/rentals/${params.order}/pay`}>
                Resume payment
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" className="cursor-pointer rounded-full px-7">
            <Link href="/dashboard/rentals">Back to my rentals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}