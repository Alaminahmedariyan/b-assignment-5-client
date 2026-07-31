import { notFound } from 'next/navigation';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse, Category, GearDetail } from '@/types/gear';
import { toNumber } from '@/lib/format';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { GearForm } from '@/components/gear/GearForm';

interface EditGearPageProps {
  params: Promise<{ id: string }>;
}

async function getGear(id: string): Promise<GearDetail | null> {
  try {
    const response = await serverFetch<ApiResponse<GearDetail>>(
      `/api/v1/gears/${id}`,
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to load gear "${id}":`, error);
    return null;
  }
}

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

export default async function EditGearPage({ params }: EditGearPageProps) {
  const { id } = await params;
  const [gear, categories] = await Promise.all([
    getGear(id),
    getCategories(),
  ]);

  if (!gear) {
    notFound();
  }

  return (
    <DashboardShell role="PROVIDER" title="Edit gear" description={gear.name}>
      <div className="mx-auto max-w-3xl">
        <GearForm
          mode="edit"
          gearId={gear.id}
          categories={categories}
          initialValues={{
            name: gear.name,
            description: gear.description,
            brand: gear.brand ?? '',
            categoryId: gear.category.id,
            pricePerDay: toNumber(gear.pricePerDay),
            originalPricePerDay: gear.originalPricePerDay
              ? toNumber(gear.originalPricePerDay)
              : '',
            totalQuantity: gear.totalQuantity,
            specifications: gear.specifications
              ? Object.entries(gear.specifications).map(([key, value]) => ({
                  key,
                  value,
                }))
              : [],
          }}
        />
      </div>
    </DashboardShell>
  );
}