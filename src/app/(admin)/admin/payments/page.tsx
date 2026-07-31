import { CreditCard } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { AdminPayment } from '@/types/admin-payment';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PaymentRow } from '@/components/admin/PaymentRow';
import { GearPagination } from '@/components/gear/GearPagination';

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    page?: string;
  }>;
}

const STATUS_TABS: {
  label: string;
  value: 'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
}[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Refunded', value: 'REFUNDED' },
];

async function getPayments(status: string | undefined, page: string) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  query.set('page', page);
  query.set('limit', '15');

  try {
    // Requires GET /api/v1/payments/admin — see backend/BACKEND_ADDITION.md
    return await serverFetch<ApiResponse<AdminPayment[]>>(
      `/api/v1/payments/admin?${query.toString()}`,
      { cache: 'no-store' },
    );
  } catch (error) {
    console.error('Failed to load payments:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Failed to load payments.',
      data: [],
      meta: { page: 1, limit: 15, total: 0, totalPage: 0 },
    } as ApiResponse<AdminPayment[]>;
  }
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const params = await searchParams;
  const page = params.page ?? '1';

  const response = await getPayments(params.status, page);
  const payments = response.data;
  const meta = response.meta ?? { page: 1, limit: 15, total: 0, totalPage: 0 };

  return (
    <DashboardShell
      role="ADMIN"
      title="Payments"
      description="All transactions across the platform"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const href =
            tab.value === 'ALL'
              ? '/admin/payments'
              : `/admin/payments?status=${tab.value}`;
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

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <CreditCard className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No payments found
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {params.status
              ? 'No payments match this status.'
              : 'No transactions have been made yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} />
          ))}
        </div>
      )}

      {meta.totalPage > 1 && (
        <GearPagination
          meta={meta}
          basePath="/admin/payments"
          baseQuery={params.status ? `status=${params.status}` : ''}
        />
      )}
    </DashboardShell>
  );
}