'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

/**
 * gear.service reads `sortBy` (a raw Prisma field name) and `sortOrder`
 * ("asc" | "desc") as two separate query params — not a single combined
 * "sort" value. Each option here maps to that exact pair.
 */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'price-asc', label: 'Price: low to high', sortBy: 'pricePerDay', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Price: high to low', sortBy: 'pricePerDay', sortOrder: 'desc' },
  { value: 'name-asc', label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' },
] as const;

export function GearSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sortBy') ?? 'createdAt';
  const currentSortOrder = searchParams.get('sortOrder') ?? 'desc';

  const currentValue =
    SORT_OPTIONS.find(
      (option) =>
        option.sortBy === currentSortBy && option.sortOrder === currentSortOrder,
    )?.value ?? 'newest';

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SORT_OPTIONS.find(
      (option) => option.value === event.target.value,
    );
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', selected.sortBy);
    params.set('sortOrder', selected.sortOrder);
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2 text-sm shadow-xs">
      <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />

      <select
        value={currentValue}
        onChange={handleChange}
        className="cursor-pointer bg-transparent pr-1 outline-none"
        aria-label="Sort gear by"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}