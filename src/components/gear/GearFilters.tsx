'use client';

import { useCallback, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { CategoryWithRelations } from '@/types/gear';

interface GearFiltersProps {
  /**
   * Fetched server-side in page.tsx via GET /api/v1/categories and passed
   * down — keeps this a plain client component with no fetch/CORS/env
   * concerns of its own.
   */
  categories: CategoryWithRelations[];
}

export function GearFilters({ categories }: GearFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [brand, setBrand] = useState(searchParams.get('brand') ?? '');

  // The backend matches `categoryId` directly — the URL param stores the
  // category's real DB id, not its slug.
  const activeCategoryId = searchParams.get('category');

  /* ================================================================ */
  /* Helpers                                                           */
  /* ================================================================ */

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete('page');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ search: search || null });
  };

  const handlePriceApply = () => {
    updateParams({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  };

  const handleBrandApply = () => {
    updateParams({ brand: brand || null });
  };

  const handleCategoryToggle = (categoryId: string) => {
    updateParams({
      category: activeCategoryId === categoryId ? null : categoryId,
    });
  };

  const clearAll = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setBrand('');
    router.push(pathname);
  };

  const hasActiveFilters =
    Boolean(searchParams.get('search')) ||
    Boolean(searchParams.get('category')) ||
    Boolean(searchParams.get('minPrice')) ||
    Boolean(searchParams.get('maxPrice')) ||
    Boolean(searchParams.get('brand'));

  return (
    <aside
      className={`w-full space-y-6 transition-opacity duration-200 ${
        isPending ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {/* ============================================================ */}
      {/* Header                                                        */}
      {/* ============================================================ */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-auto cursor-pointer px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 size-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {/* ============================================================ */}
      {/* Search                                                        */}
      {/* ============================================================ */}

      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <Label htmlFor="gear-search" className="text-sm font-medium">
          Search
        </Label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="gear-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Camera, tent, projector..."
            className="pl-9"
          />
        </div>
      </form>

      {/* ============================================================ */}
      {/* Categories — real DB rows, filtered by id                    */}
      {/* ============================================================ */}

      <div className="space-y-3 border-t border-border/60 pt-5">
        <Label className="text-sm font-medium">Category</Label>

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No categories yet.
          </p>
        ) : (
          <div className="space-y-1">
            {categories
              .filter((category) => !category.parentId)
              .map((category) => {
                const isActive = activeCategoryId === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {category.name}

                    {category.children.length > 0 && (
                      <span className="text-xs text-muted-foreground/70">
                        {category.children.length}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Price range                                                   */}
      {/* ============================================================ */}

      <div className="space-y-3 border-t border-border/60 pt-5">
        <Label className="text-sm font-medium">Price per day (৳)</Label>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="h-9"
          />

          <span className="text-muted-foreground">–</span>

          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="h-9"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePriceApply}
          className="w-full cursor-pointer"
        >
          Apply price
        </Button>
      </div>

      {/* ============================================================ */}
      {/* Brand                                                         */}
      {/* ============================================================ */}

      <div className="space-y-3 border-t border-border/60 pt-5">
        <Label htmlFor="gear-brand" className="text-sm font-medium">
          Brand
        </Label>

        <Input
          id="gear-brand"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          placeholder="Sony, Canon, DJI..."
          className="h-9"
        />

        <p className="text-xs text-muted-foreground">
          Must match the brand name exactly (not case-sensitive).
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBrandApply}
          className="w-full cursor-pointer"
        >
          Apply brand
        </Button>
      </div>
    </aside>
  );
}