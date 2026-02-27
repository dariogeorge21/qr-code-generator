'use client';

import { useState, useRef, CSSProperties, ChangeEvent } from 'react';
import QRCode from 'react-qr-code';
import { toCanvas } from 'qrcode';

const DESIGN_PALETTES = [
  { name: 'Classic',   fg: '#000000', bg: '#FFFFFF' },
  { name: 'Ocean',     fg: '#0C4A6E', bg: '#E0F2FE' },
  { name: 'Sunset',    fg: '#9A3412', bg: '#FFF7ED' },
  { name: 'Forest',    fg: '#14532D', bg: '#F0FDF4' },
  { name: 'Berry',     fg: '#701A75', bg: '#FDF4FF' },
  { name: 'Midnight',  fg: '#1E1B4B', bg: '#EEF2FF' },
  { name: 'Rose',      fg: '#9F1239', bg: '#FFF1F2' },
  { name: 'Amber',     fg: '#78350F', bg: '#FFFBEB' },
  { name: 'Teal',      fg: '#134E4A', bg: '#F0FDFA' },
  { name: 'Slate',     fg: '#1E293B', bg: '#F8FAFC' },
  { name: 'Neon',      fg: '#00FF41', bg: '#0A0A0A' },
  { name: 'Cyber',     fg: '#FF00FF', bg: '#0D0221' },
  { name: 'Retro',     fg: '#FF6B35', bg: '#FFF8F0' },
  { name: 'Mono',      fg: '#333333', bg: '#F5F5F5' },
  { name: 'Coral',     fg: '#BE185D', bg: '#FDF2F8' },
  { name: 'Ice',       fg: '#155E75', bg: '#ECFEFF' },
];

type CornerStyle = 'square' | 'classy' | 'rounded' | 'dots';
type FrameStyle  = 'none' | 'simple' | 'rounded' | 'badge' | 'shadow';

