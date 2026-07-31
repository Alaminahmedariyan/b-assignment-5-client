'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ShieldOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatTaka } from '@/lib/format';
import type { AdminGearItem } from '@/types/admin-gear';

export function AdminGearRow({ gear }: { gear: AdminGearItem }) {
  const router = useRouter();
  const [isListed, setIsListed] = useState(gear.isListed);
  const [isUpdating, setIsUpdating] = useState(false);

  const primaryImage =
    gear.images.find((image) => image.isPrimary)?.imageUrl ??
    gear.images[0]?.imageUrl;

  const handleToggle = async () => {
    const nextValue = !isListed;

    if (
      nextValue === false &&
      !window.confirm(
        `Unlist "${gear.name}"? Customers won't be able to book it until relisted.`,
      )
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/gears/${gear.id}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isListed: nextValue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to update gear.');
      }

      setIsListed(nextValue);
      toast.success(nextValue ? 'Gear relisted.' : 'Gear unlisted.');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="card-elevate flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={gear.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/gear/${gear.id}`}
          className="truncate font-medium hover:text-primary"
        >
          {gear.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {gear.category.name} · by {gear.provider.name}
        </p>
      </div>

      <span className="shrink-0 text-sm font-semibold">
        {formatTaka(gear.pricePerDay)}
      </span>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
          isListed
            ? 'bg-success/15 text-success'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {isListed ? 'Listed' : 'Unlisted'}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={isUpdating}
        className={`shrink-0 cursor-pointer text-xs ${
          isListed
            ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
            : 'text-success hover:bg-success/10 hover:text-success'
        }`}
      >
        {isUpdating ? (
          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
        ) : isListed ? (
          <ShieldOff className="mr-1.5 size-3.5" />
        ) : (
          <ShieldCheck className="mr-1.5 size-3.5" />
        )}
        {isListed ? 'Unlist' : 'Relist'}
      </Button>
    </div>
  );
}