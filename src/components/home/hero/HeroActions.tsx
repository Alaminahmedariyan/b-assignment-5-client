import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button
        asChild
        size="lg"
        className="group h-12 rounded-full px-6 shadow-lg shadow-primary/20"
      >
        <Link href="/explore">
          Explore GearUp

          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </Button>

      <Button
        asChild
        size="lg"
        variant="outline"
        className="h-12 rounded-full border-border/70 bg-background/50 px-6 backdrop-blur-sm"
      >
        <Link href="/register">
          Share Your Work
        </Link>
      </Button>
    </div>
  );
}