'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? 'Something went wrong.'
        );
      }

      toast.success(
        'If the email exists, a reset link has been sent.'
      );

      setEmail('');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold">
        Forgot Password
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email address and {"we'll"} send you a password
        reset link.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-5"
      >
        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Mail className="mr-2 size-4" />
          )}

          Send Reset Link
        </Button>
      </form>
    </div>
  );
}