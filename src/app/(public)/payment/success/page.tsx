import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    order?: string;
    /** Appended by Stripe itself when a payment method requires a full
     * redirect (not present when we navigate here manually). */
    redirect_status?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;

  // If Stripe redirected here directly (rather than our own in-app
  // navigation), it tells us the real outcome via redirect_status —
  // trust that over just "we ended up on the success URL".
  const failed =
    params.redirect_status && params.redirect_status !== 'succeeded';

  if (failed) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="size-8" />
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
            Payment didn't go through
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Your card wasn't charged. You can try again from your
            rentals page.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {params.order && (
              <Button asChild className="cursor-pointer rounded-full px-7">
                <Link href={`/dashboard/rentals/${params.order}/pay`}>
                  Try again
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

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" />
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
          Payment successful!
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Your rental order is confirmed. The provider will prepare your
          gear for pickup — you can track its status from your
          dashboard.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="cursor-pointer rounded-full px-7">
            <Link href="/dashboard/rentals">View my rentals</Link>
          </Button>

          <Button asChild variant="outline" className="cursor-pointer rounded-full px-7">
            <Link href="/gear">Browse more gear</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}