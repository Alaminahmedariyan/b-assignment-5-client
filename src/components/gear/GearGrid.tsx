import { PackageSearch } from 'lucide-react';

import { GearCardCompact } from './GearCardCompact';
import type { GearListItem } from '@/types/gear';

interface GearGridProps {
  items: GearListItem[];
}

export function GearGrid({ items }: GearGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <PackageSearch className="size-6" />
        </div>

        <p className="mt-4 font-display text-lg font-semibold">
          No gear matches your filters.
        </p>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try widening your price range, clearing the category filter,
          or searching a different term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((gear) => (
        <GearCardCompact key={gear.id} gear={gear} />
      ))}
    </div>
  );
}

export function GearGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-border/60 bg-card"
        >
          <div className="aspect-square bg-muted" />

          <div className="space-y-2 p-2.5">
            <div className="h-3.5 w-full rounded bg-muted" />
            <div className="h-3.5 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}