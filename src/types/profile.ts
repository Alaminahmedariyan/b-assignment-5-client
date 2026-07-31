export interface UserProfileDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  nidUrl: string | null;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'VERIFICATION_PENDING';
  provider: 'LOCAL' | 'GOOGLE';
  createdAt: string;
}