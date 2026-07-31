import { PackageSearch } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { ItemRentalStatus } from '@/types/rental';
import type { ProviderRentalItem } from '@/types/provider-rental';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ProviderRentalCard } from '@/components/rental/ProviderRentalCard';
import { GearPagination } from '@/components/gear/GearPagination';

interface ProviderRentalsPageProps {
  searchParams: Promise<{ status?: ItemRentalStatus; page?: string }>;
}

const STATUS_TABS: { label: string; value: ItemRentalStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Ready for pickup', value: 'READY_FOR_PICKUP' },
  { label: 'Picked up', value: 'PICKED_UP' },
  { label: 'Returned', value: 'RETURNED' },
  { label: 'Overdue', value: 'OVERDUE' },
];

async function getProviderRentals(
  status: ItemRentalStatus | undefined,
  page: string,
) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  query.set('page', page);
  query.set('limit', '10');

  try {
    return await serverFetch<ApiResponse<ProviderRentalItem[]>>(
      `/api/v1/rentals/provider/rentals?${query.toString()}`,
      { cache: 'no-store' },
    );
  } catch (error) {
    console.error('Failed to load provider rentals:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Failed to load rentals.',
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
    } as ApiResponse<ProviderRentalItem[]>;
  }
}

export default async function ProviderRentalsPage({
  searchParams,
}: ProviderRentalsPageProps) {
  const params = await searchParams;
  const page = params.page ?? '1';

  const response = await getProviderRentals(params.status, page);
  const items = response.data;
  const meta = response.meta ?? { page: 1, limit: 10, total: 0, totalPage: 0 };

  return (
    <DashboardShell
      role="PROVIDER"
      title="Rentals"
      description="Manage pickup and return status for your rented gear"
    >
      {/* ================================================================ */}
      {/* Status tabs                                                       */}
      {/* ================================================================ */}

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const href =
            tab.value === 'ALL'
              ? '/provider/rentals'
              : `/provider/rentals?status=${tab.value}`;
          const isActive = (params.status ?? 'ALL') === tab.value;

          return (
            <a
              key={tab.value}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* Rental items                                                      */}
      {/* ================================================================ */}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <PackageSearch className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No rentals here
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {params.status
              ? 'No rentals match this status.'
              : "You don't have any rental requests yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ProviderRentalCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {meta.totalPage > 1 && (
        <GearPagination
          meta={meta}
          basePath="/provider/rentals"
          baseQuery={params.status ? `status=${params.status}` : ''}
        />
      )}
    </DashboardShell>
  );
}