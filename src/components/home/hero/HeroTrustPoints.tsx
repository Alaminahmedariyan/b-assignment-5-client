import { Check } from 'lucide-react';

const TRUST_POINTS = [
  'Discover meaningful work',
  'Connect with creators',
];

export function HeroTrustPoints() {
  return (
    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
      {TRUST_POINTS.map((point) => (
        <div
          key={point}
          className="flex items-center gap-2"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-3" />
          </span>

          {point}
        </div>
      ))}
    </div>
  );
}