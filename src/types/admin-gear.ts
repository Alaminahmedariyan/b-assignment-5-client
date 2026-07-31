export interface AdminGearItem {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  pricePerDay: string;
  isListed: boolean;
  createdAt: string;

  category: {
    id: string;
    name: string;
  };

  provider: {
    id: string;
    name: string;
    email: string;
  };

  images: {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }[];

  _count: {
    reviews: number;
  };
}