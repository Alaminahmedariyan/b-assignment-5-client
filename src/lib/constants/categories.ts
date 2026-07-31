import {
  Camera,
  Dumbbell,
  Laptop,
  Music,
  TentTree,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    name: 'Camera & Photography',
    slug: 'camera-photography',
    description:
      'Rent cameras, lenses, tripods, and photography equipment for your next project.',
    icon: Camera,
  },
  {
    name: 'Outdoor & Camping',
    slug: 'outdoor-camping',
    description:
      'Find tents, camping equipment, hiking gear, and outdoor essentials.',
    icon: TentTree,
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description:
      'Rent laptops, projectors, speakers, and other useful electronic equipment.',
    icon: Laptop,
  },
  {
    name: 'Music & Audio',
    slug: 'music-audio',
    description:
      'Discover musical instruments, microphones, speakers, and professional audio gear.',
    icon: Music,
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description:
      'Get access to sports and fitness equipment without buying expensive gear.',
    icon: Dumbbell,
  },
  {
    name: 'Tools & Equipment',
    slug: 'tools-equipment',
    description:
      'Rent professional tools and equipment for projects, repairs, and special work.',
    icon: Wrench,
  },
];