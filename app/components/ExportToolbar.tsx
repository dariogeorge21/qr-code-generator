'use client';

import { useState } from 'react';
import { useQRStore } from '../store/useQRStore';
import type { ExportFormat } from '../types/qr';

// Helper to draw a rounded rectangle on canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function compositeExport(): Promise<{ blob: Blob; filename: string }> {
  const s = useQRStore.getState();
  const { default: QRCodeStyling } = await import('qr-code-styling');

  const scale = s.exportScale;
  const qrPx = s.qrSize * scale;
  const pad = s.padding * scale;
  const bw = s.frameEnabled ? s.borderWidth * scale : 0;

  // Measure title / caption heights
  const titleH = s.title ? s.titleFontSize * scale * 1.4 : 0;
  const titleGap = s.title ? s.titleSpacing * scale : 0;
  const captionH = s.caption ? s.captionFontSize * scale * 1.4 : 0;
  const captionGap = s.caption ? s.captionSpacing * scale : 0;

  const innerW = qrPx + pad * 2;
  const innerH = qrPx + pad * 2;
  const totalW = innerW + bw * 2;
  const totalH = bw * 2 + titleH + titleGap + innerH + captionGap + captionH;

  // Create QR code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dotsOpts: any = { type: s.dotType };
  if (s.useFgGradient) {
    dotsOpts.gradient = {
      type: s.fgGradient.type,
      rotation: (s.fgGradient.rotation * Math.PI) / 180,
      colorStops: s.fgGradient.colorStops,
    };
  } else {
    dotsOpts.color = s.fgColor;
  }

  const qr = new QRCodeStyling({
    width: qrPx,
    height: qrPx,
    data: s.inputValue,
    margin: 0,
    type: 'canvas',
    qrOptions: { errorCorrectionLevel: s.errorCorrectionLevel },
    dotsOptions: dotsOpts,
    cornersSquareOptions: {
      type: s.cornerSquareType,
      color: s.useCustomEyeColors ? s.cornerSquareColor : s.fgColor,
    },
    cornersDotOptions: {
      type: s.cornerDotType,
      color: s.useCustomEyeColors ? s.cornerDotColor : s.fgColor,
    },
    backgroundOptions: {
      // Always transparent — the composite canvas handles background & watermark drawing.
      // Using the actual bgColor here would paint over the bgText watermark.
      color: 'transparent',
    },
    ...(s.logoImage
      ? {
          image: s.logoImage,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: s.logoSize,
            margin: s.logoMargin * scale,
            crossOrigin: 'anonymous',
          },
        }
      : {}),
  });

  const qrBlob = await qr.getRawData('png');
  if (!qrBlob) throw new Error('Failed to generate QR data');
  const qrBitmap = await createImageBitmap(qrBlob as Blob);

  // Composite canvas
  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d')!;

  // Background
  if (!s.transparentBg) {
    ctx.fillStyle = s.frameBgEnabled ? s.frameBgColor : s.bgColor;
    if (s.borderRadius > 0) {
      roundRect(ctx, 0, 0, totalW, totalH, s.borderRadius * scale);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, totalW, totalH);
    }
  }

  // Title
  if (s.title) {
    ctx.save();
    ctx.font = `${s.titleFontWeight} ${s.titleFontSize * scale}px ${s.titleFontFamily}`;
    ctx.fillStyle = s.titleColor;
    ctx.textAlign = s.titleAlign;
    ctx.textBaseline = 'top';
    const x = s.titleAlign === 'center' ? totalW / 2 : s.titleAlign === 'right' ? totalW - bw - pad : bw + pad;
    ctx.fillText(s.title, x, bw + titleH * 0.1);
    ctx.restore();
  }

  // QR Code
  const qrX = bw + pad;
  const qrY = bw + titleH + titleGap + pad;
  ctx.drawImage(qrBitmap, qrX, qrY, qrPx, qrPx);

  // Caption
  if (s.caption) {
    ctx.save();
    ctx.font = `${s.captionFontWeight} ${s.captionFontSize * scale}px ${s.captionFontFamily}`;
    ctx.fillStyle = s.captionColor;
    ctx.textAlign = s.captionAlign;
    ctx.textBaseline = 'top';
    const x = s.captionAlign === 'center' ? totalW / 2 : s.captionAlign === 'right' ? totalW - bw - pad : bw + pad;
    const y = bw + titleH + titleGap + innerH + captionGap;
    ctx.fillText(s.caption, x, y);
    ctx.restore();
  }

  // Watermark overlay — drawn using an off-screen canvas to perfectly match the preview's DOM behavior.
  if (s.bgText) {
    // QR frame area boundaries
    const wmX = bw;
    const wmY = bw + titleH + titleGap;
    const wmW = innerW;
    const wmH = innerH;

    // 1. Create an isolated off-screen canvas (just like the preview's absolute canvas)
    const wmCanvas = document.createElement('canvas');
    wmCanvas.width = wmW;
    wmCanvas.height = wmH;
    const wmCtx = wmCanvas.getContext('2d')!;

    // 2. Draw the text onto the isolated canvas
    wmCtx.globalAlpha = s.bgTextOpacity;
    wmCtx.globalCompositeOperation = (s.bgTextBlendMode === 'normal' ? 'source-over' : s.bgTextBlendMode) as GlobalCompositeOperation;
    wmCtx.font = `${s.bgTextFontWeight} ${s.bgTextFontSize * scale}px ${s.bgTextFontFamily}`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('letterSpacing' in wmCtx) (wmCtx as any).letterSpacing = `${s.bgTextLetterSpacing * scale}px`;
    wmCtx.fillStyle = s.bgTextColor;

    let displayText = s.bgText;
    if (s.bgTextTextTransform === 'uppercase') displayText = s.bgText.toUpperCase();
    else if (s.bgTextTextTransform === 'lowercase') displayText = s.bgText.toLowerCase();
    else if (s.bgTextTextTransform === 'capitalize') displayText = s.bgText.replace(/\b\w/g, (c) => c.toUpperCase());

    if (s.bgTextRepeat) {
      const tw = wmCtx.measureText(displayText).width + 30 * scale;
      const th = s.bgTextFontSize * scale * 1.8;
      wmCtx.translate(wmW / 2, wmH / 2);
      wmCtx.rotate((s.bgTextRotation * Math.PI) / 180);
      for (let y = -wmH * 1.5; y < wmH * 1.5; y += th) {
        for (let x = -wmW * 1.5; x < wmW * 1.5; x += tw) {
          wmCtx.fillText(displayText, x, y);
        }
      }
    } else {
      const tx = (s.bgTextX / 100) * wmW;
      const ty = (s.bgTextY / 100) * wmH;
      wmCtx.translate(tx, ty);
      wmCtx.rotate((s.bgTextRotation * Math.PI) / 180);
      wmCtx.textAlign = 'center';
      wmCtx.textBaseline = 'middle';
      wmCtx.fillText(displayText, 0, 0);
    }

    // 3. Stamp the isolated watermark canvas onto the main export canvas
    ctx.save();
    
    // Clip to the QR frame area so it doesn't bleed into the title/caption
    ctx.beginPath();
    if (s.borderRadius > 0) {
      roundRect(ctx, wmX, wmY, wmW, wmH, s.borderRadius * scale);
    } else {
      ctx.rect(wmX, wmY, wmW, wmH);
    }
    ctx.clip();

    // Draw the completed watermark layer directly on top
    ctx.drawImage(wmCanvas, wmX, wmY);
    ctx.restore();
  }

  // Border
  if (s.frameEnabled && s.borderWidth > 0) {
    ctx.save();
    ctx.strokeStyle = s.borderColor;
    ctx.lineWidth = bw;
    switch (s.borderType) {
      case 'dashed':
        ctx.setLineDash([bw * 3, bw * 2]);
        break;
      case 'dotted':
        ctx.setLineDash([bw, bw]);
        break;
      default:
        ctx.setLineDash([]);
    }
    const half = bw / 2;
    if (s.borderRadius > 0) {
      roundRect(ctx, half, half, totalW - bw, totalH - bw, s.borderRadius * scale);
      ctx.stroke();
    } else {
      ctx.strokeRect(half, half, totalW - bw, totalH - bw);
    }
    ctx.restore();
  }

  // Export
  const mimeMap: Record<ExportFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/png', // SVG handled separately
  };
  const mime = mimeMap[s.exportFormat] || 'image/png';

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
      mime,
      0.95,
    );
  });

  const ext = s.exportFormat === 'svg' ? 'png' : s.exportFormat;
  const name = [
    s.title?.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase(),
    'qrcode',
    `${Date.now()}`,
  ]
    .filter(Boolean)
    .join('-');

  return { blob, filename: `${name}.${ext}` };
}

