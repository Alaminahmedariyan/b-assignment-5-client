'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { UserProfileDetail } from '@/types/profile';
import {
  profileSchema,
  type ProfileFormValues,
} from '@/lib/validations/misc.schema';

interface ProfileFormProps {
  user: UserProfileDetail;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      name: user.name,
      phone: user.phone ?? '',
      address: user.address ?? '',
    },
  });

  const onValidSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone || undefined,
          address: values.address || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message ?? 'Failed to update profile.');
      }

      toast.success('Profile updated.');
      router.refresh();
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
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled className="opacity-60" />
        <p className="text-xs text-muted-foreground">
          Email {"can't"} be changed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+880 1XXXXXXXXX"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Your address"
          aria-invalid={Boolean(errors.address)}
          {...register('address')}
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer rounded-full"
      >
        {isSubmitting ? (
          <Loader2 className="mr-1.5 size-4 animate-spin" />
        ) : (
          <Save className="mr-1.5 size-4" />
        )}
        Save changes
      </Button>
    </form>
  );
}