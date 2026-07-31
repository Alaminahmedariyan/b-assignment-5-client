'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { AdminUser } from '@/types/admin-user';

const ROLE_STYLES: Record<AdminUser['role'], string> = {
  ADMIN: 'bg-tag/15 text-tag-foreground',
  PROVIDER: 'bg-primary/10 text-primary',
  CUSTOMER: 'bg-muted text-muted-foreground',
};

const STATUS_STYLES: Record<AdminUser['status'], string> = {
  ACTIVE: 'bg-success/15 text-success',
  SUSPENDED: 'bg-destructive/10 text-destructive',
  VERIFICATION_PENDING: 'bg-tag/15 text-tag-foreground',
};

interface UserRowProps {
  user: AdminUser;
}

export function UserRow({ user }: UserRowProps) {
  const router = useRouter();
  const [status, setStatus] = useState(user.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSuspend = async () => {
    const nextStatus = status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

    if (
      nextStatus === 'SUSPENDED' &&
      !window.confirm(`Suspend ${user.name}? They won't be able to log in.`)
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to update user status.');
      }

      setStatus(nextStatus);
      toast.success(
        nextStatus === 'SUSPENDED' ? 'User suspended.' : 'User activated.',
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="card-elevate flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      {/* Avatar */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {user.name.charAt(0).toUpperCase()}
      </div>

      {/* Identity */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{user.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {user.email}
        </p>
      </div>

      {/* Role badge */}
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${ROLE_STYLES[user.role]}`}
      >
        {user.role}
      </span>

      {/* Status badge */}
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
      >
        {status.replace('_', ' ')}
      </span>

      {/* Joined date */}
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        Joined{' '}
        {new Date(user.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>

      {/* Action — admins can't suspend other admins from this UI */}
      {user.role !== 'ADMIN' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleToggleSuspend}
          disabled={isUpdating}
          className={`shrink-0 cursor-pointer text-xs ${
            status === 'SUSPENDED'
              ? 'text-success hover:bg-success/10 hover:text-success'
              : 'text-destructive hover:bg-destructive/10 hover:text-destructive'
          }`}
        >
          {isUpdating ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : status === 'SUSPENDED' ? (
            <ShieldCheck className="mr-1.5 size-3.5" />
          ) : (
            <ShieldOff className="mr-1.5 size-3.5" />
          )}
          {status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
        </Button>
      )}
    </div>
  );
}