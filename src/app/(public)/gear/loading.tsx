import { GearGridSkeleton } from '@/components/gear/GearGrid';

export default function GearLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-48 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <div className="h-96 animate-pulse rounded-2xl bg-muted/40" />

        <div>
          <div className="mb-5 flex justify-end">
            <div className="h-9 w-44 animate-pulse rounded-full bg-muted/40" />
          </div>

          <GearGridSkeleton />
        </div>
      </div>
    </div>
  );
}