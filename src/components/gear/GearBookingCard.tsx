'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { formatTaka, toNumber } from '@/lib/format';

interface GearBookingCardProps {
  gearId: string;
  pricePerDay: string | number;
  totalQuantity: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function GearBookingCard({
  gearId,
  pricePerDay,
  totalQuantity,
}: GearBookingCardProps) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const dailyRate = toNumber(pricePerDay);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const diff =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      MS_PER_DAY;

    return diff > 0 ? Math.ceil(diff) : 0;
  }, [startDate, endDate]);

  const subtotal = days * dailyRate * quantity;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (days === 0) {
      toast.error('Please select a valid date range.');
      return;
    }

    setIsSubmitting(true);

    try {
      // POST /api/v1/rentals expects { items: [{ gearItemId, quantity,
      // startDate, endDate }] } — an array, even for a single item —
      // because one rental order can bundle multiple gear items.
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              gearItemId: gearId,
              quantity,
              startDate,
              endDate,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Unable to submit request.');
      }

      const orderId = data.data?.id;

      if (!orderId) {
        // Order was created but the response shape was unexpected —
        // don't strand the user on a dead end, send them to their
        // rentals list where the new PENDING_PAYMENT order will show
        // up with its own "Pay now" button.
        toast.success('Rental request sent! Redirecting to your rentals...');
        router.push('/dashboard/rentals');
        return;
      }

      toast.success(
        `Rental request created — order ${data.data.orderNumber}. Complete payment to confirm it.`,
      );
      router.push(`/dashboard/rentals/${orderId}/pay`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-3xl border border-border/60 bg-card p-6 shadow-md">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-display text-3xl font-bold tracking-tight">
            {formatTaka(pricePerDay)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">/ day</span>
        </div>

        <span className="rounded-full bg-tag/15 px-2.5 py-1 text-xs font-semibold text-tag-foreground">
          {totalQuantity} in stock
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="startDate" className="text-xs">
              Start date
            </Label>
            <Input
              id="startDate"
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="endDate" className="text-xs">
              End date
            </Label>
            <Input
              id="endDate"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quantity" className="text-xs">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={totalQuantity}
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Math.min(
                  totalQuantity,
                  Math.max(1, Number(event.target.value) || 1),
                ),
              )
            }
          />
          <p className="text-xs text-muted-foreground">
            Final availability for your dates is confirmed after you submit
            — the provider may have overlapping bookings.
          </p>
        </div>

        {days > 0 && (
          <div className="space-y-1.5 rounded-2xl bg-muted/50 p-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>
                {formatTaka(dailyRate)} × {days} day{days === 1 ? '' : 's'} ×{' '}
                {quantity}
              </span>
              <span>{formatTaka(subtotal)}</span>
            </div>

            <div className="flex justify-between border-t border-border/60 pt-1.5 font-semibold">
              <span>Subtotal</span>
              <span>{formatTaka(subtotal)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-full"
          size="lg"
        >
          <CalendarDays className="mr-2 size-4" />
          {isSubmitting ? 'Sending request...' : 'Request to rent'}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          {"You'll"} pay after the order is created, from your dashboard.
        </p>
      </form>
    </div>
  );
}