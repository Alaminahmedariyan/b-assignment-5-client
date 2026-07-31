import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** e.g. "+12% this month" — omit if you don't have a real trend to show */
  hint?: string;
  tone?: 'primary' | 'tag' | 'success' | 'destructive';
}

const TONE_STYLES: Record<
  NonNullable<StatCardProps['tone']>,
  { chip: string; icon: string }
> = {
  primary: {
    chip: 'bg-primary/10',
    icon: 'text-primary',
  },
  tag: {
    chip: 'bg-tag/15',
    icon: 'text-tag-foreground',
  },
  success: {
    chip: 'bg-success/15',
    icon: 'text-success',
  },
  destructive: {
    chip: 'bg-destructive/10',
    icon: 'text-destructive',
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = 'primary',
}: StatCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className="card-elevate rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {value}
          </p>

          {hint && (
            <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>

        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${styles.chip}`}
        >
          <Icon className={`size-5 ${styles.icon}`} />
        </div>
      </div>
    </div>
  );
}