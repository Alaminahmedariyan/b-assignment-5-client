'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatTaka } from '@/lib/format';
import { RentalStatusBadge } from '@/components/rental/RentalStatusBadge';
import type { ItemRentalStatus } from '@/types/rental';
import type { ProviderRentalItem } from '@/types/provider-rental';

interface ProviderRentalCardProps {
  item: ProviderRentalItem;
}

/**
 * Mirrors rental.service.ts's validTransitions map exactly — the backend
 * is the real source of truth and will reject anything not listed here,
 * but showing only valid next-actions avoids a confusing round-trip.
 */
const VALID_TRANSITIONS: Record<ItemRentalStatus, ItemRentalStatus[]> = {
  CONFIRMED: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['RETURNED', 'OVERDUE', 'DAMAGED'],
  RETURNED: [],
  OVERDUE: ['RETURNED', 'DAMAGED'],
  DAMAGED: [],
  CANCELLED: [],
};

const ACTION_LABELS: Record<ItemRentalStatus, string> = {
  CONFIRMED: 'Confirm',
  READY_FOR_PICKUP: 'Mark ready for pickup',
  PICKED_UP: 'Mark picked up',
  RETURNED: 'Mark returned',
  OVERDUE: 'Mark overdue',
  DAMAGED: 'Mark damaged',
  CANCELLED: 'Cancel',
};

const DESTRUCTIVE_ACTIONS: ItemRentalStatus[] = ['CANCELLED', 'DAMAGED'];

export function ProviderRentalCard({ item }: ProviderRentalCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState(item.status);
  const [updatingTo, setUpdatingTo] = useState<ItemRentalStatus | null>(
    null,
  );

  const primaryImage =
    item.gearItem.images.find((img) => img.isPrimary)?.imageUrl ??
    item.gearItem.images[0]?.imageUrl;

  const nextOptions = VALID_TRANSITIONS[status];

  const handleUpdateStatus = async (nextStatus: ItemRentalStatus) => {
    if (
      DESTRUCTIVE_ACTIONS.includes(nextStatus) &&
      !window.confirm(
        `${ACTION_LABELS[nextStatus]} for this rental? This can't be undone.`,
      )
    ) {
      return;
    }

    setUpdatingTo(nextStatus);

    try {
      const response = await fetch(
        `/api/provider/rentals/${item.rentalOrder.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to update status.');
      }

      setStatus(nextStatus);
      toast.success(`Status updated to ${ACTION_LABELS[nextStatus]}.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setUpdatingTo(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* ============================================================ */}
        {/* Gear + customer info                                         */}
        {/* ============================================================ */}

        <div className="flex gap-3">
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

          <div>
            <p className="font-display font-semibold">
              {item.gearItem.name}
            </p>

            <p className="mt-0.5 text-sm text-muted-foreground">
              For {item.rentalOrder.customer.name}
            </p>

            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="size-3" />
              {item.rentalOrder.customer.email}
            </p>
          </div>
        </div>

        <RentalStatusBadge status={status} />
      </div>

      {/* ================================================================ */}
      {/* Dates + price                                                     */}
      {/* ================================================================ */}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
        <span>Order #{item.rentalOrder.orderNumber}</span>
      </div>

      {/* ================================================================ */}
      {/* Actions                                                           */}
      {/* ================================================================ */}

      {nextOptions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {nextOptions.map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={
                DESTRUCTIVE_ACTIONS.includes(option) ? 'outline' : 'default'
              }
              onClick={() => handleUpdateStatus(option)}
              disabled={updatingTo !== null}
              className={`cursor-pointer rounded-full ${
                DESTRUCTIVE_ACTIONS.includes(option)
                  ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
                  : ''
              }`}
            >
              {updatingTo === option && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              {ACTION_LABELS[option]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}