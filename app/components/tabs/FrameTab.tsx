"use client";

import { useQRStore } from "../../store/useQRStore";
import type { BorderType } from "../../types/qr";
import { useState } from "react";

/* ──────────────────────── Frame Presets ──────────────────────── */
interface FramePreset {
  name: string;
  icon: string;
  values: Partial<ReturnType<typeof useQRStore.getState>>;
}

const FRAME_PRESETS: FramePreset[] = [
  {
    name: "Minimal",
    icon: "○",
    values: {
      frameEnabled: true, borderWidth: 1, borderColor: "#e5e7eb", borderType: "solid",
      borderRadius: 8, borderOpacity: 100, padding: 16,
      shadowEnabled: false, shadowInset: false,
      individualCorners: false, frameBgEnabled: false,
    },
  },
  {
    name: "Elegant",
    icon: "◈",
    values: {
      frameEnabled: true, borderWidth: 2, borderColor: "#a78bfa", borderType: "solid",
      borderRadius: 20, borderOpacity: 80, padding: 28,
      shadowEnabled: true, shadowX: 0, shadowY: 8, shadowBlur: 30, shadowSpread: 0, shadowColor: "#a78bfa30", shadowInset: false,
      individualCorners: false, frameBgEnabled: false,
    },
  },
  {
    name: "Bold",
    icon: "◼",
    values: {
      frameEnabled: true, borderWidth: 6, borderColor: "#1a1a1a", borderType: "solid",
      borderRadius: 0, borderOpacity: 100, padding: 24,
      shadowEnabled: true, shadowX: 6, shadowY: 6, shadowBlur: 0, shadowSpread: 0, shadowColor: "#00000050", shadowInset: false,
      individualCorners: false, frameBgEnabled: false,
    },
  },
  {
    name: "Neon",
    icon: "⚡",
    values: {
      frameEnabled: true, borderWidth: 3, borderColor: "#00ff88", borderType: "solid",
      borderRadius: 16, borderOpacity: 100, padding: 20,
      shadowEnabled: true, shadowX: 0, shadowY: 0, shadowBlur: 25, shadowSpread: 4, shadowColor: "#00ff8850", shadowInset: false,
      individualCorners: false, frameBgEnabled: false,
    },
  },
  {
    name: "Retro",
    icon: "▦",
    values: {
      frameEnabled: true, borderWidth: 4, borderColor: "#92400e", borderType: "double",
      borderRadius: 4, borderOpacity: 100, padding: 20,
      shadowEnabled: true, shadowX: 4, shadowY: 4, shadowBlur: 0, shadowSpread: 0, shadowColor: "#92400e40", shadowInset: false,
      individualCorners: false, frameBgEnabled: true, frameBgColor: "#fef3c7",
    },
  },
  {
    name: "Glass",
    icon: "◇",
    values: {
      frameEnabled: true, borderWidth: 1, borderColor: "#ffffff60", borderType: "solid",
      borderRadius: 24, borderOpacity: 60, padding: 24,
      shadowEnabled: true, shadowX: 0, shadowY: 12, shadowBlur: 40, shadowSpread: -4, shadowColor: "#00000020", shadowInset: false,
      individualCorners: false, frameBgEnabled: true, frameBgColor: "#ffffff20",
    },
  },
  {
    name: "Inset",
    icon: "⊟",
    values: {
      frameEnabled: true, borderWidth: 2, borderColor: "#d1d5db", borderType: "groove",
      borderRadius: 12, borderOpacity: 100, padding: 22,
      shadowEnabled: true, shadowX: 0, shadowY: 2, shadowBlur: 12, shadowSpread: 0, shadowColor: "#00000020", shadowInset: true,
      individualCorners: false, frameBgEnabled: false,
    },
  },
  {
    name: "Organic",
    icon: "❋",
    values: {
      frameEnabled: true, borderWidth: 3, borderColor: "#16a34a", borderType: "dashed",
      borderRadius: 0, borderOpacity: 90, padding: 26,
      shadowEnabled: false, shadowInset: false,
      individualCorners: true, borderTopLeftRadius: 32, borderTopRightRadius: 4, borderBottomRightRadius: 32, borderBottomLeftRadius: 4,
      frameBgEnabled: false,
    },
  },
];

