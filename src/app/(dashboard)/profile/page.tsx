import { redirect } from 'next/navigation';

import { serverFetch } from '@/lib/api/server-fetcher';
import type { ApiResponse } from '@/types/gear';
import type { UserProfileDetail } from '@/types/profile';

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ProfileForm } from '@/components/profile/ProfileForm';

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

export default async function ProfilePage() {
  const user = await getMe();

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell
      role={user.role}
      title="My Profile"
      description="Manage your personal information"
    >
      <div className="mx-auto max-w-2xl">
        <ProfileForm user={user} />
      </div>
    </DashboardShell>
  );
}