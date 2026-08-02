'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

const ROLE_REDIRECTS: Record<'CUSTOMER' | 'PROVIDER' | 'ADMIN', string> = {
  CUSTOMER: '/dashboard',
  PROVIDER: '/provider',
  ADMIN: '/admin',
};

export function GoogleSignInButton() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredential = useCallback(
    async (response: { credential: string }) => {
      setIsProcessing(true);

      try {
        const result = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: response.credential,
          }),
        });

        const data = await result.json();

        if (!result.ok || !data.success) {
          throw new Error(data?.message ?? 'Google sign-in failed.');
        }

        toast.success('Signed in with Google!');

        router.push(
          ROLE_REDIRECTS[data.role as keyof typeof ROLE_REDIRECTS] ?? '/',
        );

        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Something went wrong.',
        );

        setIsProcessing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (window.google?.accounts?.id) {
      queueMicrotask(() => setScriptLoaded(true));
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () =>
        setScriptLoaded(true),
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (
      !scriptLoaded ||
      !clientId ||
      !buttonRef.current ||
      !window.google
    ) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
    });

    buttonRef.current.innerHTML = '';

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'continue_with',
      shape: 'pill',
    });
  }, [scriptLoaded, clientId, handleCredential]);

  if (!clientId) {
    return (
      <p className="text-sm text-red-500">
        Google sign-in {"isn't"} configured — missing
        NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </p>
    );
  }

  return (
    <div className="relative w-[320px]">
      <div
        ref={buttonRef}
        className={`${!scriptLoaded ? 'opacity-0' : ''} ${
          isProcessing ? 'pointer-events-none opacity-60' : ''
        }`}
      />

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm font-medium text-gray-700">
            Signing in...
          </span>
        </div>
      )}

      {!scriptLoaded && !isProcessing && (
        <div className="absolute inset-0 h-11 animate-pulse rounded-full bg-muted" />
      )}
    </div>
  );
}