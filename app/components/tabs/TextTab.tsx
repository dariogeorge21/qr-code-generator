'use client';

import { useQRStore } from '../../store/useQRStore';
import { FONT_FAMILIES, FONT_WEIGHTS } from '../../types/qr';
import type { TextAlign } from '../../types/qr';

export default function TextTab() {
  const bgText = useQRStore((s) => s.bgText);
  const bgTextFontFamily = useQRStore((s) => s.bgTextFontFamily);
  const bgTextFontSize = useQRStore((s) => s.bgTextFontSize);
  const bgTextColor = useQRStore((s) => s.bgTextColor);
  const bgTextOpacity = useQRStore((s) => s.bgTextOpacity);
  const bgTextX = useQRStore((s) => s.bgTextX);
  const bgTextY = useQRStore((s) => s.bgTextY);
  const bgTextRotation = useQRStore((s) => s.bgTextRotation);
  const bgTextRepeat = useQRStore((s) => s.bgTextRepeat);
  const title = useQRStore((s) => s.title);
  const titleFontFamily = useQRStore((s) => s.titleFontFamily);
  const titleFontSize = useQRStore((s) => s.titleFontSize);
  const titleFontWeight = useQRStore((s) => s.titleFontWeight);
  const titleColor = useQRStore((s) => s.titleColor);
  const titleAlign = useQRStore((s) => s.titleAlign);
  const titleSpacing = useQRStore((s) => s.titleSpacing);
  const caption = useQRStore((s) => s.caption);
  const captionFontFamily = useQRStore((s) => s.captionFontFamily);
  const captionFontSize = useQRStore((s) => s.captionFontSize);
  const captionFontWeight = useQRStore((s) => s.captionFontWeight);
  const captionColor = useQRStore((s) => s.captionColor);
  const captionAlign = useQRStore((s) => s.captionAlign);
  const captionSpacing = useQRStore((s) => s.captionSpacing);
  const set = useQRStore((s) => s.set);

  const inputClass =
    'w-full px-3 py-2.5 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] transition-all focus:ring-4 focus:ring-orange-500/20 focus:border-orange-600 dark:focus:border-yellow-400 outline-none';
  const selectClass =
    'w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-600 dark:focus:border-yellow-400 transition-all';

  const alignButtons = (current: TextAlign, prefix: 'title' | 'caption') => (
    <div className="flex gap-1.5">
      {(['left', 'center', 'right'] as const).map((a) => (
        <button
          key={a}
          onClick={() => set({ [`${prefix}Align`]: a } as Record<string, TextAlign>)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            current === a
              ? 'bg-orange-600 dark:bg-yellow-400 text-white dark:text-black shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {a === 'left' ? '◀' : a === 'center' ? '◆' : '▶'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Background Text ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Background Text
          </h4>
          {bgText && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          )}
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={bgText}
              onChange={(e) => set({ bgText: e.target.value })}
              placeholder="Watermark / background text…"
              maxLength={60}
              className={inputClass + ' pr-10'}
            />
            {bgText && (
              <button
                onClick={() => set({ bgText: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-lg leading-none"
                title="Clear"
              >
                ×
              </button>
            )}
          </div>
          {bgText && (
            <p className="text-xs text-orange-600 dark:text-yellow-400 flex items-center gap-1.5 bg-orange-50 dark:bg-yellow-400/10 px-3 py-2 rounded-xl">
              <span>💡</span> Text renders behind the QR dots. Use low opacity for best scan results.
            </p>
          )}

          {bgText && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-[var(--color-border)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Font</label>
                  <select
                    value={bgTextFontFamily}
                    onChange={(e) => set({ bgTextFontFamily: e.target.value })}
                    className={selectClass}
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                    <span>Size</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{bgTextFontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={bgTextFontSize}
                    onChange={(e) => set({ bgTextFontSize: Number(e.target.value) })}
                    className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgTextColor}
                      onChange={(e) => set({ bgTextColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border-2 border-[var(--color-border)] cursor-pointer bg-transparent p-0.5"
                    />
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{bgTextColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                    <span>Opacity</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{Math.round(bgTextOpacity * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={bgTextOpacity}
                    onChange={(e) => set({ bgTextOpacity: Number(e.target.value) })}
                    className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                    <span>X Position</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{bgTextX}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgTextX}
                    onChange={(e) => set({ bgTextX: Number(e.target.value) })}
                    className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                    <span>Y Position</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{bgTextY}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgTextY}
                    onChange={(e) => set({ bgTextY: Number(e.target.value) })}
                    className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                  <span>Rotation</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{bgTextRotation}°</span>
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={bgTextRotation}
                  onChange={(e) => set({ bgTextRotation: Number(e.target.value) })}
                  className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Repeat (Watermark)</label>
                <button
                  onClick={() => set({ bgTextRepeat: !bgTextRepeat })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${
                    bgTextRepeat ? 'bg-orange-600 dark:bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      bgTextRepeat ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Title ── */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Title (Above QR)
        </h4>
        <input
          type="text"
          value={title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="Enter a title..."
          maxLength={80}
          className={inputClass}
        />
        {title && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-[var(--color-border)]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Font</label>
                <select
                  value={titleFontFamily}
                  onChange={(e) => set({ titleFontFamily: e.target.value })}
                  className={selectClass}
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Weight</label>
                <select
                  value={titleFontWeight}
                  onChange={(e) => set({ titleFontWeight: e.target.value })}
                  className={selectClass}
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                  <span>Size</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{titleFontSize}px</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="48"
                  value={titleFontSize}
                  onChange={(e) => set({ titleFontSize: Number(e.target.value) })}
                  className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                  <span>Spacing</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{titleSpacing}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={titleSpacing}
                  onChange={(e) => set({ titleSpacing: Number(e.target.value) })}
                  className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => set({ titleColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-2 border-[var(--color-border)] cursor-pointer bg-transparent p-0.5"
                />
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{titleColor}</span>
              </div>
              {alignButtons(titleAlign, 'title')}
            </div>
          </div>
        )}
      </div>

      {/* ── Caption ── */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Caption (Below QR)
        </h4>
        <input
          type="text"
          value={caption}
          onChange={(e) => set({ caption: e.target.value })}
          placeholder="Enter a caption..."
          maxLength={120}
          className={inputClass}
        />
        {caption && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-[var(--color-border)]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Font</label>
                <select
                  value={captionFontFamily}
                  onChange={(e) => set({ captionFontFamily: e.target.value })}
                  className={selectClass}
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Weight</label>
                <select
                  value={captionFontWeight}
                  onChange={(e) => set({ captionFontWeight: e.target.value })}
                  className={selectClass}
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                  <span>Size</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{captionFontSize}px</span>
                </label>
                <input
                  type="range"
                  min="8"
                  max="36"
                  value={captionFontSize}
                  onChange={(e) => set({ captionFontSize: Number(e.target.value) })}
                  className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
                  <span>Spacing</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{captionSpacing}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={captionSpacing}
                  onChange={(e) => set({ captionSpacing: Number(e.target.value) })}
                  className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={captionColor}
                  onChange={(e) => set({ captionColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-2 border-[var(--color-border)] cursor-pointer bg-transparent p-0.5"
                />
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{captionColor}</span>
              </div>
              {alignButtons(captionAlign, 'caption')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
