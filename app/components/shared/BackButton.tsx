'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href, label }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-[var(--color-secondary)] dark:text-[var(--color-tertiary)] hover:opacity-70 transition-opacity mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] rounded-lg px-2 py-1 -ml-2 cursor-pointer"
      aria-label={label || 'Go back'}
    >
      <ArrowLeft className="w-5 h-5" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
