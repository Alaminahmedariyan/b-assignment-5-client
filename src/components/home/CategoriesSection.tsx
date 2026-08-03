import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Dumbbell,
  Laptop,
  Music,
  Package,
  TentTree,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse, CategoryWithRelations } from '@/types/gear';

/**
 * Best-effort icon lookup by keyword in the category name — categories
 * are admin-managed and DB-driven now, so we can't hardcode a fixed
 * list. Anything unmatched falls back to a generic Package icon rather
 * than breaking.
 */
const ICON_KEYWORDS: [string, LucideIcon][] = [
  ['camera', Camera],
  ['photo', Camera],
  ['camp', TentTree],
  ['outdoor', TentTree],
  ['electronic', Laptop],
  ['tech', Laptop],
  ['music', Music],
  ['audio', Music],
  ['sport', Dumbbell],
  ['fitness', Dumbbell],
  ['tool', Wrench],
  ['equipment', Wrench],
];

function getIconForCategory(name: string): LucideIcon {
  const lower = name.toLowerCase();
  const match = ICON_KEYWORDS.find(([keyword]) => lower.includes(keyword));
  return match?.[1] ?? Package;
}

async function getTopLevelCategories(): Promise<CategoryWithRelations[]> {
  try {
    const response = await serverFetch<ApiResponse<CategoryWithRelations[]>>(
      '/api/v1/categories',
      { cache: 'no-store' },
    );

    return response.data.filter((category) => !category.parentId).slice(0, 6);
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

export async function CategoriesSection() {
  const categories = await getTopLevelCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="relative overflow-hidden border-t bg-muted/20 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 size-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        <div className="absolute bottom-0 left-1/4 size-[350px] rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Explore Categories
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Find the right gear for what you need.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Explore a wide range of equipment from trusted providers
              and rent exactly what you need, when you need it.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="w-fit cursor-pointer rounded-full transition-all duration-300 hover:bg-primary/10 hover:text-primary"
          >
            {/* Was /categories — no such listing page exists. */}
            <Link href="/gear">
              View all gear
              <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = getIconForCategory(category.name);

            return (
              // Was /categories/${category.slug} — no dedicated category
              // page exists. Links straight into the real gear listing,
              // pre-filtered by this category's actual DB id (the same
              // param GearFilters uses).
              <Link
                key={category.id}
                href={`/gear?category=${category.id}`}
                className="group block h-full"
              >
                <Card
                  size="sm"
                  className="h-full cursor-pointer p-0 transition-all duration-500 group-hover/card:-translate-y-1.5"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div
                      className="
                        relative flex size-12 shrink-0 items-center justify-center
                        rounded-2xl border border-primary/20 bg-primary/10 text-primary
                        transition-all duration-500 group-hover/card:scale-110
                        group-hover/card:border-primary/40 group-hover/card:bg-primary
                        group-hover/card:text-primary-foreground
                        group-hover/card:shadow-[0_8px_30px_rgba(59,130,246,0.25)]
                      "
                    >
                      <Icon className="size-5 transition-transform duration-500 group-hover/card:scale-110" />
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover/card:text-primary">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground transition-colors duration-300 group-hover/card:text-foreground/70">
                        {category.description ??
                          `Browse ${category.name.toLowerCase()} available for rent.`}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center pt-6 text-sm font-semibold text-primary">
                      <span>Explore</span>
                      <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover/card:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}