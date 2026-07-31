'use client';

import { LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

import { logoutAction } from '@/app/(auth)/_actions/authActions';

function LogoutButtonContent() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      disabled={pending}
      className="w-full cursor-pointer justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="size-4" />

      <span>
        {pending
          ? 'Signing out...'
          : 'Sign out'}
      </span>
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutButtonContent />
    </form>
  );
}