export type UserRole =
  | 'CUSTOMER'
  | 'PROVIDER'
  | 'ADMIN';

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED'
  | 'SUSPENDED';

export interface User {
  id: string;

  name: string;

  email: string;

  phone?: string | null;

  address?: string | null;

  nidUrl?: string | null;

  role: UserRole;

  status: UserStatus;

  createdAt: string;

  updatedAt: string;
}