export default function Home() {
  const [mode, setMode] = useState<'general' | 'upi'>('general');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  // UPI Payment fields
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
  const [qrLabel, setQrLabel] = useState('');
  const [showLabel, setShowLabel] = useState(false);

  // Design customization
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState(256);
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>('square');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [activePalette, setActivePalette] = useState('Classic');

  const applyPalette = (palette: (typeof DESIGN_PALETTES)[number]) => {
    setFgColor(palette.fg);
    setBgColor(palette.bg);
    setActivePalette(palette.name);
  };

  const randomizePalette = () => {
    applyPalette(DESIGN_PALETTES[Math.floor(Math.random() * DESIGN_PALETTES.length)]);
  };

  const generateRandomColor = () => {
    const hue  = Math.floor(Math.random() * 360);
    const sat  = Math.floor(Math.random() * 40) + 60;
    const fgL  = Math.floor(Math.random() * 30) + 10;
    const bgL  = Math.floor(Math.random() * 20) + 80;
    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k     = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    setFgColor(hslToHex(hue, sat, fgL));
    setBgColor(hslToHex(hue, sat / 3, bgL));
    setActivePalette('Custom');
  };

  const getCornerRadius = (): number => {
    switch (cornerStyle) {
      case 'classy':  return 6;
      case 'rounded': return 12;
      case 'dots':    return 20;
      default:        return 0;
    }
  };

  const getFrameContainerStyle = (): CSSProperties => {
    const r    = getCornerRadius();
    const base: CSSProperties = {
      backgroundColor: bgColor,
      borderRadius: r > 0 ? `${r + 6}px` : '6px',
      padding: '20px',
      transition: 'all 0.3s',
    };
    switch (frameStyle) {
      case 'simple':
        return { ...base, border: `3px solid ${fgColor}50` };
      case 'rounded':
        return { ...base, border: `3px solid ${fgColor}50`, borderRadius: '20px' };
      case 'badge':
        return { ...base, boxShadow: `0 0 0 4px ${bgColor}, 0 0 0 8px ${fgColor}50` };
      case 'shadow':
        return { ...base, boxShadow: `0 20px 60px -10px ${fgColor}40` };
      default:
        return base;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');
  };

  // Generate UPI payment URL with explicit parameters to avoid state timing issues
  const generateUPIUrl = (upiIdValue?: string, payeeNameValue?: string, amountValue?: string, transactionNoteValue?: string): string => {
    const currentUpiId = upiIdValue !== undefined ? upiIdValue : upiId;
    const currentPayeeName = payeeNameValue !== undefined ? payeeNameValue : payeeName;
    const currentAmount = amountValue !== undefined ? amountValue : amount;
    const currentTransactionNote = transactionNoteValue !== undefined ? transactionNoteValue : transactionNote;
    
    if (!currentUpiId.trim()) {
      return '';
    }
    
    const params = new URLSearchParams();
    params.set('pa', currentUpiId.trim());
    
    if (currentPayeeName.trim()) {
      params.set('pn', currentPayeeName.trim());
    }
    
    if (currentAmount.trim()) {
      // Parse and validate the amount to ensure accuracy
      const trimmedAmount = currentAmount.trim();
      // Remove any non-numeric characters except decimal point
      const cleanedAmount = trimmedAmount.replace(/[^\d.]/g, '');
      
      if (cleanedAmount && cleanedAmount !== '.' && !isNaN(Number(cleanedAmount))) {
        const numValue = Number(cleanedAmount);
        // Only add amount if it's a valid positive number
        if (numValue > 0 && isFinite(numValue)) {
          // Format to 2 decimal places - this preserves the exact value
          // Using toFixed ensures proper formatting without losing digits
          const formattedAmount = numValue.toFixed(2);
          params.set('am', formattedAmount);
          params.set('cu', 'INR');
        }
      }
    }
    
    if (currentTransactionNote.trim()) {
      params.set('tn', currentTransactionNote.trim());
    }
    
    return `upi://pay?${params.toString()}`;
  };

  // Update input value when UPI fields change
  const handleUPIFieldChange = (upiIdValue?: string, payeeNameValue?: string, amountValue?: string, transactionNoteValue?: string) => {
    const upiUrl = generateUPIUrl(upiIdValue, payeeNameValue, amountValue, transactionNoteValue);
    setInputValue(upiUrl);
    setError('');
  };

  // Handle mode switch
  const handleModeSwitch = (newMode: 'general' | 'upi') => {
    setMode(newMode);
    setError('');
    if (newMode === 'general') {
      setInputValue('');
    } else {
      handleUPIFieldChange();
    }
  };

  const handleGenerate = () => {
    if (mode === 'upi') {
      if (!upiId.trim()) {
        setError('Please enter your UPI ID');
        return;
      }
      handleUPIFieldChange();
    } else {
      if (!inputValue.trim()) {
        setError('Please enter some text, URL, or number');
        return;
      }
    }
    setError('');
  };

  const downloadQRCode = async (format: 'png' | 'svg') => {
    if (mode === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID first');
      return;
    }
    if (!inputValue.trim()) {
      setError(mode === 'upi' ? 'Please fill in UPI details first' : 'Please enter some text, URL, or number first');
      return;
    }

    setIsGenerating(true);
    try {
      if (format === 'png') {
        const canvas = document.createElement('canvas');
        const downloadSize = Math.max(qrSize * 2, 512);
        await toCanvas(canvas, inputValue, {
          width: downloadSize,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
        });

        // Apply corner radius clipping if needed
        if (cornerStyle !== 'square') {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const tmp  = document.createElement('canvas');
            tmp.width  = canvas.width;
            tmp.height = canvas.height;
            const tCtx = tmp.getContext('2d')!;
            const r    = getCornerRadius() * (downloadSize / 256);
            tCtx.beginPath();
            tCtx.moveTo(r, 0);
            tCtx.lineTo(tmp.width - r, 0);
            tCtx.quadraticCurveTo(tmp.width, 0, tmp.width, r);
            tCtx.lineTo(tmp.width, tmp.height - r);
            tCtx.quadraticCurveTo(tmp.width, tmp.height, tmp.width - r, tmp.height);
            tCtx.lineTo(r, tmp.height);
            tCtx.quadraticCurveTo(0, tmp.height, 0, tmp.height - r);
            tCtx.lineTo(0, r);
            tCtx.quadraticCurveTo(0, 0, r, 0);
            tCtx.closePath();
            tCtx.clip();
            tCtx.drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tmp, 0, 0);
          }
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${showLabel && qrLabel.trim() ? qrLabel.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' : ''}qrcode-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } else {
        // Generate SVG
        const svg = qrRef.current?.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const link = document.createElement('a');
          link.href = svgUrl;
          link.download = `${showLabel && qrLabel.trim() ? qrLabel.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' : ''}qrcode-${Date.now()}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(svgUrl);
        }
      }
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              QR Code Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Generate custom-designed QR codes with colors, styles &amp; palettes
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Mode Switcher */}
            <div className="mb-6">
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => handleModeSwitch('general')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    mode === 'general'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  General QR Code
                </button>
                <button
                  onClick={() => handleModeSwitch('upi')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    mode === 'upi'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  UPI Payment
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              {mode === 'upi' ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="upi-id"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="upi-id"
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setUpiId(newValue);
                        handleUPIFieldChange(newValue, payeeName, amount, transactionNote);
                      }}
                      placeholder="yourname@paytm or yourname@ybl or yourname@phonepe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@ybl, yourname@phonepe)
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="payee-name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Payee Name
                    </label>
                    <input
                      id="payee-name"
                      type="text"
                      value={payeeName}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setPayeeName(newValue);
                        handleUPIFieldChange(upiId, newValue, amount, transactionNote);
                      }}
                      placeholder="Your Name or Business Name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Amount (₹)
                      </label>
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and decimal point
                          // This ensures we preserve the exact value entered
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setAmount(value);
                            // Pass the new value directly to avoid state timing issues
                            handleUPIFieldChange(upiId, payeeName, value, transactionNote);
                          }
                        }}
                        onBlur={(e) => {
                          // Validate on blur and regenerate URL with current state
                          const value = e.target.value.trim();
                          if (value && !isNaN(Number(value)) && Number(value) > 0) {
                            // Ensure the URL is regenerated with the final value
                            handleUPIFieldChange();
                          }
                        }}
                        placeholder="100.00"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Leave empty for any amount
          </p>
        </div>
                    <div>
                      <label
                        htmlFor="transaction-note"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Transaction Note
                      </label>
                      <input
                        id="transaction-note"
                        type="text"
                        value={transactionNote}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setTransactionNote(newValue);
                          handleUPIFieldChange(upiId, payeeName, amount, newValue);
                        }}
                        placeholder="Payment for..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span>⚠️</span>
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <label
                    htmlFor="qr-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Enter text, URL, or number
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="qr-input"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerate();
                        }
                      }}
                      placeholder="e.g., https://example.com or Hello World"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    />
                    <button
                      onClick={handleGenerate}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isGenerating}
                    >
                      Generate
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span>⚠️</span>
                      {error}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* ── Design Customization Panel ── */}
            <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowDesignPanel(!showDesignPanel)}
                className="w-full px-5 py-3.5 flex items-center justify-between bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  🎨 Customize Design
                  {activePalette !== 'Classic' && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                      {activePalette}
                    </span>
                  )}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showDesignPanel ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDesignPanel && (
                <div className="p-5 space-y-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">

                  {/* Color Pickers */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Colors</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">QR Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color" value={fgColor}
                            onChange={(e) => { setFgColor(e.target.value); setActivePalette('Custom'); }}
                            className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text" value={fgColor}
                            onChange={(e) => { setFgColor(e.target.value); setActivePalette('Custom'); }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Background</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color" value={bgColor}
                            onChange={(e) => { setBgColor(e.target.value); setActivePalette('Custom'); }}
                            className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text" value={bgColor}
                            onChange={(e) => { setBgColor(e.target.value); setActivePalette('Custom'); }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={generateRandomColor}
                        className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:from-pink-600 hover:to-violet-600 transition-all active:scale-95"
                      >
                        🎲 Random Colors
                      </button>
                      <button
                        onClick={() => { setFgColor('#000000'); setBgColor('#FFFFFF'); setActivePalette('Classic'); }}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all active:scale-95"
                      >
                        ↩ Reset
                      </button>
                    </div>
                  </div>

                  {/* Palette Swatches */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Design Palettes</h3>
                      <button onClick={randomizePalette} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium">
                        🔀 Random
                      </button>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {DESIGN_PALETTES.map((palette) => (
                        <button
                          key={palette.name}
                          onClick={() => applyPalette(palette)}
                          title={palette.name}
                          className={`group relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
                            activePalette === palette.name
                              ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700 scale-110'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />
                          <div className="absolute inset-[5px] rounded-sm" style={{ backgroundColor: palette.fg }} />
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 text-white text-[7px] font-bold transition-opacity leading-tight text-center px-0.5">
                            {palette.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Corner Style */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Corner Style</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {([
                        { key: 'square',  label: 'Square',  icon: '◻' },
                        { key: 'classy',  label: 'Classy',  icon: '▫' },
                        { key: 'rounded', label: 'Rounded', icon: '⬜' },
                        { key: 'dots',    label: 'Pill',    icon: '⭕' },
                      ] as const).map((s) => (
                        <button
                          key={s.key}
                          onClick={() => setCornerStyle(s.key)}
                          className={`px-3 py-2.5 rounded-lg border-2 text-xs font-medium transition-all duration-200 ${
                            cornerStyle === s.key
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          <span className="block text-lg mb-0.5">{s.icon}</span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Style */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Frame Style</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {([
                        { key: 'none',    label: 'None',    icon: '✖' },
                        { key: 'simple',  label: 'Border',  icon: '🔲' },
                        { key: 'rounded', label: 'Rounded', icon: '⬜' },
                        { key: 'badge',   label: 'Badge',   icon: '🏷' },
                        { key: 'shadow',  label: 'Shadow',  icon: '🌑' },
                      ] as const).map((s) => (
                        <button
                          key={s.key}
                          onClick={() => setFrameStyle(s.key)}
                          className={`px-2 py-2.5 rounded-lg border-2 text-xs font-medium transition-all duration-200 ${
                            frameStyle === s.key
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          <span className="block text-lg mb-0.5">{s.icon}</span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Slider */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Preview Size: <span className="text-blue-600 dark:text-blue-400">{qrSize}px</span>
                    </h3>
                    <input
                      type="range" min="128" max="400" step="8" value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>128px</span><span>400px</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Optional QR Label */}
            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showLabel}
                  onClick={() => setShowLabel(!showLabel)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showLabel ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showLabel ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add a label to identify this QR code
                </span>
              </label>
              {showLabel && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={qrLabel}
                    onChange={(e) => setQrLabel(e.target.value)}
                    placeholder="e.g., My Website, Office WiFi, Restaurant Menu..."
                    maxLength={50}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
                    {qrLabel.length}/50
                  </p>
                </div>
              )}
            </div>

            {/* QR Code Display */}
            {inputValue.trim() && (
              <div className="mb-8">
                <div className="flex flex-col items-center">
                  <div
                    ref={qrRef}
                    className="transition-all duration-300"
                    style={getFrameContainerStyle()}
                  >
                    <QRCode
                      value={inputValue}
                      size={qrSize}
                      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                      viewBox="0 0 256 256"
                      fgColor={fgColor}
                      bgColor={bgColor}
                    />
                  </div>
                  {showLabel && qrLabel.trim() ? (
                    <div className="mt-3 mb-4 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 text-center">
                        🏷️ {qrLabel}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6" />
                  )}

                  {/* Download Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => downloadQRCode('png')}
                      disabled={isGenerating}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download PNG
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => downloadQRCode('svg')}
                      disabled={isGenerating}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download SVG
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!inputValue.trim() && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">
                  {mode === 'upi'
                    ? 'Fill in your UPI details above to generate a payment QR code'
                    : 'Enter any text, URL, or number above to generate a QR code'}
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>QR codes are generated instantly and can be downloaded in PNG or SVG format</p>
            {mode === 'upi' && (
              <p className="mt-2 text-xs">
                UPI QR codes work with all UPI apps like PhonePe, Google Pay, Paytm, and BHIM
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