async function svgExport(): Promise<{ blob: Blob; filename: string }> {
  const s = useQRStore.getState();
  const { default: QRCodeStyling } = await import('qr-code-styling');

  const qr = new QRCodeStyling({
    width: s.qrSize * s.exportScale,
    height: s.qrSize * s.exportScale,
    data: s.inputValue,
    margin: 0,
    type: 'svg',
    qrOptions: { errorCorrectionLevel: s.errorCorrectionLevel },
    dotsOptions: s.useFgGradient
      ? {
          type: s.dotType,
          gradient: {
            type: s.fgGradient.type,
            rotation: (s.fgGradient.rotation * Math.PI) / 180,
            colorStops: s.fgGradient.colorStops,
          },
        }
      : { type: s.dotType, color: s.fgColor },
    cornersSquareOptions: {
      type: s.cornerSquareType,
      color: s.useCustomEyeColors ? s.cornerSquareColor : s.fgColor,
    },
    cornersDotOptions: {
      type: s.cornerDotType,
      color: s.useCustomEyeColors ? s.cornerDotColor : s.fgColor,
    },
    backgroundOptions: {
      color: s.transparentBg ? 'transparent' : s.bgColor,
    },
    ...(s.logoImage
      ? {
          image: s.logoImage,
          imageOptions: { hideBackgroundDots: true, imageSize: s.logoSize, margin: s.logoMargin, crossOrigin: 'anonymous' },
        }
      : {}),
  });

  const blob = await qr.getRawData('svg');
  if (!blob) throw new Error('Failed to generate SVG');

  const name = [
    s.title?.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase(),
    'qrcode',
    `${Date.now()}`,
  ]
    .filter(Boolean)
    .join('-');

  return { blob: new Blob([blob as BlobPart], { type: 'image/svg+xml' }), filename: `${name}.svg` };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportToolbar() {
  const inputValue = useQRStore((s) => s.inputValue);
  const exportFormat = useQRStore((s) => s.exportFormat);
  const exportScale = useQRStore((s) => s.exportScale);
  const transparentBg = useQRStore((s) => s.transparentBg);
  const set = useQRStore((s) => s.set);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const hasContent = inputValue.trim().length > 0;

  const handleExport = async () => {
    if (!hasContent) {
      setError('Please enter content first');
      return;
    }
    setExporting(true);
    setError('');
    try {
      const result =
        exportFormat === 'svg' ? await svgExport() : await compositeExport();
      downloadBlob(result.blob, result.filename);

      // Log detailed download event — fire and forget (no QR content stored)
      const s = useQRStore.getState();
      fetch('/api/qr-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'downloaded',
          qr_type: s.qrType || 'unknown',
          export_format: exportFormat,
          color_modified:
            s.fgColor !== '#000000' ||
            s.bgColor !== '#FFFFFF' ||
            s.useFgGradient ||
            s.useCustomEyeColors ||
            s.activePalette !== 'Classic',
          style_modified:
            s.dotType !== 'square' ||
            s.cornerSquareType !== 'square' ||
            s.cornerDotType !== 'square',
          frame_modified: s.frameEnabled,
          logo_added: s.logoImage !== null,
          text_added: !!(s.title?.trim() || s.caption?.trim() || s.bgText?.trim()),
        }),
      }).catch((err) => console.error('Failed to log download event:', err));
    } catch (err) {
      console.error('Export failed:', err);
      setError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const formats: { key: ExportFormat; label: string; desc: string }[] = [
    { key: 'png', label: 'PNG', desc: 'Best quality' },
    { key: 'svg', label: 'SVG', desc: 'Vector' },
    { key: 'jpeg', label: 'JPEG', desc: 'Smaller size' },
    { key: 'webp', label: 'WebP', desc: 'Modern' },
  ];

  const scales = [
    { value: 1, label: '1×' },
    { value: 2, label: '2×' },
    { value: 3, label: '3×' },
    { value: 4, label: '4×' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 sm:p-8">
      <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/40 flex items-center justify-center text-sm">
          ⬇️
        </span>
        Export Settings
      </h2>

      {/* Format selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">
          Format
        </label>
        <div className="grid grid-cols-4 gap-2.5">
          {formats.map((f) => (
            <button
              key={f.key}
              onClick={() => set({ exportFormat: f.key })}
              className={`px-2 py-2.5 rounded-xl border-2 text-center transition-all duration-200 ${
                exportFormat === f.key
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  exportFormat === f.key ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {f.label}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scale & Transparent */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">
            Resolution
          </label>
          <div className="flex gap-2">
            {scales.map((sc) => (
              <button
                key={sc.value}
                onClick={() => set({ exportScale: sc.value })}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  exportScale === sc.value
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">
            Transparent
          </label>
          <button
            onClick={() => set({ transparentBg: !transparentBg })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
              transparentBg ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                transparentBg ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleExport}
        disabled={!hasContent || exporting}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
          hasContent && !exporting
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        {exporting ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download {exportFormat.toUpperCase()}
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-500 text-center font-medium">{error}</p>
      )}

      {exportFormat === 'svg' && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          SVG exports QR code only (no text overlays or frame)
        </p>
      )}
    </div>
  );
}
