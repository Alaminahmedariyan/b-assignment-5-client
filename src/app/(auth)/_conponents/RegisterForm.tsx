'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Package, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  AuthActionState,
  registerAction,
} from '../_actions/authActions';

import {
  registerSchema,
  type RegisterFormValues,
} from '@/lib/validations/auth.schema';

const initialState: AuthActionState = {
  success: false,
  message: '',
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultRole: 'CUSTOMER' | 'PROVIDER' =
    searchParams.get('as') === 'provider' ? 'PROVIDER' : 'CUSTOMER';

  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      role: defaultRole,
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
    },
  });

  const role = watch('role');

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      router.push('/login');
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  const onValidSubmit = (values: RegisterFormValues) => {
    const formData = new FormData();
    formData.append('role', values.role);
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    if (values.phone) formData.append('phone', values.phone);
    if (values.address) formData.append('address', values.address);

    formAction(formData);
  };

  return (
    <Card className="border-border/60 bg-card/80 shadow-xl backdrop-blur-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join GearUp and start renting quality gear.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onValidSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Role selector */}
          <div className="space-y-2">
            <Label>I want to...</Label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('role', 'CUSTOMER')}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                  role === 'CUSTOMER'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border/60 text-muted-foreground hover:border-primary/30'
                }`}
              >
                <UserIcon className="size-5" />
                Rent gear
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'PROVIDER')}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                  role === 'PROVIDER'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border/60 text-muted-foreground hover:border-primary/30'
                }`}
              >
                <Package className="size-5" />
                List my gear
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              disabled={pending}
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={pending}
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXXXXXXXX"
              autoComplete="tel"
              disabled={pending}
              aria-invalid={Boolean(errors.phone)}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Your address"
              autoComplete="street-address"
              disabled={pending}
              aria-invalid={Boolean(errors.address)}
              {...register('address')}
            />
            {role === 'PROVIDER' && (
              <p className="text-xs text-muted-foreground">
                Shown to customers as your gear's pickup location.
              </p>
            )}
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              disabled={pending}
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                At least 8 characters, with one uppercase letter and one number.
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : role === 'PROVIDER' ? (
              'Create provider account'
            ) : (
              'Create account'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}