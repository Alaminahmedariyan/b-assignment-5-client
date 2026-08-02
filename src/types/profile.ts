import { UserRole, UserStatus } from "./user";

export interface UserProfileDetail {
  id: string;
  name: string;
  email: string;

  image?: string | null;

  phone?: string | null;
  address?: string | null;
  nidUrl?: string | null;

  role: UserRole;
  status: UserStatus;

  createdAt: string;
  updatedAt: string;
}