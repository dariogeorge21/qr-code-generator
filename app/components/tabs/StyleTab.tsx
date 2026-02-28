'use client';

import { useQRStore } from '../../store/useQRStore';
import { DOT_STYLES, CORNER_SQUARE_STYLES, CORNER_DOT_STYLES } from '../../types/qr';

export default function StyleTab() {
  const dotType = useQRStore((s) => s.dotType);
  const cornerSquareType = useQRStore((s) => s.cornerSquareType);
  const cornerDotType = useQRStore((s) => s.cornerDotType);
  const useCustomEyeColors = useQRStore((s) => s.useCustomEyeColors);
  const cornerSquareColor = useQRStore((s) => s.cornerSquareColor);
  const cornerDotColor = useQRStore((s) => s.cornerDotColor);
  const qrSize = useQRStore((s) => s.qrSize);
  const errorCorrectionLevel = useQRStore((s) => s.errorCorrectionLevel);
  const set = useQRStore((s) => s.set);

  const btnClass = (active: boolean) =>
    `px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-1.5 ${
      active
        ? 'border-orange-600 dark:border-yellow-400 bg-orange-50 dark:bg-yellow-400/10 text-orange-600 dark:text-yellow-400 shadow-sm'
        : 'border-[var(--color-border)] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
    }`;

  return (
    <div className="space-y-6">
      {/* Dot Style */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Dot Style
        </h4>
        <div className="grid grid-cols-3 gap-2.5">
          {DOT_STYLES.map((s) => (
            <button key={s.key} onClick={() => set({ dotType: s.key })} className={btnClass(dotType === s.key)}>
              <span className="text-lg">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Square Style */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Eye Frame Style
        </h4>
        <div className="grid grid-cols-3 gap-2.5">
          {CORNER_SQUARE_STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => set({ cornerSquareType: s.key })}
              className={btnClass(cornerSquareType === s.key)}
            >
              <span className="text-lg">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Dot Style */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Eye Dot Style
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          {CORNER_DOT_STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => set({ cornerDotType: s.key })}
              className={btnClass(cornerDotType === s.key)}
            >
              <span className="text-lg">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Eye Colors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Custom Eye Colors
          </h4>
          <button
            onClick={() => set({ useCustomEyeColors: !useCustomEyeColors })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${
              useCustomEyeColors ? 'bg-orange-600 dark:bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                useCustomEyeColors ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {useCustomEyeColors && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-[var(--color-border)]">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Eye Frame Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cornerSquareColor}
                  onChange={(e) => set({ cornerSquareColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-2 border-[var(--color-border)] cursor-pointer bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={cornerSquareColor}
                  onChange={(e) => set({ cornerSquareColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] font-mono focus:ring-4 focus:ring-orange-500/20 focus:border-orange-600 dark:focus:border-yellow-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Eye Dot Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cornerDotColor}
                  onChange={(e) => set({ cornerDotColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-2 border-[var(--color-border)] cursor-pointer bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={cornerDotColor}
                  onChange={(e) => set({ cornerDotColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] font-mono focus:ring-4 focus:ring-orange-500/20 focus:border-orange-600 dark:focus:border-yellow-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Size */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex justify-between">
          <span>Preview Size</span>
          <span className="text-orange-600 dark:text-yellow-400 normal-case font-bold">{qrSize}px</span>
        </h4>
        <input
          type="range"
          min="150"
          max="400"
          step="10"
          value={qrSize}
          onChange={(e) => set({ qrSize: Number(e.target.value) })}
          className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
          <span>150px</span>
          <span>400px</span>
        </div>
      </div>

      {/* Error Correction */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Error Correction
        </h4>
        <div className="grid grid-cols-4 gap-2.5">
          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
            <button
              key={level}
              onClick={() => set({ errorCorrectionLevel: level })}
              className={btnClass(errorCorrectionLevel === level)}
            >
              <span className="text-base font-bold">{level}</span>
              <span className="text-[10px]">
                {level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
          Higher = more resilient but denser. Use H with logos.
        </p>
      </div>
    </div>
  );
}
