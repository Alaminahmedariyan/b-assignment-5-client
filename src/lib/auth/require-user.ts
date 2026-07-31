import { getCurrentUser } from "@/service/auth.service";
import { redirect } from "next/navigation";

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export async function requireUser(allowedRoles?: UserRole[]) {
  const response = await getCurrentUser();

  if (!response.success || !response.data) {
    redirect("/login");
  }

  const user = response.data;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}
