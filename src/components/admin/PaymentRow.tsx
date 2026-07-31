import { RentalStatusBadge } from '@/components/rental/RentalStatusBadge';
import { formatTaka } from '@/lib/format';
import type { AdminPayment } from '@/types/admin-payment';

export function PaymentRow({ payment }: { payment: AdminPayment }) {
  return (
    <div className="card-elevate flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-xs text-muted-foreground">
          {payment.transactionId}
        </p>
        <p className="mt-0.5 font-medium">
          {payment.rentalOrder.customer.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {payment.rentalOrder.customer.email} · Order #
          {payment.rentalOrder.orderNumber}
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {payment.method}
      </span>

      <RentalStatusBadge status={payment.status} />

      <div className="shrink-0 text-right">
        <p className="font-display font-bold">{formatTaka(payment.amount)}</p>
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
  );
}