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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: response.credential }),
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
          error instanceof Error ? error.message : 'Something went wrong.',
        );
        setIsProcessing(false);
      }
    },
    [router],
  );

  // 1. Load the Google Identity Services script once safely
  useEffect(() => {
    if (window.google?.accounts?.id) {
      // FIX: Synchronous setState issue fixed using queueMicrotask
      queueMicrotask(() => setScriptLoaded(true));
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 2. Initialize + Render Google Button
  useEffect(() => {
    if (!scriptLoaded || !clientId || !buttonRef.current || !window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
    });

    // Clear previous button elements before rendering new one
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
      <p className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
        Google sign-in {"isn't"} configured — missing
        NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </p>
    );
  }

  return (
    <div className="relative flex justify-center">
      {isProcessing ? (
        <div className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border/60 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Signing you in...
        </div>
      ) : (
        <div ref={buttonRef} className={!scriptLoaded ? 'opacity-0' : ''} />
      )}

      {!scriptLoaded && !isProcessing && (
        <div className="absolute h-11 w-[320px] animate-pulse rounded-full bg-muted" />
      )}
    </div>
  );
}