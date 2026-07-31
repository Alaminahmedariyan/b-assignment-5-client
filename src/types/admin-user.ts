export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'VERIFICATION_PENDING';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  status: UserStatus;
  provider: 'LOCAL' | 'GOOGLE';
  createdAt: string;
}