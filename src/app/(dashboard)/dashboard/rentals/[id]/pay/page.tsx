import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { RentalOrder } from '@/types/rental';
import { formatTaka } from '@/lib/format';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RentalStatusBadge } from '@/components/rental/RentalStatusBadge';
import { StripePaymentForm } from '@/components/payment/StripePaymentForm';

interface PayPageProps {
  params: Promise<{ id: string }>;
}

async function getRentalOrder(id: string): Promise<RentalOrder | null> {
  try {
    const response = await serverFetch<ApiResponse<RentalOrder>>(
      `/api/v1/rentals/${id}`,
      { cache: 'no-store' },
    );

    if (!response.success || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Failed to load rental order:', error);
    return null;
  }
}

export default async function PayRentalPage({ params }: PayPageProps) {
  const { id } = await params;
  const order = await getRentalOrder(id);

  // Order doesn't exist, doesn't belong to this user, or backend is unreachable.
  if (!order) {
    notFound();
  }

  // Only orders still awaiting payment should reach the Stripe form.
  // Anything else (already paid, cancelled, completed) shows a clear
  // message instead of mounting a payment form that would just fail
  // backend-side (createPaymentIntentIntoDB rejects non-pending orders).
  if (order.status !== 'PENDING_PAYMENT') {
    return (
      <DashboardShell
        role="CUSTOMER"
        title="Payment"
        description="This order is no longer awaiting payment"
      >
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">
            Nothing to pay here
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Order #{order.orderNumber} is currently{' '}
            <span className="font-medium">{order.status}</span>. If you
            think this is a mistake, contact support.
          </p>
          <Link
            href="/dashboard/rentals"
            className="mt-5 text-sm font-medium text-primary hover:underline"
          >
            Back to my rentals
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="CUSTOMER"
      title="Payment"
      description={`Complete payment for order #${order.orderNumber}`}
    >
      <div className="mx-auto max-w-lg space-y-6">
        {/* ============================================================ */}
        {/* Order summary                                                */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-5">
            <div>
              <p className="font-display font-semibold">
                #{order.orderNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                Placed{' '}
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <RentalStatusBadge status={order.status} />
          </div>

          <div className="divide-y divide-border/60">
            {order.items.map((item) => {
              const primaryImage =
                item.gearItem.images.find((img) => img.isPrimary)
                  ?.imageUrl ?? item.gearItem.images[0]?.imageUrl;

              return (
                <div key={item.id} className="flex gap-4 p-5">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {primaryImage && (
                      <Image
                        src={primaryImage}
                        alt={item.gearItem.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {item.gearItem.name}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {new Date(item.startDate).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'short' },
                        )}{' '}
                        –{' '}
                        {new Date(item.endDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <span className="shrink-0 font-medium">
                    {formatTaka(item.subtotal)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 p-5">
            <span className="text-sm text-muted-foreground">
              Total to pay
            </span>
            <span className="font-display text-lg font-bold">
              {formatTaka(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Stripe payment form (existing component — creates the       */}
        {/* PaymentIntent via /api/payments/create and mounts Elements) */}
        {/* ============================================================ */}
        <StripePaymentForm
          rentalOrderId={order.id}
          totalAmount={order.totalAmount}
        />
      </div>
    </DashboardShell>
  );
}