import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageSquare } from 'lucide-react';

import type { GearListItem } from '@/types/gear';
import { formatTaka } from '@/lib/format';

interface GearCardProps {
  gear: GearListItem;
}

export function GearCard({ gear }: GearCardProps) {
  const primaryImage =
    gear.images.find((image) => image.isPrimary)?.imageUrl ??
    gear.images[0]?.imageUrl;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg">
      {/* ============================================================ */}
      {/* Image                                                         */}
      {/* ============================================================ */}

      <Link
        href={`/gear/${gear.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={gear.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {gear.category.name}
          </span>
        </div>
      </Link>

      {/* ============================================================ */}
      {/* Content                                                       */}
      {/* ============================================================ */}

      <div className="p-5 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/gear/${gear.id}`}>
              <h3 className="truncate font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                {gear.name}
              </h3>
            </Link>

            {gear.brand && (
              <p className="mt-1 text-sm text-muted-foreground">
                {gear.brand}
              </p>
            )}
          </div>

          {/* Only a review COUNT is available at list level — no average
              rating until you open the detail page (see GearDetail). */}
          {gear._count.reviews > 0 && (
            <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="size-3.5" />
              <span>{gear._count.reviews}</span>
            </div>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {gear.description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{gear.provider.name}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Rental tag — signature price element                         */}
      {/* ============================================================ */}

      <Link
        href={`/gear/${gear.id}`}
        className="relative mx-5 mb-5 flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 transition-colors duration-300 group-hover:border-primary/50 group-hover:bg-primary/10"
      >
        <span
          aria-hidden="true"
          className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full border border-border/60 bg-background"
        />

        <div>
          <span className="font-display text-xl font-bold tracking-tight">
            {formatTaka(gear.pricePerDay)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">/ day</span>
        </div>

        <span className="text-sm font-semibold text-primary">
          View details →
        </span>
      </Link>
    </article>
  );
}