'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/validations/misc.schema';

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onBlur',
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onValidSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/account/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to change password.');
      }

      toast.success('Password changed successfully.');
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="oldPassword">Current password</Label>
        <Input
          id="oldPassword"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.oldPassword)}
          {...register('oldPassword')}
        />
        {errors.oldPassword && (
          <p className="text-xs text-destructive">
            {errors.oldPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.newPassword)}
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="outline"
        className="cursor-pointer rounded-full"
      >
        {isSubmitting ? (
          <Loader2 className="mr-1.5 size-4 animate-spin" />
        ) : (
          <KeyRound className="mr-1.5 size-4" />
        )}
        Change password
      </Button>
    </form>
  );
}