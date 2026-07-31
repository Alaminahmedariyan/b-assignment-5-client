/* ====================================================================== */
/* API envelope — matches sendResponse() exactly                          */
/* ====================================================================== */

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
}

/* ====================================================================== */
/* Category                                                                */
/* ====================================================================== */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export interface CategoryWithRelations extends Category {
  parent: { id: string; name: string; slug: string } | null;
  children: { id: string; name: string; slug: string }[];
}

/* ====================================================================== */
/* Gear                                                                     */
/* pricePerDay / originalPricePerDay are Prisma Decimal → arrive as STRING. */
/* Always convert with toNumber()/formatTaka() before math or display.      */
/* ====================================================================== */

export interface GearImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
  gearItemId: string;
}

export interface GearProvider {
  id: string;
  name: string;
  email: string;
  /** Set via the provider's own Profile page — may be null if unset. */
  address: string | null;
}

export interface GearListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  pricePerDay: string;
  /** Present only if the provider set a "was" price for a discount. */
  originalPricePerDay: string | null;
  totalQuantity: number;
  specifications: Record<string, string> | null;
  isListed: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category;
  provider: GearProvider;
  images: GearImage[];

  _count: {
    reviews: number;
  };

  /** Computed server-side via a groupBy aggregate — real average, 0 if no reviews. */
  averageRating: number;
  /** Count of RETURNED rental items — a genuine "times rented" figure. */
  completedRentals: number;
}

export interface GearReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  };
}

export interface GearDetail extends GearListItem {
  reviews: GearReview[];
}

export interface GearReviewsResponse {
  averageRating: number;
  totalReviews: number;
  reviews: GearReview[];
}

/* ====================================================================== */
/* Availability                                                            */
/* ====================================================================== */

export interface GearAvailability {
  gearId: string;
  totalQuantity: number;
  bookedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
}