'use client';

import { useQRStore } from '../../store/useQRStore';
import { DOT_STYLES, CORNER_SQUARE_STYLES, CORNER_DOT_STYLES } from '../../types/qr';

export default function StyleTab() {
  const { dotType, cornerSquareType, cornerDotType, useCustomEyeColors, cornerSquareColor, cornerDotColor, qrSize, errorCorrectionLevel, set } = useQRStore();

  const StyleButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-95 ${
        active ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-inner' : 'border-[var(--color-border)] grayscale opacity-60'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="space-y-10">
      <section>
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pattern Style</h4>
        <div className="grid grid-cols-3 gap-3">
          {DOT_STYLES.map((s) => (
            <StyleButton key={s.key} active={dotType === s.key} onClick={() => set({ dotType: s.key })} icon={s.icon} label={s.label} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Eye Frame</h4>
          <div className="grid grid-cols-2 gap-3">
            {CORNER_SQUARE_STYLES.slice(0, 4).map((s) => (
              <StyleButton key={s.key} active={cornerSquareType === s.key} onClick={() => set({ cornerSquareType: s.key })} icon={s.icon} label={s.label} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Eye Dot</h4>
          <div className="grid grid-cols-2 gap-3">
            {CORNER_DOT_STYLES.map((s) => (
              <StyleButton key={s.key} active={cornerDotType === s.key} onClick={() => set({ cornerDotType: s.key })} icon={s.icon} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <label className="text-xs font-black uppercase tracking-widest">Custom Eye Colors</label>
          <button
            onClick={() => set({ useCustomEyeColors: !useCustomEyeColors })}
            className={`w-12 h-6 rounded-full transition-all ${useCustomEyeColors ? 'bg-[var(--color-secondary)]' : 'bg-gray-300 dark:bg-gray-700'} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useCustomEyeColors ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {useCustomEyeColors && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase opacity-50">Frame</span>
              <input type="color" value={cornerSquareColor} onChange={(e) => set({ cornerSquareColor: e.target.value })} className="w-full h-10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase opacity-50">Dot</span>
              <input type="color" value={cornerDotColor} onChange={(e) => set({ cornerDotColor: e.target.value })} className="w-full h-10 rounded-xl" />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Error Correction</h4>
          <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase">Scan Reliability</span>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl border border-[var(--color-border)]">
          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
            <button
              key={level}
              onClick={() => set({ errorCorrectionLevel: level })}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                errorCorrectionLevel === level ? 'bg-white dark:bg-black shadow-md text-[var(--color-secondary)]' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}