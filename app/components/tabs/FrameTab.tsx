'use client';

import { useQRStore } from '../../store/useQRStore';
import type { BorderType } from '../../types/qr';

export default function FrameTab() {
  const { frameEnabled, borderWidth, borderColor, borderRadius, borderType, padding, shadowEnabled, shadowX, shadowY, shadowBlur, shadowColor, set } = useQRStore();

  const borderTypes: { key: BorderType; label: string; icon: string }[] = [
    { key: 'solid', label: 'Solid', icon: '⎯' },
    { key: 'dashed', label: 'Dashed', icon: '╌' },
    { key: 'dotted', label: 'Dotted', icon: '⋯' },
    { key: 'double', label: 'Double', icon: '═' },
  ];

  const sliderSection = (label: string, value: number, min: number, max: number, onChange: (v: number) => void, unit = 'px') => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-md">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-[var(--color-secondary)] bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Frame Master Switch */}
      <section className="flex items-center justify-between p-4 bg-[var(--color-secondary)]/5 rounded-2xl border border-[var(--color-secondary)]/20">
        <div>
          <h4 className="text-sm font-bold text-[var(--color-text)]">Enable Outer Frame</h4>
          <p className="text-[10px] opacity-60">Add a stylish border around your code</p>
        </div>
        <button
          onClick={() => set({ frameEnabled: !frameEnabled })}
          className={`w-12 h-6 rounded-full transition-all ${frameEnabled ? 'bg-[var(--color-secondary)]' : 'bg-gray-300 dark:bg-gray-700'} relative`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${frameEnabled ? 'left-7' : 'left-1'}`} />
        </button>
      </section>

      {frameEnabled && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-4 gap-2">
            {borderTypes.map((bt) => (
              <button
                key={bt.key}
                onClick={() => set({ borderType: bt.key })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  borderType === bt.key ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 text-[var(--color-secondary)]' : 'border-[var(--color-border)] opacity-60'
                }`}
              >
                <span className="text-lg font-bold">{bt.icon}</span>
                <span className="text-[9px] font-bold uppercase">{bt.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-6 border border-[var(--color-border)]">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Frame Color</label>
              <div className="flex gap-2">
                <input type="color" value={borderColor} onChange={(e) => set({ borderColor: e.target.value })} className="w-12 h-10 rounded-lg" />
                <input type="text" value={borderColor} onChange={(e) => set({ borderColor: e.target.value })} className="flex-1 px-3 bg-white dark:bg-black/20 border border-[var(--color-border)] rounded-xl text-sm font-mono" />
              </div>
            </div>
            {sliderSection('Thickness', borderWidth, 1, 16, (v) => set({ borderWidth: v }))}
            {sliderSection('Corner Radius', borderRadius, 0, 50, (v) => set({ borderRadius: v }))}
          </div>
        </div>
      )}

      {/* Shadow & Spacing */}
      <section className="space-y-6 border-t border-[var(--color-border)] pt-6">
        {sliderSection('Container Padding', padding, 0, 80, (v) => set({ padding: v }))}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Soft Drop Shadow</h4>
            <button
              onClick={() => set({ shadowEnabled: !shadowEnabled })}
              className={`w-10 h-5 rounded-full transition-all ${shadowEnabled ? 'bg-[var(--color-secondary)]' : 'bg-gray-300 dark:bg-gray-700'} relative`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${shadowEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {shadowEnabled && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border)] animate-in fade-in duration-300">
               <div className="col-span-2">{sliderSection('Blur Strength', shadowBlur, 0, 60, (v) => set({ shadowBlur: v }))}</div>
               {sliderSection('Offset X', shadowX, -20, 20, (v) => set({ shadowX: v }))}
               {sliderSection('Offset Y', shadowY, -20, 20, (v) => set({ shadowY: v }))}
            </div>
          )}
        </div>
        </section>
    </div>
  );
}