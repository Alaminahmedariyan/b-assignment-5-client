import {
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
      {/* Outer Glow */}

      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-primary/10 blur-3xl dark:bg-primary/15"
      />

      {/* Main Preview */}

      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        {/* Browser Header */}

        <div className="flex h-12 items-center justify-between border-b border-border/60 px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="hidden h-6 w-40 rounded-md bg-muted/60 sm:block" />

          <div className="size-6 rounded-full bg-primary/10" />
        </div>

        {/* Preview Content */}

        <div className="p-5 sm:p-7">
          {/* Preview Heading */}

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 h-3 w-24 rounded-full bg-muted" />

              <div className="h-7 w-52 rounded-lg bg-foreground/10 sm:w-64" />
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="size-5" />
            </div>
          </div>

          {/* Featured Card */}

          <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <TrendingUp className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="h-4 w-3/4 rounded bg-foreground/10" />

                <div className="mt-2 h-3 w-full rounded bg-muted" />

                <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Trending
              </span>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Community
              </span>
            </div>
          </div>

          {/* Stats */}

          <div className="mt-4 grid grid-cols-3 gap-3">
            <PreviewStat icon={Users} />
            <PreviewStat icon={Sparkles} />
            <PreviewStat icon={TrendingUp} />
          </div>

          {/* Bottom Activity */}

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full border-2 border-background bg-primary/30" />
              <div className="size-8 rounded-full border-2 border-background bg-primary/50" />
              <div className="size-8 rounded-full border-2 border-background bg-primary/70" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="h-3 w-32 rounded bg-foreground/10" />

              <div className="mt-2 h-2.5 w-24 rounded bg-muted" />
            </div>

            <div className="size-8 rounded-lg bg-primary/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStat({
  icon: Icon,
}: {
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <Icon className="size-4 text-primary" />

      <div className="mt-3 h-5 w-12 rounded bg-foreground/10" />

      <div className="mt-2 h-2.5 w-16 rounded bg-muted" />
    </div>
  );
}