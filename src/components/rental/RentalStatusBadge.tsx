import type {
  ItemRentalStatus,
  OrderStatus,
  PaymentStatus,
} from '@/types/rental';

type Status = OrderStatus | ItemRentalStatus | PaymentStatus;

const STATUS_STYLES: Record<Status, string> = {
  // Order statuses
  PENDING_PAYMENT: 'bg-tag/15 text-tag-foreground',
  PLACED: 'bg-primary/10 text-primary',
  CANCELLED: 'bg-destructive/10 text-destructive',
  COMPLETED: 'bg-success/15 text-success',

  // Item statuses
  CONFIRMED: 'bg-primary/10 text-primary',
  READY_FOR_PICKUP: 'bg-tag/15 text-tag-foreground',
  PICKED_UP: 'bg-primary/10 text-primary',
  RETURNED: 'bg-success/15 text-success',
  OVERDUE: 'bg-destructive/10 text-destructive',
  DAMAGED: 'bg-destructive/10 text-destructive',

  // Payment statuses (PENDING/COMPLETED already covered above)
  FAILED: 'bg-destructive/10 text-destructive',
  REFUNDED: 'bg-muted text-muted-foreground',
  PENDING: 'bg-tag/15 text-tag-foreground',
};

const STATUS_LABELS: Record<Status, string> = {
  PENDING_PAYMENT: 'Pending payment',
  PLACED: 'Placed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',

  CONFIRMED: 'Confirmed',
  READY_FOR_PICKUP: 'Ready for pickup',
  PICKED_UP: 'Picked up',
  RETURNED: 'Returned',
  OVERDUE: 'Overdue',
  DAMAGED: 'Damaged',

  FAILED: 'Payment failed',
  REFUNDED: 'Refunded',
  PENDING: 'Payment pending',
};

export function RentalStatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}