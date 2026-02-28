'use client';

import { useRef } from 'react';
import { useQRStore } from '../../store/useQRStore';

export default function LogoTab() {
  const { logoImage, logoSize, logoMargin, logoPadding, logoRadius, set } = useQRStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => set({ logoImage: ev.target?.result as string, errorCorrectionLevel: 'H' });
    reader.readAsDataURL(file);
  };

  const sliderControl = (label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void, displayValue: string) => (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
        <span>{label}</span>
        <span className="text-[var(--color-secondary)]">{displayValue}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-[var(--color-secondary)] bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Center Logo</h4>
        <p className="text-xs opacity-60">Brand your QR code with a custom icon</p>
      </header>

      <div className="group relative">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="logo-upload" />
        
        {!logoImage ? (
          <label
            htmlFor="logo-upload"
            className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-[var(--color-border)] rounded-3xl cursor-pointer hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 transition-all group"
          >
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🖼️</div>
            <div className="text-center">
              <span className="block text-sm font-bold">Upload Brand Logo</span>
              <span className="text-[10px] uppercase tracking-tighter opacity-40">SVG, PNG or JPG (Max 5MB)</span>
            </div>
          </label>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-square max-w-[200px] mx-auto p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-[var(--color-border)] flex items-center justify-center group">
              <img src={logoImage} alt="Logo" className="max-h-full object-contain shadow-2xl" style={{ borderRadius: `${logoRadius}px` }} />
              <button
                onClick={() => set({ logoImage: null })}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-all"
              >✕</button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border)]">
              {sliderControl('Logo Scale', logoSize, 0.1, 0.5, 0.01, (v) => set({ logoSize: v }), `${Math.round(logoSize * 100)}%`)}
              {sliderControl('Clearance Margin', logoMargin, 0, 20, 1, (v) => set({ logoMargin: v }), `${logoMargin}px`)}
              {sliderControl('Inner Padding', logoPadding, 0, 20, 1, (v) => set({ logoPadding: v }), `${logoPadding}px`)}
              {sliderControl('Corner Rounding', logoRadius, 0, 50, 1, (v) => set({ logoRadius: v }), `${logoRadius}px`)}
              
              <div className="flex items-center gap-3 p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
                <span className="text-lg">🛡️</span>
                <p className="text-[10px] font-bold leading-tight">Error correction set to HIGH to ensure scanning with logo.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}