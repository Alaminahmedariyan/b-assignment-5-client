'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, Loader2, Star, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatTaka } from '@/lib/format';
import type { RentalOrder } from '@/types/rental';

import { RentalStatusBadge } from './RentalStatusBadge';
import { ReviewForm } from './ReviewForm';

interface RentalOrderCardProps {
  order: RentalOrder;
}

const CANCELLABLE_STATUSES = ['PENDING_PAYMENT', 'PLACED'];

export function RentalOrderCard({ order }: RentalOrderCardProps) {
  const router = useRouter();

  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewingItemId, setReviewingItemId] = useState<string | null>(
    null,
  );
  const [reviewedItemIds, setReviewedItemIds] = useState<Set<string>>(
    new Set(),
  );

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  const handleCancel = async () => {
    const reason = window.prompt(
      'Why are you cancelling this order? (optional)',
    );

    if (reason === null) return; // user pressed Cancel on the prompt

    setIsCancelling(true);

    try {
      const response = await fetch(
        `/api/customer/rentals/${order.id}/cancel`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cancellationReason: reason || undefined }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to cancel order.');
      }

      toast.success('Order cancelled.');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
      {/* ================================================================ */}
      {/* Header                                                            */}
      {/* ================================================================ */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-5">
        <div>
          <p className="font-display font-semibold">#{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RentalStatusBadge status={order.status} />
          <RentalStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Cancellation reason, if any */}
      {order.status === 'CANCELLED' && order.cancellationReason && (
        <p className="border-b border-border/60 bg-destructive/5 px-5 py-2.5 text-xs text-muted-foreground">
          Cancelled: {order.cancellationReason}
        </p>
      )}

      {/* ================================================================ */}
      {/* Items                                                             */}
      {/* ================================================================ */}

      <div className="divide-y divide-border/60">
        {order.items.map((item) => {
          const primaryImage =
            item.gearItem.images.find((img) => img.isPrimary)?.imageUrl ??
            item.gearItem.images[0]?.imageUrl;

          const isReviewing = reviewingItemId === item.id;
          const alreadyReviewed = reviewedItemIds.has(item.id);
          const canReview = item.status === 'RETURNED' && !alreadyReviewed;

          return (
            <div key={item.id} className="p-5">
              <div className="flex gap-4">
                <Link
                  href={`/gear/${item.gearItem.id}`}
                  className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  {primaryImage && (
                    <Image
                      src={primaryImage}
                      alt={item.gearItem.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/gear/${item.gearItem.id}`}
                      className="truncate font-medium hover:text-primary"
                    >
                      {item.gearItem.name}
                    </Link>

                    <RentalStatusBadge status={item.status} />
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {new Date(item.startDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      –{' '}
                      {new Date(item.endDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>

                    <span>Qty: {item.quantity}</span>

                    <span className="font-medium text-foreground">
                      {formatTaka(item.subtotal)}
                    </span>
                  </div>

                  {canReview && !isReviewing && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewingItemId(item.id)}
                      className="mt-2.5 cursor-pointer text-xs"
                    >
                      <Star className="mr-1.5 size-3.5" />
                      Leave a review
                    </Button>
                  )}

                  {alreadyReviewed && (
                    <p className="mt-2 text-xs text-success">
                      ✓ Review submitted
                    </p>
                  )}
                </div>
              </div>

              {isReviewing && (
                <ReviewForm
                  rentalOrderItemId={item.id}
                  onDone={() => {
                    setReviewingItemId(null);
                    setReviewedItemIds(
                      (previous) => new Set(previous).add(item.id),
                    );
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* Footer                                                            */}
      {/* ================================================================ */}

      <div className="flex items-center justify-between gap-3 border-t border-border/60 p-5">
        <div>
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="ml-2 font-display text-lg font-bold">
            {formatTaka(order.totalAmount)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'PENDING_PAYMENT' && (
            <Button
              asChild
              size="sm"
              className="cursor-pointer rounded-full"
            >
              <Link href={`/dashboard/rentals/${order.id}/pay`}>
                Pay now
              </Link>
            </Button>
          )}

          {canCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isCancelling}
              className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {isCancelling ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <X className="mr-1.5 size-3.5" />
              )}
              Cancel order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}