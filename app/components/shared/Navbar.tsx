'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-background)]/80 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-wide text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          QR CODE STUDIO
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
