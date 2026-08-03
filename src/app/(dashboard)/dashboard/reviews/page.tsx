import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

interface MyReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  gearItem: {
    id: string;
    name: string;
    images: { imageUrl: string; isPrimary: boolean }[];
  };
}

async function getMyReviews(): Promise<MyReview[]> {
  try {
    const response = await serverFetch<ApiResponse<MyReview[]>>(
      '/api/v1/reviews/my-reviews',
      { cache: 'no-store' },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to load reviews:', error);
    return [];
  }
}

export default async function MyReviewsPage() {
  const reviews = await getMyReviews();

  return (
    <DashboardShell
      role="CUSTOMER"
      title="My Reviews"
      description="Reviews you've left on rented gear"
    >
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
          <Star className="size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">
            No reviews yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            After a rental is returned, you can leave a review from your
            rentals page — {"it'll"} show up here.
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
                    <Link
                      href={`/gear/${review.gearItem.id}`}
                      className="truncate font-medium hover:text-primary"
                    >
                      {review.gearItem.name}
                    </Link>

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