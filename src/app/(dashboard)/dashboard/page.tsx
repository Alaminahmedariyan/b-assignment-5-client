import { CheckCircle2, Clock, ShoppingBag, Wallet, XCircle } from 'lucide-react';
import Link from 'next/link';

import { serverFetch } from '@/lib/api/server-fetcher';
import { formatTaka } from '@/lib/format';
import type { ApiResponse } from '@/types/gear';
import type { CustomerDashboardStats } from '@/types/dashboard';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RevenueHero } from '@/components/dashboard/RevenueHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { BreakdownDonut } from '@/components/dashboard/BreakdownDonut';
import { Button } from '@/components/ui/button';

async function getCustomerStats(): Promise<CustomerDashboardStats | null> {
  try {
    const response = await serverFetch<
      ApiResponse<CustomerDashboardStats>
    >('/api/v1/dashboard/customer', { cache: 'no-store' });

    return response.data;
  } catch (error) {
    console.error('Failed to load customer dashboard:', error);
    return null;
  }
}

export default async function CustomerDashboardPage() {
  const stats = await getCustomerStats();

  if (!stats) {
    return (
      <DashboardShell
        role="CUSTOMER"
        title="My Dashboard"
        description="Your rentals and spending at a glance"
      >
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center text-sm text-muted-foreground">
          {"Couldn't"}load dashboard data. Please refresh the page.
        </div>
      </DashboardShell>
    );
  }

  const hasNoOrders = stats.totalOrders === 0;

  return (
    <DashboardShell
      role="CUSTOMER"
      title="My Dashboard"
      description="Your rentals and spending at a glance"
    >
      <div className="space-y-6">
        <RevenueHero
          label="Total spent"
          value={formatTaka(stats.totalSpent)}
          icon={Wallet}
          sublabel={`Across ${stats.totalOrders} order${stats.totalOrders === 1 ? '' : 's'}`}
        />

        {hasNoOrders ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">
              No rentals yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Once you rent your first piece of gear, your orders will
              show up here.
            </p>
            <Button asChild className="mt-5 cursor-pointer rounded-full">
              <Link href="/gear">Browse gear</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Completed orders"
                value={stats.completedOrders}
                icon={CheckCircle2}
                tone="success"
              />

              <StatCard
                label="Pending orders"
                value={stats.pendingOrders}
                icon={Clock}
                tone="tag"
              />

              <StatCard
                label="Cancelled orders"
                value={stats.cancelledOrders}
                icon={XCircle}
                tone="destructive"
              />
            </div>

            <BreakdownDonut
              title="Order status"
              centerLabel="total orders"
              centerValue={stats.totalOrders}
              data={[
                {
                  label: 'Completed',
                  value: stats.completedOrders,
                  color: 'var(--color-success)',
                },
                {
                  label: 'Pending',
                  value: stats.pendingOrders,
                  color: 'var(--color-tag)',
                },
                {
                  label: 'Cancelled',
                  value: stats.cancelledOrders,
                  color: 'var(--color-destructive)',
                },
              ]}
            />
          </>
        )}
      </div>
    </DashboardShell>
  );
}