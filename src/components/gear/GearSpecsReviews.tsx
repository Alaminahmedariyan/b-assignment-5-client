import { Star, UserCircle } from 'lucide-react';

import type { GearReview } from '@/types/gear';

/* ====================================================================== */
/* Specifications                                                          */
/* ====================================================================== */

interface GearSpecsProps {
  specifications: Record<string, string> | null;
}

export function GearSpecs({ specifications }: GearSpecsProps) {
  const entries = specifications ? Object.entries(specifications) : [];

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Specifications</h2>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 border-b border-dashed border-border/60 py-1.5 text-sm"
          >
            <dt className="text-muted-foreground">{key}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ====================================================================== */
/* Reviews — powered by GET /api/v1/reviews/:gearId                       */
/* (this endpoint returns the real computed averageRating; the gear       */
/* detail endpoint itself only returns a raw, unaveraged reviews array)   */
/* ====================================================================== */

interface GearReviewsProps {
  reviews: GearReview[];
  averageRating: number;
  totalReviews: number;
}

export function GearReviews({
  reviews,
  averageRating,
  totalReviews,
}: GearReviewsProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-lg font-semibold">Reviews</h2>

        {totalReviews > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="size-4 fill-current text-amber-500" />
            <span className="font-semibold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({totalReviews})</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No reviews yet — be the first to rent and review this gear.
        </p>
      ) : (
        <ul className="mt-5 space-y-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex gap-3 border-t border-border/60 pt-5 first:border-t-0 first:pt-0"
            >
              <UserCircle className="size-9 shrink-0 text-muted-foreground" />

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {review.customer.name}
                  </span>

                  <div className="flex items-center gap-0.5">
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
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}