/* ──────────────────────── Helpers ──────────────────────── */
const randHex = () =>
  "#" +
  Array.from({ length: 6 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/* ──────────────────────── Component ──────────────────────── */
export default function FrameTab() {
  const store = useQRStore();
  const {
    frameEnabled,
    borderWidth,
    borderColor,
    borderRadius,
    borderType,
    borderOpacity,
    individualCorners,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    frameBgEnabled,
    frameBgColor,
    padding,
    shadowEnabled,
    shadowX,
    shadowY,
    shadowBlur,
    shadowSpread,
    shadowColor,
    shadowInset,
    set,
  } = store;

  const [activePreset, setActivePreset] = useState<string | null>(null);

  /* ── Border types ── */
  const borderTypes: { key: BorderType; label: string; icon: string }[] = [
    { key: "solid", label: "Solid", icon: "⎯" },
    { key: "dashed", label: "Dashed", icon: "╌" },
    { key: "dotted", label: "Dotted", icon: "⋯" },
    { key: "double", label: "Double", icon: "═" },
    { key: "groove", label: "Groove", icon: "▤" },
    { key: "ridge", label: "Ridge", icon: "▥" },
    { key: "inset", label: "Inset", icon: "▣" },
    { key: "outset", label: "Outset", icon: "▩" },
  ];

  /* ── Reusable slider ── */
  const sliderSection = (
    label: string,
    value: number,
    min: number,
    max: number,
    onChange: (v: number) => void,
    unit = "px"
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-md">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-[var(--color-secondary)] bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  /* ── Color + text input combo ── */
  const colorField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    onRandom?: () => void
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        {onRandom && (
          <button
            onClick={onRandom}
            title="Pick a random colour"
            className="group flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/10 text-gray-400 hover:bg-[var(--color-secondary)]/15 hover:text-[var(--color-secondary)] active:scale-90 active:rotate-12 transition-all duration-150"
          >
            <span className="text-xs leading-none group-hover:animate-spin group-active:animate-none" style={{ display: 'inline-block' }}>🎲</span>
            <span>Random</span>
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="color"
          value={value.slice(0, 7)}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--color-border)]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 bg-white dark:bg-black/20 border border-[var(--color-border)] rounded-xl text-sm font-mono"
        />
      </div>
    </div>
  );

  /* ── Toggle switch ── */
  const toggleSwitch = (
    enabled: boolean,
    onToggle: () => void,
    size: "sm" | "md" = "md"
  ) => {
    const w = size === "sm" ? "w-10 h-5" : "w-12 h-6";
    const dot = size === "sm" ? "w-3 h-3" : "w-4 h-4";
    const on = size === "sm" ? "left-6" : "left-7";
    return (
      <button
        onClick={onToggle}
        className={`${w} rounded-full transition-all ${
          enabled
            ? "bg-[var(--color-secondary)]"
            : "bg-gray-300 dark:bg-gray-700"
        } relative`}
      >
        <div
          className={`absolute top-1 ${dot} bg-white rounded-full transition-all ${
            enabled ? on : "left-1"
          }`}
        />
      </button>
    );
  };

  /* ── Generate Random ── */
  const generateRandom = () => {
    const allBorderTypes: BorderType[] = [
      "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset",
    ];
    const useShadow = Math.random() > 0.35;
    const useInset = useShadow && Math.random() > 0.7;
    const useIndividual = Math.random() > 0.6;
    const useFrameBg = Math.random() > 0.6;
    const baseRadius = randInt(0, 40);
    const shadowBase = randHex();

    set({
      frameEnabled: true,
      borderWidth: randInt(1, 10),
      borderColor: randHex(),
      borderType: pick(allBorderTypes),
      borderRadius: useIndividual ? 12 : baseRadius,
      borderOpacity: randInt(50, 100),
      individualCorners: useIndividual,
      borderTopLeftRadius: useIndividual ? randInt(0, 48) : baseRadius,
      borderTopRightRadius: useIndividual ? randInt(0, 48) : baseRadius,
      borderBottomRightRadius: useIndividual ? randInt(0, 48) : baseRadius,
      borderBottomLeftRadius: useIndividual ? randInt(0, 48) : baseRadius,
      frameBgEnabled: useFrameBg,
      frameBgColor: useFrameBg ? randHex() : "#f0f0f0",
      padding: randInt(8, 50),
      shadowEnabled: useShadow,
      shadowX: useShadow ? randInt(-12, 12) : 0,
      shadowY: useShadow ? randInt(-12, 12) : 0,
      shadowBlur: useShadow ? randInt(4, 40) : 20,
      shadowSpread: useShadow ? randInt(-4, 12) : 0,
      shadowColor: useShadow ? shadowBase + "40" : "#00000025",
      shadowInset: useInset,
    });
    setActivePreset(null);
  };

  /* ── Apply preset ── */
  const applyPreset = (preset: FramePreset) => {
    set(preset.values);
    setActivePreset(preset.name);
  };

  return (
    <div className="space-y-8">
      {/* Generate Random + Reset Row */}
      <div className="flex gap-2">
        <button
          onClick={generateRandom}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all bg-gradient-to-r from-[var(--color-secondary)] to-purple-500 text-white hover:shadow-lg hover:shadow-[var(--color-secondary)]/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-lg">🎲</span> Generate Random Frame
        </button>
        <button
          onClick={() => {
            set({
              frameEnabled: false,
              borderWidth: 2,
              borderColor: "#00000030",
              borderRadius: 12,
              borderType: "solid",
              borderOpacity: 100,
              individualCorners: false,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 12,
              frameBgEnabled: false,
              frameBgColor: "#f0f0f0",
              padding: 20,
              shadowEnabled: false,
              shadowX: 0,
              shadowY: 4,
              shadowBlur: 20,
              shadowSpread: 0,
              shadowColor: "#00000025",
              shadowInset: false,
            });
            setActivePreset(null);
          }}
          className="px-4 py-3 rounded-2xl font-bold text-xs transition-all border-2 border-[var(--color-border)] text-gray-500 hover:text-red-500 hover:border-red-300 active:scale-[0.96]"
          title="Reset all frame settings"
        >
          ↺
        </button>
      </div>

      {/* Frame Presets */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <span>🎨</span> Quick Presets
          </h4>
          <button
            onClick={() => applyPreset(pick(FRAME_PRESETS))}
            title="Apply a random preset"
            className="group flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/10 text-gray-400 hover:bg-[var(--color-secondary)]/15 hover:text-[var(--color-secondary)] active:scale-90 transition-all duration-150"
          >
            <span className="text-xs leading-none group-hover:scale-125 transition-transform" style={{ display: 'inline-block' }}>🔀</span>
            <span>Shuffle</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FRAME_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                activePreset === p.name
                  ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] scale-[1.02]"
                  : "border-[var(--color-border)] opacity-70 hover:opacity-100 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <span className="text-base">{p.icon}</span>
              <span className="text-[8px] font-bold uppercase leading-tight">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Frame Master Switch */}
      <section className="flex items-center justify-between p-4 bg-[var(--color-secondary)]/5 rounded-2xl border border-[var(--color-secondary)]/20">
        <div>
          <h4 className="text-sm font-bold text-[var(--color-text)]">
            Enable Outer Frame
          </h4>
          <p className="text-[10px] opacity-60">
            Add a stylish border around your code
          </p>
        </div>
        {toggleSwitch(frameEnabled, () =>
          set({ frameEnabled: !frameEnabled })
        )}
      </section>

      {/* Border Configuration */}
      {frameEnabled && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
          {/* Border Type Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Border Style
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {borderTypes.map((bt) => (
                <button
                  key={bt.key}
                  onClick={() => {
                    set({ borderType: bt.key });
                    setActivePreset(null);
                  }}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                    borderType === bt.key
                      ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 text-[var(--color-secondary)]"
                      : "border-[var(--color-border)] opacity-60 hover:opacity-90"
                  }`}
                >
                  <span className="text-lg font-bold">{bt.icon}</span>
                  <span className="text-[8px] font-bold uppercase">
                    {bt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color + Dimensions */}
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-5 border border-[var(--color-border)]">
            {colorField("Frame Color", borderColor, (v) => {
              set({ borderColor: v });
              setActivePreset(null);
            }, () => {
              set({ borderColor: randHex() });
              setActivePreset(null);
            })}
            {sliderSection("Thickness", borderWidth, 1, 16, (v) => {
              set({ borderWidth: v });
              setActivePreset(null);
            })}
            {sliderSection(
              "Opacity",
              borderOpacity,
              10,
              100,
              (v) => {
                set({ borderOpacity: v });
                setActivePreset(null);
              },
              "%"
            )}
          </div>

          {/* Corner Radius */}
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-4 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Corner Radius
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">
                  {individualCorners ? "Individual" : "Uniform"}
                </span>
                {toggleSwitch(
                  individualCorners,
                  () => {
                    set({ individualCorners: !individualCorners });
                    setActivePreset(null);
                  },
                  "sm"
                )}
              </div>
            </div>

            {individualCorners ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Visual corner diagram */}
                  <div className="col-span-2 flex justify-center py-2">
                    <div
                      className="w-20 h-20 border-2 border-[var(--color-secondary)]/40 transition-all"
                      style={{
                        borderRadius: `${borderTopLeftRadius}px ${borderTopRightRadius}px ${borderBottomRightRadius}px ${borderBottomLeftRadius}px`,
                      }}
                    />
                  </div>
                  {sliderSection("↖ Top Left", borderTopLeftRadius, 0, 60, (v) => {
                    set({ borderTopLeftRadius: v });
                    setActivePreset(null);
                  })}
                  {sliderSection("↗ Top Right", borderTopRightRadius, 0, 60, (v) => {
                    set({ borderTopRightRadius: v });
                    setActivePreset(null);
                  })}
                  {sliderSection("↙ Bottom Left", borderBottomLeftRadius, 0, 60, (v) => {
                    set({ borderBottomLeftRadius: v });
                    setActivePreset(null);
                  })}
                  {sliderSection("↘ Bottom Right", borderBottomRightRadius, 0, 60, (v) => {
                    set({ borderBottomRightRadius: v });
                    setActivePreset(null);
                  })}
                </div>
                {/* Quick corner patterns */}
                <div className="flex gap-2 pt-1">
                  {[
                    { label: "Pill", tl: 50, tr: 50, br: 50, bl: 50 },
                    { label: "Leaf", tl: 40, tr: 4, br: 40, bl: 4 },
                    { label: "Ticket", tl: 20, tr: 0, br: 20, bl: 0 },
                    { label: "Drop", tl: 48, tr: 48, br: 4, bl: 48 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        set({
                          borderTopLeftRadius: p.tl,
                          borderTopRightRadius: p.tr,
                          borderBottomRightRadius: p.br,
                          borderBottomLeftRadius: p.bl,
                        });
                        setActivePreset(null);
                      }}
                      className="flex-1 py-1.5 text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-secondary)] transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              sliderSection("Radius", borderRadius, 0, 60, (v) => {
                set({ borderRadius: v });
                setActivePreset(null);
              })
            )}
          </div>

          {/* Frame Background */}
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-4 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Custom Frame Background
                </h4>
                <p className="text-[10px] opacity-50 mt-0.5">
                  Override QR background inside the frame
                </p>
              </div>
              {toggleSwitch(
                frameBgEnabled,
                () => {
                  set({ frameBgEnabled: !frameBgEnabled });
                  setActivePreset(null);
                },
                "sm"
              )}
            </div>
            {frameBgEnabled && (
              <div className="animate-in fade-in duration-200">
                {colorField("Background Color", frameBgColor, (v) => {
                  set({ frameBgColor: v });
                  setActivePreset(null);
                }, () => {
                  set({ frameBgColor: randHex() });
                  setActivePreset(null);
                })}
                {/* Quick background swatches */}
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {[
                    "#ffffff", "#f8fafc", "#fef3c7", "#dbeafe",
                    "#fce7f3", "#d1fae5", "#ede9fe", "#0a0a0a", "#1e293b",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        set({ frameBgColor: c });
                        setActivePreset(null);
                      }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                        frameBgColor === c
                          ? "border-[var(--color-secondary)] scale-110"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shadow & Spacing */}
      <section className="space-y-6 border-t border-[var(--color-border)] pt-6">
        {sliderSection("Container Padding", padding, 0, 80, (v) => {
          set({ padding: v });
          setActivePreset(null);
        })}

        {/* Shadow Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Drop Shadow
            </h4>
            {toggleSwitch(
              shadowEnabled,
              () => {
                set({ shadowEnabled: !shadowEnabled });
                setActivePreset(null);
              },
              "sm"
            )}
          </div>

          {shadowEnabled && (
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border)] space-y-5 animate-in fade-in duration-300">
              {/* Shadow type row */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    set({ shadowInset: false });
                    setActivePreset(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all border-2 ${
                    !shadowInset
                      ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"
                      : "border-[var(--color-border)] opacity-60 hover:opacity-90"
                  }`}
                >
                  Outer
                </button>
                <button
                  onClick={() => {
                    set({ shadowInset: true });
                    setActivePreset(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all border-2 ${
                    shadowInset
                      ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"
                      : "border-[var(--color-border)] opacity-60 hover:opacity-90"
                  }`}
                >
                  Inset
                </button>
              </div>

              {/* Shadow color */}
              {colorField("Shadow Color", shadowColor, (v) => {
                set({ shadowColor: v });
                setActivePreset(null);
              }, () => {
                set({ shadowColor: randHex() + pick(["20", "30", "40", "55", "70"]) });
                setActivePreset(null);
              })}

              {/* Shadow sliders */}
              <div className="grid grid-cols-2 gap-4">
                {sliderSection("Blur", shadowBlur, 0, 60, (v) => {
                  set({ shadowBlur: v });
                  setActivePreset(null);
                })}
                {sliderSection("Spread", shadowSpread, -20, 30, (v) => {
                  set({ shadowSpread: v });
                  setActivePreset(null);
                })}
                {sliderSection("Offset X", shadowX, -30, 30, (v) => {
                  set({ shadowX: v });
                  setActivePreset(null);
                })}
                {sliderSection("Offset Y", shadowY, -30, 30, (v) => {
                  set({ shadowY: v });
                  setActivePreset(null);
                })}
              </div>

              {/* Shadow quick presets */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Quick Shadows
                </span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Soft", x: 0, y: 4, blur: 20, spread: 0, color: "#00000018", inset: false },
                    { label: "Hard", x: 6, y: 6, blur: 0, spread: 0, color: "#00000040", inset: false },
                    { label: "Glow", x: 0, y: 0, blur: 20, spread: 6, color: "#6366f140", inset: false },
                    { label: "Float", x: 0, y: 16, blur: 40, spread: -8, color: "#00000025", inset: false },
                    { label: "Sunken", x: 0, y: 2, blur: 8, spread: 0, color: "#00000030", inset: true },
                    { label: "Neon", x: 0, y: 0, blur: 16, spread: 4, color: "#00ff8845", inset: false },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        set({
                          shadowX: s.x,
                          shadowY: s.y,
                          shadowBlur: s.blur,
                          shadowSpread: s.spread,
                          shadowColor: s.color,
                          shadowInset: s.inset,
                        });
                        setActivePreset(null);
                      }}
                      className="px-3 py-1.5 text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-secondary)] transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
