import Link from 'next/link';
import { CreditCard } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import { formatTaka } from '@/lib/format';
import type { ApiResponse } from '@/types/gear';
import type { CustomerPayment } from '@/types/customer-payment';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RentalStatusBadge } from '@/components/rental/RentalStatusBadge';
import { Button } from '@/components/ui/button';

async function getMyPayments(): Promise<CustomerPayment[]> {
  try {
    const response = await serverFetch<ApiResponse<CustomerPayment[]>>(
      '/api/v1/payments',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load payments:', error);
    return [];
  }
}

export default async function CustomerPaymentsPage() {
  const payments = await getMyPayments();

  return (
    <DashboardShell
      role="CUSTOMER"
      title="Payments"
      description="Your payment history"
    >
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <CreditCard className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No payments yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Your payment history will show up here once you complete a
            booking.
          </p>
          <Button asChild className="mt-5 cursor-pointer rounded-full">
            <Link href="/gear">Browse gear</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="card-elevate flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {payment.transactionId}
                </p>
                <Link
                  href={`/dashboard/rentals`}
                  className="mt-0.5 block truncate text-sm font-medium hover:text-primary"
                >
                  Order #{payment.rentalOrder.orderNumber}
                </Link>
              </div>

              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {payment.method}
              </span>

              <RentalStatusBadge status={payment.status} />

              <div className="shrink-0 text-right">
                <p className="font-display font-bold">
                  {formatTaka(payment.amount)}
                </p>
                {payment.refundAmount && (
                  <p className="text-xs text-destructive">
                    −{formatTaka(payment.refundAmount)} refunded
                  </p>
                )}
              </div>

              <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}