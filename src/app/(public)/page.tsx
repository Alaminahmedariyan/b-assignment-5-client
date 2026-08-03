
import { FeaturedGearSection } from '@/components/home/FeaturedGearSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyGearUpSection } from '@/components/home/WhyGearUpSection';
import { HomeCTASection } from '@/components/home/HomeCTASection';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse, GearListItem } from '@/types/gear';
import { HeroSection } from '@/components/home/hero/HeroSection';

async function getFeaturedGear(): Promise<GearListItem[]> {
  try {
    // Fetch 10 — enough for the hero slider to actually rotate through
    // a meaningful set. The Featured Gear grid below only shows the
    // first 6 of these (cleaner 3-column layout), no separate fetch.
    const response = await serverFetch<ApiResponse<GearListItem[]>>(
      '/api/v1/gears?limit=10&sortBy=createdAt&sortOrder=desc',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load featured gear:', error);
    return [];
  }
}

export default async function HomePage() {
  const gearItems = await getFeaturedGear();

  return (
    <>
      <HeroSection featuredGear={gearItems} />
      <FeaturedGearSection gearItems={gearItems.slice(0, 6)} />
      <CategoriesSection />
      <HowItWorksSection />
      <WhyGearUpSection />
      <HomeCTASection />
    </>
  );
}