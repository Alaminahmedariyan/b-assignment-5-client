import {
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export function HeroFloatingCards() {
  return (
    <>
      {/* Discover Card */}

      <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-border/70 bg-background/90 p-3 shadow-xl backdrop-blur-xl sm:block lg:-left-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>

          <div>
            <p className="text-xs font-semibold">
              Discover what&apos;s next
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Ideas worth exploring
            </p>
          </div>
        </div>
      </div>

      {/* Growing Card */}

      <div className="absolute -right-3 -top-5 hidden rounded-2xl border border-border/70 bg-background/90 p-3 shadow-xl backdrop-blur-xl sm:block lg:-right-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </div>

          <div>
            <p className="text-xs font-semibold">
              Growing together
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Build. Connect. Grow.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}