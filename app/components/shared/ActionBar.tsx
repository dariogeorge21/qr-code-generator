'use client';

import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

interface ActionBarProps {
  downloadHref: string;
  continueHref?: string;
  continueLabel?: string;
}

export default function ActionBar({ downloadHref, continueHref, continueLabel = 'Continue Customising' }: ActionBarProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-background)]/90 backdrop-blur-md border-t border-[var(--color-border)] p-4 md:static md:border-0 md:bg-transparent md:backdrop-blur-none md:p-0 md:mt-8">
      <div className="flex gap-3 max-w-7xl mx-auto">
        <button
          onClick={() => router.push(downloadHref)}
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[var(--color-secondary)] dark:bg-[var(--color-primary)] dark:text-black hover:opacity-90 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Now
        </button>
        {continueHref && (
          <button
            onClick={() => router.push(continueHref)}
            className="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] dark:border-[var(--color-tertiary)] dark:text-[var(--color-tertiary)] hover:bg-[var(--color-secondary)]/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            {continueLabel}
          </button>
        )}
      </div>
    </div>
  );
}
