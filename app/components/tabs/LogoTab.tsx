'use client';

import { useRef } from 'react';
import { useQRStore } from '../../store/useQRStore';

export default function LogoTab() {
  const logoImage = useQRStore((s) => s.logoImage);
  const logoSize = useQRStore((s) => s.logoSize);
  const logoMargin = useQRStore((s) => s.logoMargin);
  const logoPadding = useQRStore((s) => s.logoPadding);
  const logoRadius = useQRStore((s) => s.logoRadius);
  const set = useQRStore((s) => s.set);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      set({ logoImage: result, errorCorrectionLevel: 'H' });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    set({ logoImage: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Center Logo
      </h4>

      {/* Upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="logo-upload"
        />
        {!logoImage ? (
          <label
            htmlFor="logo-upload"
            className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-[var(--color-border)] rounded-2xl cursor-pointer hover:border-orange-600 dark:hover:border-yellow-400 hover:bg-orange-50 dark:hover:bg-yellow-400/5 transition-all"
          >
            <span className="text-4xl">🖼️</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Click to upload logo
            </span>
            <span className="text-xs text-gray-400">PNG, JPG, SVG — max 5MB</span>
          </label>
        ) : (
          <div className="space-y-4">
              <div className="relative flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-[var(--color-border)]">
              <img
                src={logoImage}
                alt="Logo preview"
                className="max-h-24 max-w-full object-contain"
                style={{ borderRadius: `${logoRadius}px` }}
              />
              <button
                onClick={removeLogo}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                title="Remove logo"
              >
                ✕
              </button>
            </div>
            <label
              htmlFor="logo-upload"
              className="block text-center text-sm text-orange-600 dark:text-yellow-400 hover:opacity-70 font-semibold cursor-pointer transition-opacity"
            >
              Change image
            </label>
          </div>
        )}
      </div>

      {logoImage && (
        <div className="space-y-5 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-[var(--color-border)]">
          {/* Size */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
              <span>Logo Size</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {Math.round(logoSize * 100)}%
              </span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.01"
              value={logoSize}
              onChange={(e) => set({ logoSize: Number(e.target.value) })}
              className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Margin */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
              <span>Margin</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{logoMargin}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={logoMargin}
              onChange={(e) => set({ logoMargin: Number(e.target.value) })}
              className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Padding */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
              <span>Padding</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{logoPadding}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={logoPadding}
              onChange={(e) => set({ logoPadding: Number(e.target.value) })}
              className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Border Radius */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium flex justify-between">
              <span>Corner Radius</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{logoRadius}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={logoRadius}
              onChange={(e) => set({ logoRadius: Number(e.target.value) })}
              className="w-full accent-orange-600 dark:accent-yellow-400 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl font-medium">
            💡 Error correction auto-set to <strong>H (30%)</strong> for best logo visibility.
          </p>
        </div>
      )}
    </div>
  );
}
