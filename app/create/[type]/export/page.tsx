'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import BackButton from '../../../components/shared/BackButton';
import QRPreviewCanvas from '../../../components/QRPreviewCanvas';
import { useQRStore } from '../../../store/useQRStore';
import type { ExportFormat } from '../../../types/qr';

// Re-use the export logic from ExportToolbar
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

  const titleH = s.title ? s.titleFontSize * scale * 1.4 : 0;
  const titleGap = s.title ? s.titleSpacing * scale : 0;
  const captionH = s.caption ? s.captionFontSize * scale * 1.4 : 0;
  const captionGap = s.caption ? s.captionSpacing * scale : 0;

  const innerW = qrPx + pad * 2;
  const innerH = qrPx + pad * 2;
  const totalW = innerW + bw * 2;
  const totalH = bw * 2 + titleH + titleGap + innerH + captionGap + captionH;

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
    data: s.inputValue || 'https://example.com',
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
      color: s.transparentBg ? 'transparent' : s.bgColor,
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

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d')!;

  if (!s.transparentBg) {
    ctx.fillStyle = s.bgColor;
    if (s.borderRadius > 0) {
      roundRect(ctx, 0, 0, totalW, totalH, s.borderRadius * scale);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, totalW, totalH);
    }
  }

  // Background text
  if (s.bgText) {
    ctx.save();
    ctx.globalAlpha = s.bgTextOpacity;
    ctx.font = `${s.bgTextFontSize * scale}px ${s.bgTextFontFamily}`;
    ctx.fillStyle = s.bgTextColor;
    if (s.bgTextRepeat) {
      const tw = ctx.measureText(s.bgText).width + 30 * scale;
      const th = s.bgTextFontSize * scale * 1.8;
      ctx.translate(totalW / 2, totalH / 2);
      ctx.rotate((s.bgTextRotation * Math.PI) / 180);
      for (let y = -totalH * 1.5; y < totalH * 1.5; y += th) {
        for (let x = -totalW * 1.5; x < totalW * 1.5; x += tw) {
          ctx.fillText(s.bgText, x, y);
        }
      }
    } else {
      const tx = (s.bgTextX / 100) * totalW;
      const ty = (s.bgTextY / 100) * totalH;
      ctx.translate(tx, ty);
      ctx.rotate((s.bgTextRotation * Math.PI) / 180);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.bgText, 0, 0);
    }
    ctx.restore();
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

  // Border
  if (s.frameEnabled && s.borderWidth > 0) {
    ctx.save();
    ctx.strokeStyle = s.borderColor;
    ctx.lineWidth = bw;
    switch (s.borderType) {
      case 'dashed': ctx.setLineDash([bw * 3, bw * 2]); break;
      case 'dotted': ctx.setLineDash([bw, bw]); break;
      default: ctx.setLineDash([]);
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

  const mimeMap: Record<ExportFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/png',
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
  ].filter(Boolean).join('-');

  return { blob, filename: `${name}.${ext}` };
}

async function svgExport(): Promise<{ blob: Blob; filename: string }> {
  const s = useQRStore.getState();
  const { default: QRCodeStyling } = await import('qr-code-styling');

  const qr = new QRCodeStyling({
    width: s.qrSize * s.exportScale,
    height: s.qrSize * s.exportScale,
    data: s.inputValue || 'https://example.com',
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
  ].filter(Boolean).join('-');

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

export default function ExportPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const router = useRouter();
  const exportFormat = useQRStore((s) => s.exportFormat);
  const exportScale = useQRStore((s) => s.exportScale);
  const transparentBg = useQRStore((s) => s.transparentBg);
  const inputValue = useQRStore((s) => s.inputValue);
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
      const result = exportFormat === 'svg' ? await svgExport() : await compositeExport();
      downloadBlob(result.blob, result.filename);

      // Log detailed download event — fire and forget (no QR content stored)
      const s = useQRStore.getState();
      fetch('/api/qr-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          event_type: 'downloaded',
          qr_type: type,
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
      })
        .then((res) => {
          if (!res.ok) res.json().then((d) => console.error('[qr-events] downloaded error:', d));
        })
        .catch((err) => console.error('[qr-events] network error (downloaded):', err));

      setTimeout(() => router.push('/thank-you'), 500);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const formats: { key: ExportFormat; label: string }[] = [
    { key: 'png', label: 'PNG' },
    { key: 'svg', label: 'SVG' },
    { key: 'jpeg', label: 'JPEG' },
    { key: 'webp', label: 'WebP' },
  ];

  const scales = [
    { value: 1, label: '1×' },
    { value: 2, label: '2×' },
    { value: 3, label: '3×' },
    { value: 4, label: '4×' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <BackButton href={`/create/${type}/logo`} label="Back" />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] mb-3">
          Your QR Code is Ready to Download
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Choose your preferred format and download your QR code.
        </p>
      </div>

      {/* QR Preview */}
      <div className="max-w-sm mx-auto mb-10">
        <QRPreviewCanvas />
      </div>

      {/* Format Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block text-center">
          Format
        </label>
        <div className="flex justify-center gap-2">
          {formats.map((f) => (
            <button
              key={f.key}
              onClick={() => set({ exportFormat: f.key })}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                exportFormat === f.key
                  ? 'bg-[var(--color-secondary)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block text-center">
          Resolution
        </label>
        <div className="flex justify-center gap-2">
          {scales.map((sc) => (
            <button
              key={sc.value}
              onClick={() => set({ exportScale: sc.value })}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                exportScale === sc.value
                  ? 'bg-[var(--color-secondary)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transparent toggle */}
      {(exportFormat === 'png' || exportFormat === 'webp') && (
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-sm font-medium text-[var(--color-text)]">Transparent Background</span>
          <button
            onClick={() => set({ transparentBg: !transparentBg })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
              transparentBg ? 'bg-[var(--color-secondary)]' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${transparentBg ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={!hasContent || exporting}
          className={`inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-500/30 ${
            hasContent && !exporting
              ? 'bg-orange-600 text-white dark:bg-yellow-400 dark:text-black'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          {exporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download QR Code
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 text-center font-medium">{error}</p>
      )}

      {exportFormat === 'svg' && (
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          SVG exports QR code only (no text overlays or frame)
        </p>
      )}
    </div>
  );
}
