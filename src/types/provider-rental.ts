import type { Category, GearImage } from './gear';
import type {
  ItemRentalStatus,
  OrderStatus,
  PaymentStatus,
  RentalPayment,
} from './rental';

export interface ProviderRentalGearItem {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  pricePerDay: string;
  images: GearImage[];
  category: Category;
}

export interface ProviderRentalOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  payments: RentalPayment[];
}

/**
 * The provider rentals endpoint returns a FLAT list of order items
 * (not grouped by order) — each item carries its own parent order and
 * gear item as nested objects. Matches rental.service.ts exactly.
 */
export interface ProviderRentalItem {
  id: string;
  quantity: number;
  pricePerDay: string;
  subtotal: string;
  securityDeposit: string;
  startDate: string;
  endDate: string;
  pickedUpAt: string | null;
  returnedAt: string | null;
  lateFee: string;
  status: ItemRentalStatus;
  createdAt: string;

  rentalOrder: ProviderRentalOrderSummary;
  gearItem: ProviderRentalGearItem;
}