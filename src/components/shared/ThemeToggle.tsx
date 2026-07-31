'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative size-9 cursor-pointer rounded-full border border-border/60 bg-background/70 shadow-sm"
        aria-label="Toggle theme"
      >
        <span className="size-4.5" />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
      className="relative size-9 cursor-pointer overflow-hidden rounded-full border border-border/60 bg-background/70 shadow-sm transition-all duration-300 hover:bg-muted"
      aria-label={
        isDark
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
    >
      {isDark ? (
        <Sun
          className="size-4.5 transition-transform duration-300"
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="size-4.5 transition-transform duration-300"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}