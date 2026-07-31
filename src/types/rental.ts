import type { Category, GearImage } from './gear';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PLACED'
  | 'CANCELLED'
  | 'COMPLETED';

export type ItemRentalStatus =
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'RETURNED'
  | 'OVERDUE'
  | 'DAMAGED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface RentalGearItem {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  pricePerDay: string;
  images: GearImage[];
  category: Category;
}

export interface RentalOrderItem {
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
  gearItem: RentalGearItem;
}

export interface RentalPayment {
  id: string;
  transactionId: string;
  amount: string;
  refundAmount: string | null;
  method: 'STRIPE' | 'SSLCOMMERZ';
  status: PaymentStatus;
  paidAt: string | null;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  cancellationReason: string | null;
  createdAt: string;

  payments: RentalPayment[];
  items: RentalOrderItem[];
}