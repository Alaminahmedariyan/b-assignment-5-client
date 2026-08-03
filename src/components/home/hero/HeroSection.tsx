import Link from 'next/link';
import { ArrowRight, Camera, Laptop, TentTree } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { GearListItem } from '@/types/gear';
import { HeroGearSlider } from '../HomeGearSlider';


interface HeroSectionProps {
  /** Real featured gear (pass the same data FeaturedGearSection uses —
   * no separate fetch needed). Slider hides itself if empty. */
  featuredGear: GearListItem[];
}

const SPEC_CHIPS = [
  {
    icon: Camera,
    label: 'Camera & Photography',
    stat: 'From ৳800/day',
  },
  {
    icon: Laptop,
    label: 'Electronics',
    stat: 'From ৳500/day',
  },
  {
    icon: TentTree,
    label: 'Outdoor & Camping',
    stat: 'From ৳400/day',
  },
];

export function HeroSection({ featuredGear }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-20 lg:py-24">
      {/* ============================================================ */}
      {/* Background                                                    */}
      {/* ============================================================ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-0 size-[600px] -translate-y-1/3 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />

        <div className="absolute -right-32 bottom-0 size-72 rounded-full bg-amber-500/[0.06] blur-[100px] dark:bg-amber-500/[0.1]" />

        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ============================================================ */}
          {/* Left — copy + CTAs                                            */}
          {/* ============================================================ */}

          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            {/* Eyebrow */}

            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/40 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Now live across Bangladesh
            </div>

            {/* Headline */}

            <h1 className="mt-7 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Own less.
              <br />
              <span className="text-primary">Rent the good stuff.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
              Cameras, tools, tents, and tech — tagged, priced, and
              ready to book from verified providers near you.
              Skip the purchase, keep the project moving.
            </p>

            {/* CTAs */}

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full cursor-pointer rounded-full px-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)] sm:w-auto"
              >
                <Link href="/gear">
                  Browse gear
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full cursor-pointer rounded-full px-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 sm:w-auto"
              >
                {/* Was /provider/register — routes into the register flow
                    with the provider role preselected. */}
                <Link href="/register?as=provider">List your gear</Link>
              </Button>
            </div>

            {/* Spec chips */}

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {SPEC_CHIPS.map((chip) => {
                const Icon = chip.icon;

                return (
                  <div
                    key={chip.label}
                    className="group relative flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 py-2.5 pl-3 pr-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(37,99,235,0.1)]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full border border-border/60 bg-background"
                    />

                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-4" />
                    </div>

                    <div className="text-left">
                      <p className="text-xs font-medium text-muted-foreground">
                        {chip.label}
                      </p>

                      <p className="text-sm font-semibold tracking-tight">
                        {chip.stat}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* Right — real gear showcase (up to 10 items, rotating)         */}
          {/* ============================================================ */}

          <HeroGearSlider items={featuredGear} />
        </div>
      </div>
    </section>
  );
}