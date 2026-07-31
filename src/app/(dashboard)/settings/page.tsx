import { redirect } from 'next/navigation';
import { Mail } from 'lucide-react';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { UserProfileDetail } from '@/types/profile';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

// Official Google SVG Icon
function GoogleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

async function getMe(): Promise<UserProfileDetail | null> {
  try {
    const response = await serverFetch<ApiResponse<UserProfileDetail>>(
      '/api/v1/users/me',
      { cache: 'no-store' },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

export default async function SettingsPage() {
  const user = await getMe();

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell
      role={user.role}
      title="Settings"
      description="Account preferences and security"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {/* ================================================================ */}
        {/* Appearance                                                       */}
        {/* ================================================================ */}

        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div>
            <h2 className="font-display font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* ================================================================ */}
        {/* Sign-in method                                                   */}
        {/* ================================================================ */}

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display font-semibold">Sign-in method</h2>

          <div className="mt-3 flex items-center gap-2.5 text-sm text-muted-foreground">
            {user.provider === 'GOOGLE' ? (
              <>
                <GoogleIcon className="size-4" />
                Signed in with Google
              </>
            ) : (
              <>
                <Mail className="size-4" />
                Email and password
              </>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* Password — only for email/password accounts                      */}
        {/* ================================================================ */}

        {user.provider === 'LOCAL' && (
          <div>
            <h2 className="mb-3 font-display font-semibold">
              Change password
            </h2>
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}