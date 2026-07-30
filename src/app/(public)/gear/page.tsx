import { Suspense } from 'react';
import type { Metadata } from 'next';

import { serverFetch } from '@/lib/api/server-fetcher';
import type {
  ApiResponse,
  CategoryWithRelations,
  GearListItem,
} from '@/types/gear';

import { GearFilters } from '@/components/gear/GearFilters';
import { GearSortSelect } from '@/components/gear/GearSortSelect';
import { GearGrid, GearGridSkeleton } from '@/components/gear/GearGrid';
import { GearPagination } from '@/components/gear/GearPagination';

export const metadata: Metadata = {
  title: 'Browse Gear',
  description:
    'Explore cameras, electronics, outdoor equipment, and more from trusted providers on GearUp.',
};

interface GearPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/* ==================================================================== */
/* Data fetching                                                          */
/* ==================================================================== */

async function getGearItems(
  params: Record<string, string | undefined>,
): Promise<ApiResponse<GearListItem[]>> {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.brand) query.set('brand', params.brand);
  if (params.minPrice) query.set('minPrice', params.minPrice);
  if (params.maxPrice) query.set('maxPrice', params.maxPrice);
  query.set('sortBy', params.sortBy ?? 'createdAt');
  query.set('sortOrder', params.sortOrder ?? 'desc');
  query.set('page', params.page ?? '1');
  query.set('limit', '9');

  try {
    return await serverFetch<ApiResponse<GearListItem[]>>(
      `/api/v1/gears?${query.toString()}`,
      { cache: 'no-store' },
    );
  } catch (error) {
    console.error('Failed to load gear items:', error);

    return {
      success: false,
      statusCode: 500,
      message: 'Failed to load gear items.',
      data: [],
      meta: { page: 1, limit: 9, total: 0, totalPage: 0 },
    };
  }
}

async function getCategories(): Promise<CategoryWithRelations[]> {
  try {
    const response = await serverFetch<
      ApiResponse<CategoryWithRelations[]>
    >('/api/v1/categories', { cache: 'no-store' });

    return response.data;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

/* ==================================================================== */
/* Page                                                                    */
/* ==================================================================== */

export default async function GearPage({ searchParams }: GearPageProps) {
  const params = await searchParams;

  const [gearResponse, categories] = await Promise.all([
    getGearItems(params),
    getCategories(),
  ]);

  const items = gearResponse.data;
  const meta = gearResponse.meta ?? {
    page: 1,
    limit: 9,
    total: 0,
    totalPage: 0,
  };

  const baseQuery = new URLSearchParams();
  if (params.search) baseQuery.set('search', params.search);
  if (params.category) baseQuery.set('category', params.category);
  if (params.brand) baseQuery.set('brand', params.brand);
  if (params.minPrice) baseQuery.set('minPrice', params.minPrice);
  if (params.maxPrice) baseQuery.set('maxPrice', params.maxPrice);
  if (params.sortBy) baseQuery.set('sortBy', params.sortBy);
  if (params.sortOrder) baseQuery.set('sortOrder', params.sortOrder);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ================================================================ */}
      {/* Header                                                            */}
      {/* ================================================================ */}

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Browse gear
        </h1>

        <p className="mt-2 text-muted-foreground">
          {meta.total > 0
            ? `${meta.total} item${meta.total === 1 ? '' : 's'} available right now`
            : 'Find the right equipment for your next project'}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* ============================================================== */}
        {/* Filters sidebar                                                 */}
        {/* ============================================================== */}

        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-2xl bg-muted/40" />
          }
        >
          <GearFilters categories={categories} />
        </Suspense>

        {/* ============================================================== */}
        {/* Results                                                         */}
        {/* ============================================================== */}

        <div>
          <div className="mb-5 flex items-center justify-end">
            <Suspense
              fallback={
                <div className="h-9 w-44 animate-pulse rounded-full bg-muted/40" />
              }
            >
              <GearSortSelect />
            </Suspense>
          </div>

          <Suspense fallback={<GearGridSkeleton />}>
            <GearGrid items={items} />
          </Suspense>

          <GearPagination meta={meta} baseQuery={baseQuery.toString()} />
        </div>
      </div>
    </div>
  );
}