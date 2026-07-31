

export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  totalAdmins: number;

  totalCategories: number;
  totalGear: number;

  totalRentals: number;
  completedRentals: number;
  cancelledRentals: number;

  pendingPayments: number;
  completedPayments: number;

  totalRevenue: string | number;
}

export interface ProviderDashboardStats {
  totalGear: number;
  listedGear: number;
  unlistedGear: number;

  totalRentalItems: number;
  completedRentals: number;

  totalRevenue: string | number;
}

export interface CustomerDashboardStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;

  totalSpent: string | number;
}