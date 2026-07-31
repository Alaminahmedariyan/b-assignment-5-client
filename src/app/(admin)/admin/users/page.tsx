import Link from 'next/link';
import { Search, Users } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { AdminUser, UserRole, UserStatus } from '@/types/admin-user';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { UserRow } from '@/components/admin/UserRow';
import { GearPagination } from '@/components/gear/GearPagination';
import { Input } from '@/components/ui/input';

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    page?: string;
  }>;
}

const ROLE_TABS: { label: string; value: UserRole | 'ALL' }[] = [
  { label: 'All roles', value: 'ALL' },
  { label: 'Customers', value: 'CUSTOMER' },
  { label: 'Providers', value: 'PROVIDER' },
  { label: 'Admins', value: 'ADMIN' },
];

async function getUsers(params: {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: string;
}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.role) query.set('role', params.role);
  if (params.status) query.set('status', params.status);
  query.set('page', params.page ?? '1');
  query.set('limit', '15');

  try {
    // Requires the new GET /api/v1/users endpoint — see
    // backend/BACKEND_ADDITION.md if this 404s.
    return await serverFetch<ApiResponse<AdminUser[]>>(
      `/api/v1/users?${query.toString()}`,
      { cache: 'no-store' },
    );
  } catch (error) {
    console.error('Failed to load users:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Failed to load users.',
      data: [],
      meta: { page: 1, limit: 15, total: 0, totalPage: 0 },
    } as ApiResponse<AdminUser[]>;
  }
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;
  const response = await getUsers(params);
  const users = response.data;
  const meta = response.meta ?? { page: 1, limit: 15, total: 0, totalPage: 0 };

  const activeRoleTab = params.role ?? 'ALL';

  const buildRoleHref = (role: UserRole | 'ALL') => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (role !== 'ALL') query.set('role', role);
    if (params.status) query.set('status', params.status);
    return `/admin/users?${query.toString()}`;
  };

  const baseQuery = new URLSearchParams();
  if (params.search) baseQuery.set('search', params.search);
  if (params.role) baseQuery.set('role', params.role);
  if (params.status) baseQuery.set('status', params.status);

  return (
    <DashboardShell
      role="ADMIN"
      title="Users"
      description="Manage every account on the platform"
    >
      {/* ================================================================ */}
      {/* Search                                                            */}
      {/* ================================================================ */}

      <form action="/admin/users" method="GET" className="mb-5">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            defaultValue={params.search}
            placeholder="Search by name or email..."
            className="pl-9"
          />
        </div>
      </form>

      {/* ================================================================ */}
      {/* Role tabs                                                         */}
      {/* ================================================================ */}

      <div className="mb-6 flex flex-wrap gap-2">
        {ROLE_TABS.map((tab) => {
          const isActive = activeRoleTab === tab.value;

          return (
            <Link
              key={tab.value}
              href={buildRoleHref(tab.value)}
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
      {/* User list                                                         */}
      {/* ================================================================ */}

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <Users className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No users found
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try a different search term or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      )}

      {meta.totalPage > 1 && (
        <GearPagination
          meta={meta}
          basePath="/admin/users"
          baseQuery={baseQuery.toString()}
        />
      )}
    </DashboardShell>
  );
}