import { CheckCircle2, PackageCheck, PackageX, Wallet } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import { formatTaka } from '@/lib/format';
import type { ApiResponse } from '@/types/gear';
import type { ProviderDashboardStats } from '@/types/dashboard';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RevenueHero } from '@/components/dashboard/RevenueHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { BreakdownDonut } from '@/components/dashboard/BreakdownDonut';

async function getProviderStats(): Promise<ProviderDashboardStats | null> {
  try {
    const response = await serverFetch<
      ApiResponse<ProviderDashboardStats>
    >('/api/v1/dashboard/provider', { cache: 'no-store' });

    return response.data;
  } catch (error) {
    console.error('Failed to load provider dashboard:', error);
    return null;
  }
}

export default async function ProviderDashboardPage() {
  const stats = await getProviderStats();

  if (!stats) {
    return (
      <DashboardShell
        role="PROVIDER"
        title="Provider Dashboard"
        description="Your gear and rental performance"
      >
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center text-sm text-muted-foreground">
          {"Couldn't"} load dashboard data. Please refresh the page.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="PROVIDER"
      title="Provider Dashboard"
      description="Your gear and rental performance"
    >
      <div className="space-y-6">
        <RevenueHero
          label="Total revenue"
          value={formatTaka(stats.totalRevenue)}
          icon={Wallet}
          sublabel={`From ${stats.completedRentals} completed rental${stats.completedRentals === 1 ? '' : 's'}`}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total gear listed"
            value={stats.totalGear}
            icon={PackageCheck}
          />

          <StatCard
            label="Currently listed"
            value={stats.listedGear}
            icon={CheckCircle2}
            tone="success"
          />

          <StatCard
            label="Unlisted"
            value={stats.unlistedGear}
            icon={PackageX}
            tone="destructive"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <BreakdownDonut
            title="Gear listing status"
            centerLabel="total gear"
            centerValue={stats.totalGear}
            data={[
              {
                label: 'Listed',
                value: stats.listedGear,
                color: 'var(--color-success)',
              },
              {
                label: 'Unlisted',
                value: stats.unlistedGear,
                color: 'var(--color-muted-foreground)',
              },
            ]}
          />

          <div className="card-elevate flex flex-col justify-center rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-muted-foreground">
              Rental performance
            </h3>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total rental items
                </p>
                <p className="font-display text-3xl font-bold tracking-tight">
                  {stats.totalRentalItems}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-display text-3xl font-bold tracking-tight text-success">
                  {stats.completedRentals}
                </p>
              </div>
            </div>

            {stats.totalRentalItems > 0 && (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{
                    width: `${Math.round(
                      (stats.completedRentals / stats.totalRentalItems) * 100,
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}