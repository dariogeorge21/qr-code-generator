'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-background)] transition-all"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-[var(--color-tertiary)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--color-primary)]" />
      )}
    </button>
  );
}
