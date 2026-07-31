import Image from 'next/image';
import Link from 'next/link';

import { serverFetch } from '@/lib/api/server-fetcher';
import { formatTaka } from '@/lib/format';
import type { ApiResponse } from '@/types/gear';
import type { AdminRentalOrder } from '@/types/admin-rental';
import type { OrderStatus } from '@/types/rental';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RentalStatusBadge } from '@/components/rental/RentalStatusBadge';
import { GearPagination } from '@/components/gear/GearPagination';

interface AdminRentalsPageProps {
  searchParams: Promise<{ status?: OrderStatus; page?: string }>;
}

const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending payment', value: 'PENDING_PAYMENT' },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

async function getRentals(status: string | undefined, page: string) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  query.set('page', page);
  query.set('limit', '10');

  try {
    // Requires GET /api/v1/rentals/admin — see backend/BACKEND_ADDITION.md
    return await serverFetch<ApiResponse<AdminRentalOrder[]>>(
      `/api/v1/rentals/admin?${query.toString()}`,
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
    } as ApiResponse<AdminRentalOrder[]>;
  }
}

export default async function AdminRentalsPage({
  searchParams,
}: AdminRentalsPageProps) {
  const params = await searchParams;
  const page = params.page ?? '1';

  const response = await getRentals(params.status, page);
  const orders = response.data;
  const meta = response.meta ?? { page: 1, limit: 10, total: 0, totalPage: 0 };

  return (
    <DashboardShell
      role="ADMIN"
      title="Rentals"
      description="Inspect every rental order across the platform"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const href =
            tab.value === 'ALL' ? '/admin/rentals' : `/admin/rentals?status=${tab.value}`;
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

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 p-12 text-center text-sm text-muted-foreground">
          No rental orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.name} ({order.customer.email}) ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RentalStatusBadge status={order.status} />
                  <RentalStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {order.items.map((item) => {
                  const primaryImage =
                    item.gearItem.images.find((img) => img.isPrimary)?.imageUrl ??
                    item.gearItem.images[0]?.imageUrl;

                  return (
                    <Link
                      key={item.id}
                      href={`/gear/${item.gearItem.id}`}
                      className="flex items-center gap-2 rounded-xl border border-border/60 p-2 pr-3 hover:border-primary/40"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {primaryImage && (
                          <Image
                            src={primaryImage}
                            alt={item.gearItem.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <div className="text-xs">
                        <p className="max-w-[140px] truncate font-medium">
                          {item.gearItem.name}
                        </p>
                        <p className="text-muted-foreground">
                          {formatTaka(item.subtotal)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-lg font-bold">
                  {formatTaka(order.totalAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.totalPage > 1 && (
        <GearPagination
          meta={meta}
          basePath="/admin/rentals"
          baseQuery={params.status ? `status=${params.status}` : ''}
        />
      )}
    </DashboardShell>
  );
}