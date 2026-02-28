'use client';

import { useEffect, useRef, useState, CSSProperties } from 'react';
import { useQRStore } from '../store/useQRStore';

export default function QRPreviewCanvas() {
  const inputValue = useQRStore((s) => s.inputValue);
  const qrSize = useQRStore((s) => s.qrSize);
  const fgColor = useQRStore((s) => s.fgColor);
  const bgColor = useQRStore((s) => s.bgColor);
  const dotType = useQRStore((s) => s.dotType);
  const useFgGradient = useQRStore((s) => s.useFgGradient);
  const fgGradient = useQRStore((s) => s.fgGradient);
  const cornerSquareType = useQRStore((s) => s.cornerSquareType);
  const cornerDotType = useQRStore((s) => s.cornerDotType);
  const useCustomEyeColors = useQRStore((s) => s.useCustomEyeColors);
  const cornerSquareColor = useQRStore((s) => s.cornerSquareColor);
  const cornerDotColor = useQRStore((s) => s.cornerDotColor);
  const errorCorrectionLevel = useQRStore((s) => s.errorCorrectionLevel);
  const transparentBg = useQRStore((s) => s.transparentBg);
  const logoImage = useQRStore((s) => s.logoImage);
  const logoSize = useQRStore((s) => s.logoSize);
  const logoMargin = useQRStore((s) => s.logoMargin);
  const frameEnabled = useQRStore((s) => s.frameEnabled);
  const borderWidth = useQRStore((s) => s.borderWidth);
  const borderColor = useQRStore((s) => s.borderColor);
  const borderRadius = useQRStore((s) => s.borderRadius);
  const borderType = useQRStore((s) => s.borderType);
  const borderOpacity = useQRStore((s) => s.borderOpacity);
  const individualCorners = useQRStore((s) => s.individualCorners);
  const borderTopLeftRadius = useQRStore((s) => s.borderTopLeftRadius);
  const borderTopRightRadius = useQRStore((s) => s.borderTopRightRadius);
  const borderBottomRightRadius = useQRStore((s) => s.borderBottomRightRadius);
  const borderBottomLeftRadius = useQRStore((s) => s.borderBottomLeftRadius);
  const frameBgEnabled = useQRStore((s) => s.frameBgEnabled);
  const frameBgColor = useQRStore((s) => s.frameBgColor);
  const padding = useQRStore((s) => s.padding);
  const shadowEnabled = useQRStore((s) => s.shadowEnabled);
  const shadowX = useQRStore((s) => s.shadowX);
  const shadowY = useQRStore((s) => s.shadowY);
  const shadowBlur = useQRStore((s) => s.shadowBlur);
  const shadowSpread = useQRStore((s) => s.shadowSpread);
  const shadowColor = useQRStore((s) => s.shadowColor);
  const shadowInset = useQRStore((s) => s.shadowInset);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const QRCodeStylingClass = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrInstance = useRef<any>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Build QR options
  const buildOptions = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dotsOpts: any = { type: dotType };
    if (useFgGradient) {
      dotsOpts.gradient = {
        type: fgGradient.type,
        rotation: (fgGradient.rotation * Math.PI) / 180,
        colorStops: fgGradient.colorStops,
      };
    } else {
      dotsOpts.color = fgColor;
    }

    return {
      width: qrSize,
      height: qrSize,
      data: inputValue || 'https://example.com',
      margin: 0,
      type: 'canvas' as const,
      qrOptions: { errorCorrectionLevel },
      dotsOptions: dotsOpts,
      cornersSquareOptions: {
        type: cornerSquareType,
        color: useCustomEyeColors ? cornerSquareColor : fgColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: useCustomEyeColors ? cornerDotColor : fgColor,
      },
      backgroundOptions: {
        color: 'transparent',
      },
      ...(logoImage
        ? {
            image: logoImage,
            imageOptions: {
              hideBackgroundDots: true,
              imageSize: logoSize,
              margin: logoMargin,
              crossOrigin: 'anonymous' as const,
            },
          }
        : {}),
    };
  };

  // Load library once
  useEffect(() => {
    import('qr-code-styling').then((mod) => {
      QRCodeStylingClass.current = mod.default;
      setLoaded(true);
    });
  }, []);

  // Create or update QR
  useEffect(() => {
    if (!loaded || !QRCodeStylingClass.current) return;

    const options = buildOptions();

    if (!qrInstance.current) {
      qrInstance.current = new QRCodeStylingClass.current(options);
    } else {
      qrInstance.current.update(options);
    }

    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      qrInstance.current.append(qrContainerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loaded, inputValue, qrSize, fgColor, bgColor, dotType, useFgGradient,
    fgGradient, cornerSquareType, cornerDotType, useCustomEyeColors,
    cornerSquareColor, cornerDotColor, errorCorrectionLevel,
    logoImage, logoSize, logoMargin,
  ]);

  const hasContent = inputValue.trim().length > 0;

  // Frame container style
  const frameStyle: CSSProperties = {
    backgroundColor: frameBgEnabled
      ? frameBgColor
      : transparentBg
        ? 'transparent'
        : bgColor,
    padding: `${padding}px`,
    borderRadius: individualCorners
      ? `${borderTopLeftRadius}px ${borderTopRightRadius}px ${borderBottomRightRadius}px ${borderBottomLeftRadius}px`
      : `${borderRadius}px`,
    transition: 'all 0.2s ease',
    ...(frameEnabled
      ? {
          borderWidth: `${borderWidth}px`,
          borderStyle: borderType,
          borderColor: borderColor,
          opacity: borderOpacity / 100,
        }
      : {}),
    ...(shadowEnabled
      ? { boxShadow: `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}` }
      : {}),
  };

  // Transparent background checkerboard
  const checkerStyle: CSSProperties = transparentBg
    ? {
        backgroundImage: `
          linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
          linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
          linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
        `,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
      }
    : {};

  if (!hasContent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-24 h-24 rounded-3xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center mb-6 shadow-inner">
            <span className="text-4xl opacity-40">📱</span>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
            Enter content to generate your QR code
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Text, URL, phone number, email, UPI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 sm:p-8 flex flex-col items-center">
      <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2.5 self-start w-full">
        <span className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/40 flex items-center justify-center text-sm">
          👁
        </span>
        Live Preview
      </h2>

      <div className="flex flex-col items-center">
        {/* Title */}
        {title && (
          <div
            className="w-full mb-0 transition-all"
            style={{
              fontFamily: titleFontFamily,
              fontSize: `${titleFontSize}px`,
              fontWeight: titleFontWeight,
              color: titleColor,
              textAlign: titleAlign,
              marginBottom: `${titleSpacing}px`,
            }}
          >
            {title}
          </div>
        )}

        {/* QR Frame */}
        <div className="relative inline-block overflow-hidden" style={{ ...frameStyle, ...checkerStyle }}>
          {/* Background text - single */}
          {bgText && !bgTextRepeat && (
            <div
              className="absolute pointer-events-none select-none"
              style={{
                left: `${bgTextX}%`,
                top: `${bgTextY}%`,
                transform: `translate(-50%, -50%) rotate(${bgTextRotation}deg)`,
                fontFamily: bgTextFontFamily,
                fontSize: `${bgTextFontSize}px`,
                color: bgTextColor,
                opacity: bgTextOpacity,
                whiteSpace: 'nowrap',
                zIndex: 1,
              }}
            >
              {bgText}
            </div>
          )}

          {/* Background text - repeat watermark */}
          {bgText && bgTextRepeat && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 1 }}>
              {Array.from({ length: 7 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <div
                    key={`wm-${row}-${col}`}
                    className="absolute whitespace-nowrap"
                    style={{
                      left: `${col * 28 - 10}%`,
                      top: `${row * 20 - 10}%`,
                      transform: `rotate(${bgTextRotation}deg)`,
                      fontFamily: bgTextFontFamily,
                      fontSize: `${bgTextFontSize * 0.5}px`,
                      color: bgTextColor,
                      opacity: bgTextOpacity,
                    }}
                  >
                    {bgText}
                  </div>
                ))
              )}
            </div>
          )}

          {/* QR Code */}
          <div ref={qrContainerRef} className="relative" style={{ zIndex: 2 }}>
            {!loaded && (
              <div
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg"
                style={{ width: qrSize, height: qrSize }}
              >
                <span className="text-gray-400 text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <div
            className="w-full mt-0 transition-all"
            style={{
              fontFamily: captionFontFamily,
              fontSize: `${captionFontSize}px`,
              fontWeight: captionFontWeight,
              color: captionColor,
              textAlign: captionAlign,
              marginTop: `${captionSpacing}px`,
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
