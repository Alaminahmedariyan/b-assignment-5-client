import { redirect } from "next/navigation";
import { getCurrentUser } from "../../service/auth.service";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium">Welcome, {currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}