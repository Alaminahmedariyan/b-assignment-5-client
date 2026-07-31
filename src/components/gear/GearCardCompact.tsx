import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

import type { GearListItem } from '@/types/gear';
import { calculateDiscountPercent, formatTaka } from '@/lib/format';

interface GearCardCompactProps {
  gear: GearListItem;
}

export function GearCardCompact({ gear }: GearCardCompactProps) {
  const primaryImage =
    gear.images.find((image) => image.isPrimary)?.imageUrl ??
    gear.images[0]?.imageUrl;

  const discountPercent = calculateDiscountPercent(
    gear.originalPricePerDay,
    gear.pricePerDay,
  );

  const hasRating = gear._count.reviews > 0;
  const hasSoldCount = gear.completedRentals > 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group block overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      {/* ============================================================ */}
      {/* Image                                                         */}
      {/* ============================================================ */}

      <div className="relative aspect-square overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={gear.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[11px] text-muted-foreground">
            No image
          </div>
        )}

        <span className="absolute left-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {gear.category.name}
        </span>

        {discountPercent !== null && (
          <span className="absolute right-2 top-2 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* ============================================================ */}
      {/* Content                                                       */}
      {/* ============================================================ */}

      <div className="space-y-1 p-2.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-sm leading-tight text-foreground transition-colors group-hover:text-primary">
          {gear.name}
        </h3>

        {/* Price row — current + struck-through original if discounted */}
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-base font-bold text-primary">
            {formatTaka(gear.pricePerDay)}
          </span>
          <span className="text-[11px] text-muted-foreground">/ day</span>

          {discountPercent !== null && (
            <span className="text-[11px] text-muted-foreground line-through">
              {formatTaka(gear.originalPricePerDay!)}
            </span>
          )}
        </div>

        {/* Rating + sold count */}
        {(hasRating || hasSoldCount) && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {hasRating && (
              <span className="flex items-center gap-0.5">
                <Star className="size-3 fill-current text-amber-500" />
                <span className="font-medium text-foreground">
                  {gear.averageRating.toFixed(1)}
                </span>
                <span>({gear._count.reviews})</span>
              </span>
            )}

            {hasRating && hasSoldCount && <span>·</span>}

            {hasSoldCount && <span>{gear.completedRentals} rented</span>}
          </div>
        )}

        {/* Location — only shown if the provider actually set an address */}
        {gear.provider.address && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{gear.provider.address}</span>
          </div>
        )}
      </div>
    </Link>
  );
}