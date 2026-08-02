import { redirect } from "next/navigation";
import { getCurrentUser } from "../../service/auth.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser = null;

  try {
    const response = await getCurrentUser();

    if (response?.success && response?.data) {
      currentUser = response.data;
    }
  } catch (error) {
    console.error("Dashboard authentication error:", error);
  }

  if (!currentUser) {
    redirect("/login");
  }

  return <main>{children}</main>;
}