'use client';

import { useState, useCallback } from 'react';
import { useQRStore } from '../../store/useQRStore';
import {
  DOT_STYLES, CORNER_SQUARE_STYLES, CORNER_DOT_STYLES,
  STYLE_PRESETS,
  type DotType, type CornerSquareType, type CornerDotType, type ErrorCorrectionLevel,
} from '../../types/qr';
import { Dices, Shuffle, Sparkles, RotateCcw, Check, Zap } from 'lucide-react';

/* ─── helpers ─── */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 50 + Math.floor(Math.random() * 40);
  const l = 25 + Math.floor(Math.random() * 35);
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  return hslToHex(h, s, l);
}

const ERROR_LEVELS: { key: ErrorCorrectionLevel; label: string; tip: string }[] = [
  { key: 'L', label: 'L', tip: '~7 % recovery — smallest QR' },
  { key: 'M', label: 'M', tip: '~15 % recovery — balanced' },
  { key: 'Q', label: 'Q', tip: '~25 % recovery — good with logos' },
  { key: 'H', label: 'H', tip: '~30 % recovery — maximum reliability' },
];

const QR_SIZE_PRESETS = [
  { label: 'S', value: 180 },
  { label: 'M', value: 280 },
  { label: 'L', value: 400 },
  { label: 'XL', value: 512 },
];

