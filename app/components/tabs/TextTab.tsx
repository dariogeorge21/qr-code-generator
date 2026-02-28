'use client';

import { useQRStore } from '../../store/useQRStore';
import { FONT_FAMILIES, FONT_WEIGHTS } from '../../types/qr';
import type { TextAlign } from '../../types/qr';

export default function TextTab() {
  const { bgText, bgTextFontFamily, bgTextFontSize, bgTextColor, bgTextOpacity, bgTextX, bgTextY, bgTextRotation, bgTextRepeat, 
          title, titleFontFamily, titleFontSize, titleFontWeight, titleColor, titleAlign, titleSpacing,
          caption, captionFontFamily, captionFontSize, captionFontWeight, captionColor, captionAlign, captionSpacing, set } = useQRStore();

  const ControlGroup = ({ title, children, active }: { title: string, children: React.ReactNode, active?: boolean }) => (
    <div className={`p-5 rounded-3xl border transition-all ${active ? 'bg-[var(--color-secondary)]/5 border-[var(--color-secondary)]/20' : 'bg-gray-50 dark:bg-white/5 border-[var(--color-border)]'}`}>
      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">{title}</h4>
      <div className="space-y-6">{children}</div>
    </div>
  );

  const AlignToggle = (current: TextAlign, prefix: 'title' | 'caption') => (
    <div className="flex bg-white dark:bg-black/40 p-1 rounded-xl border border-[var(--color-border)]">
      {(['left', 'center', 'right'] as const).map((a) => (
        <button
          key={a}
          onClick={() => set({ [`${prefix}Align`]: a } as any)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${current === a ? 'bg-[var(--color-secondary)] text-white shadow-lg' : 'opacity-50 hover:opacity-100'}`}
        >
          {a === 'left' ? '⬅' : a === 'center' ? '中央' : '➡'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <ControlGroup title="Background Watermark" active={!!bgText}>
        <input
          type="text" value={bgText} onChange={(e) => set({ bgText: e.target.value })}
          placeholder="Hidden background message..."
          className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-black/40 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-secondary)] outline-none"
        />
        {bgText && (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-50">Opacity</label>
              <input type="range" min="0.01" max="0.5" step="0.01" value={bgTextOpacity} onChange={(e) => set({ bgTextOpacity: Number(e.target.value) })} className="w-full accent-[var(--color-secondary)]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-50">Rotation</label>
              <input type="range" min="-180" max="180" value={bgTextRotation} onChange={(e) => set({ bgTextRotation: Number(e.target.value) })} className="w-full accent-[var(--color-secondary)]" />
            </div>
          </div>
        )}
      </ControlGroup>

      <ControlGroup title="Header Title" active={!!title}>
        <input
          type="text" value={title} onChange={(e) => set({ title: e.target.value })}
          placeholder="Top headline..."
          className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-black/40 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-secondary)] outline-none"
        />
        {title && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <select value={titleFontFamily} onChange={(e) => set({ titleFontFamily: e.target.value })} className="bg-transparent border-b-2 border-[var(--color-border)] py-1 text-sm outline-none">
                {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <input type="color" value={titleColor} onChange={(e) => set({ titleColor: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" />
            </div>
            {AlignToggle(titleAlign, 'title')}
          </div>
        )}
      </ControlGroup>

      <ControlGroup title="Footer Caption" active={!!caption}>
        <input
          type="text" value={caption} onChange={(e) => set({ caption: e.target.value })}
          placeholder="Bottom instruction..."
          className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-black/40 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-secondary)] outline-none"
        />
        {caption && (
          <div className="space-y-6 pt-2">
            <div className="flex gap-4 items-center">
               <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase opacity-40">Font Size</span>
                  <input type="range" min="8" max="36" value={captionFontSize} onChange={(e) => set({ captionFontSize: Number(e.target.value) })} className="w-full accent-[var(--color-secondary)]" />
               </div>
               <input type="color" value={captionColor} onChange={(e) => set({ captionColor: e.target.value })} className="w-12 h-10 rounded-xl" />
            </div>
            {AlignToggle(captionAlign, 'caption')}
          </div>
        )}
      </ControlGroup>
    </div>
  );
}