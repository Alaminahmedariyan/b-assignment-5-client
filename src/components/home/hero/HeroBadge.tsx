import { Sparkles } from 'lucide-react';

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-xl">
      <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-3.5" />
      </span>

      <span className="text-muted-foreground">
        Built for people who build what&apos;s next
      </span>
    </div>
  );
}