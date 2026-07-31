import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse, Category } from '@/types/gear';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { GearForm } from '@/components/gear/GearForm';

async function getCategories(): Promise<Category[]> {
  try {
    const response = await serverFetch<ApiResponse<Category[]>>(
      '/api/v1/categories',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

export default async function NewGearPage() {
  const categories = await getCategories();

  return (
    <DashboardShell
      role="PROVIDER"
      title="Add new gear"
      description="List a new piece of equipment for rent"
    >
      <div className="mx-auto max-w-3xl">
        <GearForm mode="create" categories={categories} />
      </div>
    </DashboardShell>
  );
}