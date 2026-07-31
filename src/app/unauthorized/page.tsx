import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            Access Denied
          </h1>

          <p className="text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </main>
  );
}