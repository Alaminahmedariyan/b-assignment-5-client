import { Search } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { AdminGearItem } from '@/types/admin-gear';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { AdminGearRow } from '@/components/admin/AdminGearRow';
import { GearPagination } from '@/components/gear/GearPagination';
import { Input } from '@/components/ui/input';

interface AdminGearsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: 'LISTED' | 'UNLISTED';
    page?: string;
  }>;
}

async function getGears(params: {
  search?: string;
  status?: string;
  page?: string;
}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  query.set('page', params.page ?? '1');
  query.set('limit', '15');

  try {
    // Requires GET /api/v1/gears/admin — see backend/BACKEND_ADDITION.md
    return await serverFetch<ApiResponse<AdminGearItem[]>>(
      `/api/v1/gears/admin?${query.toString()}`,
      { cache: 'no-store' },
    );
  } catch (error) {
    console.error('Failed to load gears:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Failed to load gears.',
      data: [],
      meta: { page: 1, limit: 15, total: 0, totalPage: 0 },
    } as ApiResponse<AdminGearItem[]>;
  }
}

const STATUS_TABS: { label: string; value: 'ALL' | 'LISTED' | 'UNLISTED' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Listed', value: 'LISTED' },
  { label: 'Unlisted', value: 'UNLISTED' },
];

export default async function AdminGearsPage({
  searchParams,
}: AdminGearsPageProps) {
  const params = await searchParams;
  const response = await getGears(params);
  const gears = response.data;
  const meta = response.meta ?? { page: 1, limit: 15, total: 0, totalPage: 0 };

  const buildHref = (status: 'ALL' | 'LISTED' | 'UNLISTED') => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (status !== 'ALL') query.set('status', status);
    return `/admin/gears?${query.toString()}`;
  };

  return (
    <DashboardShell
      role="ADMIN"
      title="Gears"
      description="Inspect and moderate every gear listing on the platform"
    >
      <form action="/admin/gears" method="GET" className="mb-5">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            defaultValue={params.search}
            placeholder="Search by gear name..."
            className="pl-9"
          />
        </div>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = (params.status ?? 'ALL') === tab.value;

          return (
            <a
              key={tab.value}
              href={buildHref(tab.value)}
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

      {gears.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 p-12 text-center text-sm text-muted-foreground">
          No gear found.
        </div>
      ) : (
        <div className="space-y-3">
          {gears.map((gear) => (
            <AdminGearRow key={gear.id} gear={gear} />
          ))}
        </div>
      )}

      {meta.totalPage > 1 && (
        <GearPagination
          meta={meta}
          basePath="/admin/gears"
          baseQuery={
            params.search
              ? `search=${params.search}${params.status ? `&status=${params.status}` : ''}`
              : params.status
                ? `status=${params.status}`
                : ''
          }
        />
      )}
    </DashboardShell>
  );
}