import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { GearCard } from '../gear/GearCard';
import type { GearListItem } from '@/types/gear';

interface FeaturedGearSectionProps {
  gearItems: GearListItem[];
}

export function FeaturedGearSection({
  gearItems,
}: FeaturedGearSectionProps) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-20 size-96 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        <div className="absolute bottom-0 right-0 size-80 rounded-full bg-amber-500/[0.04] blur-3xl dark:bg-amber-500/[0.08]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="size-4" />
              Featured gear
            </div>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Find the right gear for your next project.
            </h2>

            <p className="mt-4 text-muted-foreground sm:text-lg">
              Discover professional equipment from trusted
              providers and rent what you need, when you need it.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-fit cursor-pointer rounded-full"
          >
            <Link href="/gear">
              Browse all gear
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {gearItems.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gearItems.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-border/60 bg-muted/20 p-12 text-center">
            <p className="font-medium">No featured gear yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once providers list equipment, {"it'll"} show up here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}