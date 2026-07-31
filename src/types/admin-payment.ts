export interface AdminPayment {
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
    status: string;
    paymentStatus: string;
    totalAmount: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
  };
}