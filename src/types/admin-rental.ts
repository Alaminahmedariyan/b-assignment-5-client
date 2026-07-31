import type { RentalPayment, ItemRentalStatus, OrderStatus, PaymentStatus } from './rental';

export interface AdminRentalItem {
  id: string;
  quantity: number;
  subtotal: string;
  startDate: string;
  endDate: string;
  status: ItemRentalStatus;

  gearItem: {
    id: string;
    name: string;
    images: { imageUrl: string; isPrimary: boolean }[];
    providerId: string;
  };
}

export interface AdminRentalOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  createdAt: string;

  customer: {
    id: string;
    name: string;
    email: string;
  };

  payments: RentalPayment[];
  items: AdminRentalItem[];
}