'use client';

interface StepIndicatorProps {
  current: number;
  total: number;
  label: string;
}

export default function StepIndicator({ current, total, label }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < current
                ? 'w-8 bg-[var(--color-secondary)]'
                : i === current
                ? 'w-8 bg-[var(--color-secondary)]'
                : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Step {current} of {total} — {label}
      </span>
    </div>
  );
}
