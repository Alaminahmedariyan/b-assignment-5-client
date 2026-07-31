import Link from 'next/link';
import { PackageOpen } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiMeta, ApiResponse } from '@/types/gear';
import type { OrderStatus, RentalOrder } from '@/types/rental';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RentalOrderCard } from '@/components/rental/RentalOrderCard';
import { GearPagination } from '@/components/gear/GearPagination';
import { Button } from '@/components/ui/button';

interface RentalsPageProps {
  searchParams: Promise<{ status?: OrderStatus; page?: string }>;
}

const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending payment', value: 'PENDING_PAYMENT' },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

async function getMyRentals(
  status: OrderStatus | undefined,
  page: string,
): Promise<ApiResponse<RentalOrder[]>> {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  query.set('page', page);
  query.set('limit', '10');

  try {
    return await serverFetch<ApiResponse<RentalOrder[]>>(
      `/api/v1/rentals/my-rentals?${query.toString()}`,
      { cache: 'no-store' },
    );
  } catch (error) {
    console.error('Failed to load rentals:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Failed to load rentals.',
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
    };
  }
}

export default async function MyRentalsPage({
  searchParams,
}: RentalsPageProps) {
  const params = await searchParams;
  const page = params.page ?? '1';

  const response = await getMyRentals(params.status, page);
  const orders = response.data;

  const meta: ApiMeta = response.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  };

  const activeTab = params.status ?? 'ALL';

  return (
    <DashboardShell
      role="CUSTOMER"
      title="My Rentals"
      description="Track and manage your rental orders"
    >
      {/* ================================================================ */}
      {/* Status tabs                                                      */}
      {/* ================================================================ */}

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const href =
            tab.value === 'ALL'
              ? '/dashboard/rentals'
              : `/dashboard/rentals?status=${tab.value}`;
          const isActive = activeTab === tab.value;

          return (
            <Link
              key={tab.value}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* Orders                                                           */}
      {/* ================================================================ */}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <PackageOpen className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No rentals here yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {activeTab === 'ALL'
              ? "You haven't rented anything yet."
              : 'No orders match this status.'}
          </p>
          <Button asChild className="mt-5 cursor-pointer rounded-full">
            <Link href="/gear">Browse gear</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <RentalOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* Pagination                                                       */}
      {/* ================================================================ */}

      {meta.totalPage > 1 && (
        <GearPagination
          meta={{ ...meta }}
          basePath="/dashboard/rentals"
          baseQuery={params.status ? `status=${params.status}` : ''}
        />
      )}
    </DashboardShell>
  );
}