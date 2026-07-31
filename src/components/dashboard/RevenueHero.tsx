import type { LucideIcon } from 'lucide-react';

interface RevenueHeroProps {
  label: string;
  value: string;
  icon: LucideIcon;
  sublabel?: string;
}

export function RevenueHero({
  label,
  value,
  icon: Icon,
  sublabel,
}: RevenueHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-tag/10 p-7 shadow-md sm:p-8">
      {/* Decorative blueprint grid, matches the hero section's texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {value}
          </p>

          {sublabel && (
            <p className="mt-2 text-sm text-muted-foreground">{sublabel}</p>
          )}
        </div>

        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
          <Icon className="size-7" />
        </div>
      </div>
    </div>
  );
}