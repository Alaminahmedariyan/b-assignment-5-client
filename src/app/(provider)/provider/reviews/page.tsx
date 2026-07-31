import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

interface ProviderReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  gearItem: {
    id: string;
    name: string;
    images: { imageUrl: string; isPrimary: boolean }[];
  };
  customer: {
    id: string;
    name: string;
  };
}

async function getProviderReviews(): Promise<ProviderReview[]> {
  try {
    const response = await serverFetch<ApiResponse<ProviderReview[]>>(
      '/api/v1/reviews/provider-reviews',
      { cache: 'no-store' },
    );

    // TEMP DEBUG — backend আসলে কী shape পাঠাচ্ছে দেখার জন্য।
    // shape কনফার্ম হয়ে গেলে এই লাইনটা মুছে ফেলবেন।
    console.log('RAW REVIEWS RESPONSE:', JSON.stringify(response, null, 2));

    // ডিফেন্সিভ গার্ড: response.data array না হলে ক্র্যাশ না করে খালি array রিটার্ন করবে।
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // response.data যদি { reviews: [...] } টাইপ nested object হয়, সেই কেসও কভার করা হলো।
    const maybeNested = response.data as unknown as { reviews?: ProviderReview[] };
    if (maybeNested && Array.isArray(maybeNested.reviews)) {
      return maybeNested.reviews;
    }

    console.warn(
      'Unexpected reviews response shape, falling back to empty list:',
      response.data,
    );
    return [];
  } catch (error) {
    console.error('Failed to load reviews:', error);
    return [];
  }
}

export default async function ProviderReviewsPage() {
  const reviews = await getProviderReviews();

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <DashboardShell
      role="PROVIDER"
      title="Reviews"
      description="What customers are saying about your gear"
    >
      {reviews.length > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-4">
          <Star className="size-5 fill-current text-amber-500" />
          <span className="font-display text-lg font-bold">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            average across {reviews.length} review
            {reviews.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <Star className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No reviews yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Once customers return and review your gear, their feedback
            will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const primaryImage =
              review.gearItem.images.find((img) => img.isPrimary)?.imageUrl ??
              review.gearItem.images[0]?.imageUrl;

            return (
              <div
                key={review.id}
                className="card-elevate flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <Link
                  href={`/gear/${review.gearItem.id}`}
                  className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  {primaryImage && (
                    <Image
                      src={primaryImage}
                      alt={review.gearItem.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/gear/${review.gearItem.id}`}
                        className="truncate font-medium hover:text-primary"
                      >
                        {review.gearItem.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        by {review.customer.name}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`size-3.5 ${
                            index < review.rating
                              ? 'fill-current text-amber-500'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  )}

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}