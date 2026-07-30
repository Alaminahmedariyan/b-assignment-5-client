import { HeroActions } from './HeroActions';
import { HeroBadge } from './HeroBadge';

import { HeroTrustPoints } from './HeroTrustPoints';

export function HeroContent() {
  return (
    <div className="relative max-w-2xl">
      <HeroBadge />

      <h1 className="mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        Build what matters.

        <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
          Share what inspires.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        GearUp brings builders, creators, and ambitious minds
        together to discover ideas, showcase meaningful work,
        and turn inspiration into action.
      </p>

      <HeroActions />

      <HeroTrustPoints />
    </div>
  );
}