/* ─── component ─── */
export default function StyleTab() {
  const {
    dotType, cornerSquareType, cornerDotType,
    useCustomEyeColors, cornerSquareColor, cornerDotColor,
    qrSize, errorCorrectionLevel, set,
  } = useQRStore();

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  /* ── Randomizers ── */
  const randomizeDot = useCallback(() => {
    set({ dotType: pick(DOT_STYLES.map((s) => s.key)) as DotType });
  }, [set]);

  const randomizeCornerSquare = useCallback(() => {
    set({ cornerSquareType: pick(CORNER_SQUARE_STYLES.map((s) => s.key)) as CornerSquareType });
  }, [set]);

  const randomizeCornerDot = useCallback(() => {
    set({ cornerDotType: pick(CORNER_DOT_STYLES.map((s) => s.key)) as CornerDotType });
  }, [set]);

  const randomizeEyeColors = useCallback(() => {
    set({
      useCustomEyeColors: true,
      cornerSquareColor: randomHex(),
      cornerDotColor: randomHex(),
    });
  }, [set]);

  const randomizeErrorLevel = useCallback(() => {
    set({ errorCorrectionLevel: pick(['L', 'M', 'Q', 'H'] as const) as ErrorCorrectionLevel });
  }, [set]);

  const randomizeSize = useCallback(() => {
    set({ qrSize: 150 + Math.floor(Math.random() * 400) });
  }, [set]);

  const randomizeEverything = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
    setActivePreset(null);
    const sq = randomHex();
    const dt = randomHex();
    set({
      dotType: pick(DOT_STYLES.map((s) => s.key)) as DotType,
      cornerSquareType: pick(CORNER_SQUARE_STYLES.map((s) => s.key)) as CornerSquareType,
      cornerDotType: pick(CORNER_DOT_STYLES.map((s) => s.key)) as CornerDotType,
      useCustomEyeColors: Math.random() > 0.4,
      cornerSquareColor: sq,
      cornerDotColor: dt,
      errorCorrectionLevel: pick(['L', 'M', 'Q', 'H'] as const) as ErrorCorrectionLevel,
    });
  }, [set]);

  const applyPreset = useCallback((preset: typeof STYLE_PRESETS[number]) => {
    setActivePreset(preset.name);
    set({
      dotType: preset.dotType,
      cornerSquareType: preset.cornerSquareType,
      cornerDotType: preset.cornerDotType,
      errorCorrectionLevel: preset.errorCorrectionLevel,
      useCustomEyeColors: preset.useCustomEyeColors,
      cornerSquareColor: preset.cornerSquareColor,
      cornerDotColor: preset.cornerDotColor,
    });
  }, [set]);

  const randomPreset = useCallback(() => {
    const p = pick(STYLE_PRESETS);
    applyPreset(p);
  }, [applyPreset]);

  const resetStyles = useCallback(() => {
    setActivePreset(null);
    set({
      dotType: 'square',
      cornerSquareType: 'square',
      cornerDotType: 'square',
      useCustomEyeColors: false,
      cornerSquareColor: '#000000',
      cornerDotColor: '#000000',
      errorCorrectionLevel: 'M',
      qrSize: 280,
    });
  }, [set]);

  /* ── Shared sub-components ── */
  const ShuffleBtn = ({ onClick, label }: { onClick: () => void; label?: string }) => (
    <button
      onClick={onClick}
      title={label ?? 'Shuffle'}
      className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-secondary)] hover:opacity-70 active:scale-90 transition-all"
    >
      <Dices className="w-3 h-3" />
      {label ?? 'Shuffle'}
    </button>
  );

  const StyleButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-95 ${
        active
          ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-inner ring-2 ring-[var(--color-secondary)]/20'
          : 'border-[var(--color-border)] grayscale opacity-60 hover:opacity-80 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className={`space-y-10 ${isShaking ? 'animate-shake' : ''}`}>
      {/* ── 🎰  Master Randomize ── */}
      <section className="flex gap-2">
        <button
          onClick={randomizeEverything}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.97] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Randomize Everything
        </button>
        <button
          onClick={resetStyles}
          title="Reset to defaults"
          className="px-4 py-3 rounded-2xl border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </section>

      {/* ── 🎨  Style Presets ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Style Presets</h4>
          <ShuffleBtn onClick={randomPreset} label="Random" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {STYLE_PRESETS.map((p) => {
            const isActive = activePreset === p.name;
            return (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                title={p.description}
                className={`group relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all hover:scale-[1.03] active:scale-95 ${
                  isActive
                    ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-md ring-2 ring-[var(--color-secondary)]/20'
                    : 'border-[var(--color-border)] hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <span className="text-xl">{p.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{p.name}</span>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 🔳  Pattern Style ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Pattern Style</h4>
          <ShuffleBtn onClick={randomizeDot} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {DOT_STYLES.map((s) => (
            <StyleButton key={s.key} active={dotType === s.key} onClick={() => { set({ dotType: s.key }); setActivePreset(null); }} icon={s.icon} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── 👁  Eyes ── */}
      <section className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Eye Frame</h4>
            <ShuffleBtn onClick={randomizeCornerSquare} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {CORNER_SQUARE_STYLES.map((s) => (
              <StyleButton key={s.key} active={cornerSquareType === s.key} onClick={() => { set({ cornerSquareType: s.key }); setActivePreset(null); }} icon={s.icon} label={s.label} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Eye Dot</h4>
            <ShuffleBtn onClick={randomizeCornerDot} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {CORNER_DOT_STYLES.map((s) => (
              <StyleButton key={s.key} active={cornerDotType === s.key} onClick={() => { set({ cornerDotType: s.key }); setActivePreset(null); }} icon={s.icon} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 🎨  Custom Eye Colors ── */}
      <section className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-5">
          <label className="text-xs font-black uppercase tracking-widest">Custom Eye Colors</label>
          <div className="flex items-center gap-3">
            {useCustomEyeColors && (
              <ShuffleBtn onClick={randomizeEyeColors} label="Random" />
            )}
            <button
              onClick={() => set({ useCustomEyeColors: !useCustomEyeColors })}
              className={`w-12 h-6 rounded-full transition-all ${useCustomEyeColors ? 'bg-[var(--color-secondary)]' : 'bg-gray-300 dark:bg-gray-700'} relative`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${useCustomEyeColors ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {useCustomEyeColors && (
          <div className="space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase opacity-50">Frame Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cornerSquareColor}
                    onChange={(e) => set({ cornerSquareColor: e.target.value })}
                    className="w-12 h-10 rounded-xl cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cornerSquareColor}
                    onChange={(e) => set({ cornerSquareColor: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-[11px] font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase opacity-50">Dot Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cornerDotColor}
                    onChange={(e) => set({ cornerDotColor: e.target.value })}
                    className="w-12 h-10 rounded-xl cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={cornerDotColor}
                    onChange={(e) => set({ cornerDotColor: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-[11px] font-mono border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                </div>
              </div>
            </div>
            {/* Eye color preview */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[9px] font-bold uppercase opacity-40">Preview</span>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-lg border-[3px] flex items-center justify-center" style={{ borderColor: cornerSquareColor }}>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cornerDotColor }} />
                </div>
                <div className="w-8 h-8 rounded-lg border-[3px] flex items-center justify-center" style={{ borderColor: cornerSquareColor }}>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cornerDotColor }} />
                </div>
                <div className="w-8 h-8 rounded-lg border-[3px] flex items-center justify-center" style={{ borderColor: cornerSquareColor }}>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cornerDotColor }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 📐  QR Size ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">QR Size</h4>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-[var(--color-secondary)] tabular-nums">{qrSize}px</span>
            <ShuffleBtn onClick={randomizeSize} label="Random" />
          </div>
        </div>

        {/* Quick size presets */}
        <div className="flex gap-2 mb-4">
          {QR_SIZE_PRESETS.map((sp) => (
            <button
              key={sp.label}
              onClick={() => set({ qrSize: sp.value })}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 ${
                qrSize === sp.value
                  ? 'bg-[var(--color-secondary)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 border border-[var(--color-border)]'
              }`}
            >
              {sp.label}
              <span className="block text-[8px] opacity-60 mt-0.5">{sp.value}px</span>
            </button>
          ))}
        </div>

        {/* Slider */}
        <input
          type="range"
          min="100"
          max="600"
          step="10"
          value={qrSize}
          onChange={(e) => set({ qrSize: Number(e.target.value) })}
          className="w-full accent-[var(--color-secondary)] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-gray-400">100px</span>
          <span className="text-[9px] text-gray-400">600px</span>
        </div>
      </section>

      {/* ── 🛡  Error Correction ── */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Error Correction</h4>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase">Scan Reliability</span>
            <ShuffleBtn onClick={randomizeErrorLevel} label="Random" />
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl border border-[var(--color-border)]">
          {ERROR_LEVELS.map((level) => (
            <button
              key={level.key}
              onClick={() => set({ errorCorrectionLevel: level.key })}
              title={level.tip}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                errorCorrectionLevel === level.key
                  ? 'bg-white dark:bg-black shadow-md text-[var(--color-secondary)] ring-1 ring-[var(--color-secondary)]/20'
                  : 'opacity-40 hover:opacity-100'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 italic">
          {ERROR_LEVELS.find((l) => l.key === errorCorrectionLevel)?.tip}
        </p>
      </section>

      {/* ── ⚡  Quick Combos ── */}
      <section className="p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-white/5 dark:to-white/[0.02] rounded-3xl border border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Actions</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              randomizeDot();
              randomizeCornerSquare();
              randomizeCornerDot();
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold border border-[var(--color-border)] rounded-xl hover:bg-white dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <Shuffle className="w-3 h-3" />
            Shuffle Shapes
          </button>
          <button
            onClick={randomizeEyeColors}
            className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold border border-[var(--color-border)] rounded-xl hover:bg-white dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <Dices className="w-3 h-3" />
            Random Eye Colors
          </button>
          <button
            onClick={() => set({ errorCorrectionLevel: 'H', qrSize: 400 })}
            className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold border border-[var(--color-border)] rounded-xl hover:bg-white dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            🛡 High Quality
          </button>
          <button
            onClick={() => set({ errorCorrectionLevel: 'L', qrSize: 180 })}
            className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold border border-[var(--color-border)] rounded-xl hover:bg-white dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            ⚡ Compact
          </button>
        </div>
      </section>
    </div>
  );
}