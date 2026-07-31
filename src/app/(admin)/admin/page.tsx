import {
  Boxes,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Wallet,
} from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import { formatTaka } from '@/lib/format';
import type { ApiResponse } from '@/types/gear';
import type { AdminDashboardStats } from '@/types/dashboard';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RevenueHero } from '@/components/dashboard/RevenueHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { BreakdownDonut } from '@/components/dashboard/BreakdownDonut';

async function getAdminStats(): Promise<AdminDashboardStats | null> {
  try {
    const response = await serverFetch<ApiResponse<AdminDashboardStats>>(
      '/api/v1/dashboard/admin',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load admin dashboard:', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  if (!stats) {
    return (
      <DashboardShell
        role="ADMIN"
        title="Admin Dashboard"
        description="Platform-wide overview"
      >
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center text-sm text-muted-foreground">
         {" Couldn't "}load dashboard data. Please refresh the page.
        </div>
      </DashboardShell>
    );
  }

  const otherRentals =
    stats.totalRentals - stats.completedRentals - stats.cancelledRentals;

  return (
    <DashboardShell
      role="ADMIN"
      title="Admin Dashboard"
      description="Platform-wide overview across users, gear, and rentals"
    >
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* Revenue hero                                                  */}
        {/* ============================================================ */}

        <RevenueHero
          label="Total revenue"
          value={formatTaka(stats.totalRevenue)}
          icon={Wallet}
          sublabel={`From ${stats.completedPayments} completed payment${stats.completedPayments === 1 ? '' : 's'}`}
        />

        {/* ============================================================ */}
        {/* Stat grid                                                     */}
        {/* ============================================================ */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total users"
            value={stats.totalUsers}
            icon={Boxes}
            hint={`${stats.totalCustomers} customers · ${stats.totalProviders} providers`}
          />

          <StatCard
            label="Listed gear"
            value={stats.totalGear}
            icon={ShoppingBag}
            hint={`Across ${stats.totalCategories} categories`}
            tone="tag"
          />

          <StatCard
            label="Completed payments"
            value={stats.completedPayments}
            icon={CheckCircle2}
            tone="success"
          />

          <StatCard
            label="Pending payments"
            value={stats.pendingPayments}
            icon={Clock}
            tone="destructive"
          />
        </div>

        {/* ============================================================ */}
        {/* Breakdowns                                                    */}
        {/* ============================================================ */}

        <div className="grid gap-4 md:grid-cols-2">
          <BreakdownDonut
            title="Users by role"
            centerLabel="total users"
            centerValue={stats.totalUsers}
            data={[
              {
                label: 'Customers',
                value: stats.totalCustomers,
                color: 'var(--color-primary)',
              },
              {
                label: 'Providers',
                value: stats.totalProviders,
                color: 'var(--color-tag)',
              },
              {
                label: 'Admins',
                value: stats.totalAdmins,
                color: 'var(--color-muted-foreground)',
              },
            ]}
          />

          <BreakdownDonut
            title="Rental order status"
            centerLabel="total rentals"
            centerValue={stats.totalRentals}
            data={[
              {
                label: 'Completed',
                value: stats.completedRentals,
                color: 'var(--color-success)',
              },
              {
                label: 'Cancelled',
                value: stats.cancelledRentals,
                color: 'var(--color-destructive)',
              },
              {
                label: 'In progress',
                value: Math.max(0, otherRentals),
                color: 'var(--color-primary)',
              },
            ]}
          />
        </div>
      </div>
    </DashboardShell>
  );
}