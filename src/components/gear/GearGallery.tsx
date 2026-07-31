'use client';

import { useState } from 'react';
import Image from 'next/image';

import type { GearImage } from '@/types/gear';

interface GearGalleryProps {
  images: GearImage[];
  gearName: string;
}

export function GearGallery({ images, gearName }: GearGalleryProps) {
  const sortedImages =
    images.length > 0
      ? [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sortedImages[activeIndex];

  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-border/60 bg-muted text-sm text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-sm">
        <Image
          src={activeImage.imageUrl}
          alt={gearName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>

      {sortedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${gearName}`}
              aria-current={index === activeIndex}
              className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                index === activeIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-border'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}