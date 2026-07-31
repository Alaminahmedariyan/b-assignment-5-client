import Link from 'next/link';
import { Plus } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse, GearListItem } from '@/types/gear';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ProviderGearCard } from '@/components/gear/ProviderGearCard';
import { Button } from '@/components/ui/button';

async function getMyGears(): Promise<GearListItem[]> {
  try {
    // Requires the new GET /api/v1/gears/my-gears endpoint —
    // see BACKEND_ADDITION.md if this 404s.
    const response = await serverFetch<ApiResponse<GearListItem[]>>(
      '/api/v1/gears/my-gears?limit=50',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load your gear:', error);
    return [];
  }
}

export default async function ProviderGearsPage() {
  const gearItems = await getMyGears();

  return (
    <DashboardShell
      role="PROVIDER"
      title="My Gears"
      description="Manage your listed equipment"
    >
      <div className="mb-6 flex justify-end">
        <Button asChild className="cursor-pointer rounded-full">
          <Link href="/provider/gears/new">
            <Plus className="mr-1.5 size-4" />
            Add new gear
          </Link>
        </Button>
      </div>

      {gearItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">
            No gear listed yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first piece of equipment to start receiving rental
            requests.
          </p>
          <Button asChild className="mt-5 cursor-pointer rounded-full">
            <Link href="/provider/gears/new">
              <Plus className="mr-1.5 size-4" />
              Add new gear
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {gearItems.map((gear) => (
            <ProviderGearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}