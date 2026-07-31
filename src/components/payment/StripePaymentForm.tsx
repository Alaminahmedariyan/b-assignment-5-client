'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getStripe } from '@/lib/stripe';
import { formatTaka } from '@/lib/format';

interface StripePaymentFormProps {
  rentalOrderId: string;
  totalAmount: string | number;
}

export function StripePaymentForm({
  rentalOrderId,
  totalAmount,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rentalOrderId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;

        if (!data.success) {
          setError(data.message ?? 'Failed to start payment.');
          return;
        }

        setClientSecret(data.data.clientSecret);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to start payment.');
      });

    return () => {
      cancelled = true;
    };
  }, [rentalOrderId]);

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: 'oklch(0.62 0.19 255)',
            borderRadius: '0.75rem',
          },
        },
      }}
    >
      <CheckoutForm
        rentalOrderId={rentalOrderId}
        totalAmount={totalAmount}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}

interface CheckoutFormProps extends StripePaymentFormProps {
  clientSecret: string;
}

function CheckoutForm({
  rentalOrderId,
  totalAmount,
  clientSecret,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDevConfirming, setIsDevConfirming] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [elementLoadFailed, setElementLoadFailed] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Guard against the exact crash from the screenshot: confirmPayment()
    // throws if the PaymentElement never actually mounted (commonly an
    // ad-blocker/privacy extension silently blocking Stripe's iframe).
    if (!stripe || !elements || !isElementReady) {
      toast.error(
        'Payment form is not ready yet. If this persists, try disabling ad-blockers/privacy extensions for this site.',
      );
      return;
    }

    setIsSubmitting(true);

    // return_url is required even with redirect: 'if_required' — some
    // payment methods (certain bank redirects) force a full-page
    // redirect regardless of this setting, and Stripe needs somewhere
    // to send the browser back to. When it's NOT required (the common
    // card case), we handle the success navigation ourselves below.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?order=${rentalOrderId}`,
      },
    });

    if (error) {
      toast.error(error.message ?? 'Payment failed.');
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      router.push(`/payment/success?order=${rentalOrderId}`);
    } else {
      toast.error('Payment did not complete. Please try again.');
      setIsSubmitting(false);
    }
  };

  /** Dev-only shortcut — see proxy route comment for why this exists. */
  const handleDevConfirm = async () => {
    setIsDevConfirming(true);

    try {
      // Stripe's clientSecret is always formatted as "pi_XXX_secret_YYY" —
      // this is documented, stable, and safe to parse (unlike reaching
      // into Elements' internal state).
      const intentId = clientSecret.split('_secret_')[0];

      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: intentId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Dev-confirm failed.');
      }

      toast.success('Payment auto-confirmed (dev mode).');
      router.push(`/payment/success?order=${rentalOrderId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsDevConfirming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <PaymentElement
          onReady={() => setIsElementReady(true)}
          onLoadError={() => {
            setElementLoadFailed(true);
            toast.error(
              'Failed to load the payment form. This is often caused by an ad-blocker or privacy extension blocking Stripe.',
            );
          }}
        />

        {!isElementReady && !elementLoadFailed && (
          <div className="mt-3 h-10 animate-pulse rounded-lg bg-muted" />
        )}
      </div>

      {elementLoadFailed && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-center text-xs text-destructive">
          Couldn't load the payment form. Please disable any ad-blocker
          or privacy extension for this site (or try a different
          browser/incognito window), then refresh.
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !isElementReady || isSubmitting}
        size="lg"
        className="w-full cursor-pointer rounded-full"
      >
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
        Pay {formatTaka(totalAmount)}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Payments are securely processed by Stripe.
      </p>

      <Link
        href={`/payment/cancel?order=${rentalOrderId}`}
        className="block text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Cancel and go back
      </Link>

      {process.env.NODE_ENV !== 'production' && (
        <div className="rounded-xl border border-dashed border-tag/40 bg-tag/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Dev mode — skip real card entry and auto-confirm with Stripe's
            test card.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDevConfirm}
            disabled={isDevConfirming}
            className="mt-2 cursor-pointer text-xs"
          >
            {isDevConfirming ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Zap className="mr-1.5 size-3.5" />
            )}
            Simulate payment
          </Button>
        </div>
      )}
    </form>
  );
}