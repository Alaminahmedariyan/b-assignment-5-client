import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/Footer';

// ⚠️ VERIFY THIS PATH — you moved the `service` folder out of `app/`
// earlier in this project. Update the import below to match wherever
// `getCurrentUser` actually lives now (e.g. `@/service/auth.service` or
// `@/lib/auth/auth.service`), otherwise this will break the build.
import { getCurrentUser } from '@/service/auth.service';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await getCurrentUser();

  const user = response?.success
    ? response.data
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}