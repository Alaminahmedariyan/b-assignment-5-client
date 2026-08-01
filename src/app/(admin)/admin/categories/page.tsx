import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse, CategoryWithRelations } from '@/types/gear';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { CategoriesPageClient } from '@/components/admin/CategoriesPageClient';

async function getCategories(): Promise<CategoryWithRelations[]> {
  try {
    const response = await serverFetch<ApiResponse<CategoryWithRelations[]>>(
      '/api/v1/categories',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const topLevel = categories.filter((category) => !category.parentId);

  return (
    <DashboardShell
      role="ADMIN"
      title="Categories"
      description="Organize how gear is browsed and filtered"
    >
      <CategoriesPageClient
        topLevelCategories={topLevel}
        allCategories={categories}
      />
    </DashboardShell>
  );
}