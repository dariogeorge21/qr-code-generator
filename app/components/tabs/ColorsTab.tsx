'use client';

import { useQRStore } from '../../store/useQRStore';
import { PALETTES } from '../../types/qr';

export default function ColorsTab() {
  const fgColor = useQRStore((s) => s.fgColor);
  const bgColor = useQRStore((s) => s.bgColor);
  const activePalette = useQRStore((s) => s.activePalette);
  const useFgGradient = useQRStore((s) => s.useFgGradient);
  const fgGradient = useQRStore((s) => s.fgGradient);
  const set = useQRStore((s) => s.set);

  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const sat = Math.floor(Math.random() * 40) + 60;
    const hsl = (h: number, s: number, l: number) => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    set({
      fgColor: hsl(hue, sat, Math.floor(Math.random() * 30) + 10),
      bgColor: hsl(hue, sat / 3, Math.floor(Math.random() * 20) + 80),
      activePalette: 'Custom',
    });
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] font-mono focus:ring-2 focus:ring-[var(--color-secondary)] outline-none transition-all";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Primary Colors */}
      <section>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Core Colors</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold opacity-70">Foreground</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => set({ fgColor: e.target.value, activePalette: 'Custom' })}
                className="w-12 h-10 rounded-lg cursor-pointer bg-transparent"
              />
              <input type="text" value={fgColor} onChange={(e) => set({ fgColor: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold opacity-70">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => set({ bgColor: e.target.value, activePalette: 'Custom' })}
                className="w-12 h-10 rounded-lg cursor-pointer bg-transparent"
              />
              <input type="text" value={bgColor} onChange={(e) => set({ bgColor: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={randomColor} className="flex-1 py-2.5 text-xs font-bold bg-[var(--color-secondary)] text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm">
            🎲 Randomize
          </button>
          <button onClick={() => set({ fgColor: '#000000', bgColor: '#FFFFFF', activePalette: 'Classic', useFgGradient: false })} className="flex-1 py-2.5 text-xs font-bold border border-[var(--color-border)] text-[var(--color-text)] rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all">
            Reset
          </button>
        </div>
      </section>

      {/* Gradient Section */}
      <section className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider">Dot Gradient</h4>
          <button
            onClick={() => set({ useFgGradient: !useFgGradient })}
            className={`w-10 h-5 rounded-full transition-colors ${useFgGradient ? 'bg-[var(--color-secondary)]' : 'bg-gray-300 dark:bg-gray-700'} relative`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${useFgGradient ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        
        {useFgGradient && (
          <div className="space-y-5 pt-2 border-t border-[var(--color-border)]">
            <div className="flex p-1 bg-white dark:bg-black/20 rounded-xl border border-[var(--color-border)]">
              {(['linear', 'radial'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => set({ fgGradient: { ...fgGradient, type } })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${fgGradient.type === type ? 'bg-[var(--color-secondary)] text-white shadow-sm' : 'opacity-50'}`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                <span>Rotation</span>
                <span>{fgGradient.rotation}°</span>
              </div>
              <input
                type="range" min="0" max="360"
                value={fgGradient.rotation}
                onChange={(e) => set({ fgGradient: { ...fgGradient, rotation: Number(e.target.value) } })}
                className="w-full accent-[var(--color-secondary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase opacity-60">Start</span>
                <input type="color" value={fgGradient.colorStops[0].color} onChange={(e) => {
                  const stops = [...fgGradient.colorStops];
                  stops[0] = { ...stops[0], color: e.target.value };
                  set({ fgGradient: { ...fgGradient, colorStops: stops } });
                }} className="w-full h-8 rounded-lg cursor-pointer" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase opacity-60">End</span>
                <input type="color" value={fgGradient.colorStops[1].color} onChange={(e) => {
                  const stops = [...fgGradient.colorStops];
                  stops[1] = { ...stops[1], color: e.target.value };
                  set({ fgGradient: { ...fgGradient, colorStops: stops } });
                }} className="w-full h-8 rounded-lg cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Palettes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Designer Palettes</h4>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {PALETTES.map((p) => (
            <button
              key={p.name}
              onClick={() => set({ fgColor: p.fg, bgColor: p.bg, activePalette: p.name })}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${
                activePalette === p.name ? 'border-[var(--color-secondary)] ring-4 ring-[var(--color-secondary)]/10' : 'border-[var(--color-border)]'
              }`}
            >
              <div className="absolute inset-0" style={{ backgroundColor: p.bg }} />
              <div className="absolute inset-2 rounded-lg shadow-sm" style={{ backgroundColor: p.fg }} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}