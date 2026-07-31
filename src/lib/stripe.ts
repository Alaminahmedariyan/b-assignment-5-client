import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Loads Stripe.js once and reuses the same promise on every call —
 * loadStripe() should never be called inside a component render.
 *
 * Requires NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env — this is
 * the PUBLIC key (starts with pk_), safe to expose client-side. It is
 * NOT the same as your backend's STRIPE_SECRET_KEY.
 */
export function getStripe() {
  if (!stripePromise) {
    const publishableKey =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file.',
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}