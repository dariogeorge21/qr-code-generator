'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toCanvas } from 'qrcode';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');
  };

  // Generate UPI payment URL
  const generateUPIUrl = (): string => {
    if (!upiId.trim()) {
      return '';
    }
    
    const params = new URLSearchParams();
    params.set('pa', upiId.trim());
    
    if (payeeName.trim()) {
      params.set('pn', payeeName.trim());
    }
    
    if (amount.trim()) {
      // Parse and validate the amount to ensure accuracy
      const trimmedAmount = amount.trim();
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
    
    if (transactionNote.trim()) {
      params.set('tn', transactionNote.trim());
    }
    
    return `upi://pay?${params.toString()}`;
  };

  // Update input value when UPI fields change
  const handleUPIFieldChange = () => {
    const upiUrl = generateUPIUrl();
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
        // Create a canvas element for PNG generation
        const canvas = document.createElement('canvas');
        await toCanvas(canvas, inputValue, {
          width: 512,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode-${Date.now()}.png`;
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
          link.download = `qrcode-${Date.now()}.svg`;
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
              Generate QR codes for text, URLs, numbers, or UPI payments instantly
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
            <div className="mb-8">
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
                        setUpiId(e.target.value);
                        handleUPIFieldChange();
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
                        setPayeeName(e.target.value);
                        handleUPIFieldChange();
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
                            handleUPIFieldChange();
                          }
                        }}
                        onBlur={(e) => {
                          // Validate and format on blur, but preserve exact input while typing
                          const value = e.target.value.trim();
                          if (value && !isNaN(Number(value)) && Number(value) > 0) {
                            // Only format if it's a valid number, but keep original precision
                            const numValue = Number(value);
                            if (numValue > 0 && isFinite(numValue)) {
                              // Don't change the value, just ensure it's valid
                              // The formatting happens in generateUPIUrl
                            }
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
                          setTransactionNote(e.target.value);
                          handleUPIFieldChange();
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

            {/* QR Code Display */}
            {inputValue.trim() && (
              <div className="mb-8">
                <div className="flex flex-col items-center">
                  <div
                    ref={qrRef}
                    className="bg-white p-6 rounded-xl shadow-inner border-2 border-gray-200 dark:border-gray-700 mb-6 transition-all duration-300"
                  >
                    <QRCode
                      value={inputValue}
                      size={256}
                      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                      viewBox="0 0 256 256"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>

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
