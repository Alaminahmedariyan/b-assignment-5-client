export interface CustomerPayment {
  id: string;
  transactionId: string;
  amount: string;
  refundAmount: string | null;
  method: 'STRIPE' | 'SSLCOMMERZ';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  createdAt: string;

  rentalOrder: {
    id: string;
    orderNumber: string;
    totalAmount: string;
    status: string;
    paymentStatus: string;
  };
}