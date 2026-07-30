import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

import { serverFetch } from '@/lib/api/server-fetcher';
import type {
  ApiResponse,
  GearDetail,
  GearListItem,
  GearReviewsResponse,
} from '@/types/gear';
import { formatTaka } from '@/lib/format';

import { GearGallery } from '@/components/gear/GearGallery';
import { GearBookingCard } from '@/components/gear/GearBookingCard';
import { GearSpecs, GearReviews } from '@/components/gear/GearSpecsReviews';
import { FeaturedGearSection } from '@/components/home/FeaturedGearSection';

interface GearDetailPageProps {
  params: Promise<{ id: string }>;
}

/* ==================================================================== */
/* Data fetching                                                          */
/* ==================================================================== */

async function getGearDetail(id: string): Promise<GearDetail | null> {
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

async function getGearReviews(id: string): Promise<GearReviewsResponse> {
  try {
    const response = await serverFetch<ApiResponse<GearReviewsResponse>>(
      `/api/v1/reviews/${id}`,
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to load reviews for "${id}":`, error);
    return { averageRating: 0, totalReviews: 0, reviews: [] };
  }
}

async function getRelatedGear(categoryId: string, excludeId: string) {
  try {
    const response = await serverFetch<ApiResponse<GearListItem[]>>(
      `/api/v1/gears?category=${categoryId}&limit=4`,
      { cache: 'no-store' },
    );

    return response.data.filter((item) => item.id !== excludeId).slice(0, 3);
  } catch (error) {
    console.error('Failed to load related gear:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: GearDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const gear = await getGearDetail(id);

  if (!gear) {
    return { title: 'Gear not found' };
  }

  return {
    title: gear.name,
    description: gear.description,
  };
}

/* ==================================================================== */
/* Page                                                                    */
/* ==================================================================== */

export default async function GearDetailPage({
  params,
}: GearDetailPageProps) {
  const { id } = await params;
  const gear = await getGearDetail(id);

  if (!gear) {
    notFound();
  }

  const [reviewsData, relatedGear] = await Promise.all([
    getGearReviews(id),
    getRelatedGear(gear.category.id, gear.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ================================================================ */}
      {/* Breadcrumb                                                        */}
      {/* ================================================================ */}

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/gear" className="hover:text-foreground">
          Gear
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/gear?category=${gear.category.id}`}
          className="hover:text-foreground"
        >
          {gear.category.name}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">{gear.name}</span>
      </nav>

      {/* ================================================================ */}
      {/* Main layout                                                       */}
      {/* ================================================================ */}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ============================================================== */}
        {/* Left — gallery + details                                       */}
        {/* ============================================================== */}

        <div className="space-y-8">
          <GearGallery images={gear.images} gearName={gear.name} />

          <div>
            <span className="rounded-full border border-dashed border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {gear.category.name}
            </span>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {gear.name}
            </h1>

            {gear.brand && (
              <p className="mt-1 text-muted-foreground">{gear.brand}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {reviewsData.totalReviews > 0 && (
                <span>
                  <span className="font-medium text-foreground">
                    {reviewsData.averageRating.toFixed(1)}
                  </span>{' '}
                  ({reviewsData.totalReviews} reviews)
                </span>
              )}

              <div className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                <span>{gear.provider.name}</span>
              </div>

              <span>{formatTaka(gear.pricePerDay)} / day</span>
            </div>

            <p className="mt-6 whitespace-pre-line leading-7 text-foreground/90">
              {gear.description}
            </p>
          </div>

          <GearSpecs specifications={gear.specifications} />

          <GearReviews
            reviews={reviewsData.reviews}
            averageRating={reviewsData.averageRating}
            totalReviews={reviewsData.totalReviews}
          />
        </div>

        {/* ============================================================== */}
        {/* Right — sticky booking card                                    */}
        {/* ============================================================== */}

        <div>
          <GearBookingCard
            gearId={gear.id}
            pricePerDay={gear.pricePerDay}
            totalQuantity={gear.totalQuantity}
          />
        </div>
      </div>

      {/* ================================================================ */}
      {/* Related gear                                                      */}
      {/* ================================================================ */}

      {relatedGear.length > 0 && (
        <div className="mt-20 border-t border-border/60 pt-4">
          <FeaturedGearSection gearItems={relatedGear} />
        </div>
      )}
    </div>
  );
}