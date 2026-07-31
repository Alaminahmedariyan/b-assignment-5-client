'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatTaka } from '@/lib/format';
import type { GearListItem } from '@/types/gear';

interface ProviderGearCardProps {
  gear: GearListItem;
}

export function ProviderGearCard({ gear }: ProviderGearCardProps) {
  const router = useRouter();

  const [isListed, setIsListed] = useState(gear.isListed);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const primaryImage =
    gear.images.find((image) => image.isPrimary)?.imageUrl ??
    gear.images[0]?.imageUrl;

  const handleToggleListed = async () => {
    setIsToggling(true);
    const nextValue = !isListed;

    try {
      const response = await fetch(`/api/provider/gears/${gear.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isListed: nextValue }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to update listing status.');
      }

      setIsListed(nextValue);
      toast.success(nextValue ? 'Gear is now listed.' : 'Gear unlisted.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${gear.name}"? This can't be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/provider/gears/${gear.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to delete gear.');
      }

      toast.success('Gear deleted.');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="card-elevate flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      {/* ============================================================ */}
      {/* Image                                                         */}
      {/* ============================================================ */}

      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={gear.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Content                                                       */}
      {/* ============================================================ */}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display font-semibold">
              {gear.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {gear.category.name}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              isListed
                ? 'bg-success/15 text-success'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isListed ? 'Listed' : 'Unlisted'}
          </span>
        </div>

        <p className="mt-1.5 font-display text-sm font-bold">
          {formatTaka(gear.pricePerDay)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            / day · {gear.totalQuantity} in stock
          </span>
        </p>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleListed}
            disabled={isToggling}
            className="cursor-pointer text-xs"
          >
            {isToggling && <Loader2 className="mr-1.5 size-3 animate-spin" />}
            {isListed ? 'Unlist' : 'List'}
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="cursor-pointer text-xs"
          >
            <Link href={`/provider/gears/${gear.id}/edit`}>
              <Pencil className="mr-1.5 size-3" />
              Edit
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {isDeleting ? (
              <Loader2 className="mr-1.5 size-3 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 size-3" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}