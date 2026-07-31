'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';

import {
  AuthActionState,
  loginAction,
} from '../_actions/authActions';

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
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

import {
  loginSchema,
  type LoginFormValues,
} from '@/lib/validations/auth.schema';

const initialState: AuthActionState = {
  success: false,
  message: '',
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  // React Hook Form validates client-side first (Zod schema). Only once
  // that passes do we hand off to the existing Server Action — built as
  // FormData so `loginAction`'s signature doesn't need to change at all.
  const onValidSubmit = (values: LoginFormValues) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    if (redirectTo) formData.append('redirect', redirectTo);
    formAction(formData);
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card/80 shadow-2xl shadow-black/5 backdrop-blur-2xl">
      <div className="h-1 w-full bg-primary" />

      <CardHeader className="space-y-4 px-6 pb-6 pt-8 sm:px-8 sm:pt-9">
        <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <LockKeyhole className="size-5 text-primary" />
        </div>

        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back
          </CardTitle>

          <CardDescription className="text-sm leading-6">
            Sign in to your GearUp account and continue
            your journey.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8 sm:px-8 sm:pb-9">
        <GoogleSignInButton />

        <div className="relative py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onValidSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="h-11 bg-background/60 transition-all focus-visible:ring-2"
              {...register('email')}
            />

            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className="h-11 bg-background/60 transition-all focus-visible:ring-2"
              {...register('password')}
            />

            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-full font-semibold shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 hover:shadow-primary/20"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                New to GearUp?
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Create your account and start exploring.
          </p>

          <Button asChild variant="outline" className="h-11 w-full">
            <Link href="/register">Create an account</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}