'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import type { GearListItem } from '@/types/gear';
import { formatTaka } from '@/lib/format';

interface HeroGearSliderProps {
  items: GearListItem[];
}

const ROTATE_INTERVAL_MS = 4000;

export function HeroGearSlider({ items }: HeroGearSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % items.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Ambient glow behind the frame */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-xl">
        <div className="relative aspect-[4/5]">
          {items.map((gear, index) => {
            const primaryImage =
              gear.images.find((image) => image.isPrimary)?.imageUrl ??
              gear.images[0]?.imageUrl;

            return (
              <Link
                key={gear.id}
                href={`/gear/${gear.id}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === activeIndex
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
              >
                {primaryImage ? (
                  <>
                    {/*
                      Blurred, scaled-up backdrop fills the whole frame
                      regardless of the source photo's aspect ratio —
                      this is what avoids the "badly zoomed/cropped"
                      look for e.g. wide product shots forced into a
                      portrait frame.
                    */}
                    <Image
                      src={primaryImage}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="scale-125 object-cover opacity-60 blur-2xl saturate-150"
                      sizes="(max-width: 768px) 90vw, 384px"
                    />

                    <div className="absolute inset-0 bg-background/30" />

                    {/*
                      The real, uncropped photo sits on top — fully
                      visible every time, never cutting off the subject.
                    */}
                    <Image
                      src={primaryImage}
                      alt={gear.name}
                      fill
                      priority={index === 0}
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 90vw, 384px"
                    />
                  </>
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
                    No image
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Rental-tag styled info panel */}
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {gear.category.name}
                  </span>

                  <h3 className="mt-2 truncate font-display text-base font-semibold text-white">
                    {gear.name}
                  </h3>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-white">
                      {formatTaka(gear.pricePerDay)}
                      <span className="ml-1 text-xs font-normal text-white/70">
                        / day
                      </span>
                    </span>

                    {gear._count.reviews > 0 && (
                      <span className="flex items-center gap-1 text-xs text-white/80">
                        <Star className="size-3.5 fill-current text-amber-400" />
                        {gear.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((gear, index) => (
            <button
              key={gear.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${gear.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}