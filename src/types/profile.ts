import { AuthProvider, UserRole, UserStatus } from "./user";

export interface UserProfileDetail {
  id: string;
  name: string;
  email: string;

  image?: string | null;

  phone?: string | null;
  address?: string | null;
  nidUrl?: string | null;

  provider: AuthProvider;

  role: UserRole;
  status: UserStatus;

  createdAt: string;
  updatedAt: string;
}