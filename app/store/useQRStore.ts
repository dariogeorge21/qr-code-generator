import { create } from 'zustand';
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  BorderType,
  ExportFormat,
  ErrorCorrectionLevel,
  TextAlign,
  TextTransform,
  TextDecoration,
  BlendMode,
  GradientConfig,
  LogoShape,
} from '../types/qr';

export interface QRState {
  // ── Input ──
  mode: 'general' | 'upi';
  qrType: string; // e.g. 'website' | 'payment' | 'wifi' | 'text' | etc.
  inputValue: string;
  upiId: string;
  payeeName: string;
  amount: string;
  transactionNote: string;

  // ── Colors ──
  fgColor: string;
  bgColor: string;
  activePalette: string;
  useFgGradient: boolean;
  fgGradient: GradientConfig;

  // ── QR Body ──
  dotType: DotType;

  // ── Eyes ──
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  useCustomEyeColors: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;

  // ── Frame ──
  frameEnabled: boolean;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  borderType: BorderType;
  borderOpacity: number;
  individualCorners: boolean;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  frameBgEnabled: boolean;
  frameBgColor: string;
  padding: number;
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  shadowInset: boolean;

  // ── Background Text ──
  bgText: string;
  bgTextFontFamily: string;
  bgTextFontSize: number;
  bgTextFontWeight: string;
  bgTextColor: string;
  bgTextOpacity: number;
  bgTextX: number;
  bgTextY: number;
  bgTextRotation: number;
  bgTextRepeat: boolean;
  bgTextLetterSpacing: number;
  bgTextTextTransform: TextTransform;
  bgTextBlendMode: BlendMode;

  // ── Title & Caption ──
  title: string;
  titleFontFamily: string;
  titleFontSize: number;
  titleFontWeight: string;
  titleColor: string;
  titleAlign: TextAlign;
  titleSpacing: number;
  titleLetterSpacing: number;
  titleTextTransform: TextTransform;
  titleTextDecoration: TextDecoration;
  titleTextShadow: boolean;
  titleTextShadowColor: string;
  titleTextShadowBlur: number;
  caption: string;
  captionFontFamily: string;
  captionFontSize: number;
  captionFontWeight: string;
  captionColor: string;
  captionAlign: TextAlign;
  captionSpacing: number;
  captionLetterSpacing: number;
  captionTextTransform: TextTransform;
  captionTextDecoration: TextDecoration;
  captionTextShadow: boolean;
  captionTextShadowColor: string;
  captionTextShadowBlur: number;

  // ── Logo ──
  logoImage: string | null;
  logoSize: number;
  logoMargin: number;
  logoPadding: number;
  logoRadius: number;
  logoOpacity: number;
  logoRotation: number;
  logoBgColor: string;
  logoBgEnabled: boolean;
  logoBorderWidth: number;
  logoBorderColor: string;
  logoBorderEnabled: boolean;
  logoShape: LogoShape;
  logoGrayscale: boolean;
  logoShadowEnabled: boolean;
  logoShadowBlur: number;
  logoShadowColor: string;

  // ── Size & Quality ──
  qrSize: number;
  errorCorrectionLevel: ErrorCorrectionLevel;

  // ── Export ──
  exportFormat: ExportFormat;
  exportScale: number;
  transparentBg: boolean;

  // ── UI ──
  activeTab: string;
}

interface QRActions {
  set: (partial: Partial<QRState>) => void;
  reset: () => void;
  generateUPIUrl: () => string;
}

export type QRStore = QRState & QRActions;

const initialState: QRState = {
  mode: 'general',
  qrType: '',
  inputValue: '',
  upiId: '',
  payeeName: '',
  amount: '',
  transactionNote: '',

  fgColor: '#000000',
  bgColor: '#FFFFFF',
  activePalette: 'Classic',
  useFgGradient: false,
  fgGradient: {
    type: 'linear',
    rotation: 0,
    colorStops: [
      { offset: 0, color: '#000000' },
      { offset: 1, color: '#4F46E5' },
    ],
  },

  dotType: 'square',

  cornerSquareType: 'square',
  cornerDotType: 'square',
  useCustomEyeColors: false,
  cornerSquareColor: '#000000',
  cornerDotColor: '#000000',

  frameEnabled: false,
  borderWidth: 2,
  borderColor: '#00000030',
  borderRadius: 12,
  borderType: 'solid',
  borderOpacity: 100,
  individualCorners: false,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  borderBottomLeftRadius: 12,
  frameBgEnabled: false,
  frameBgColor: '#f0f0f0',
  padding: 20,
  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 20,
  shadowSpread: 0,
  shadowColor: '#00000025',
  shadowInset: false,

  bgText: '',
  bgTextFontFamily: 'Inter',
  bgTextFontSize: 48,
  bgTextFontWeight: '400',
  bgTextColor: '#000000',
  bgTextOpacity: 0.06,
  bgTextX: 50,
  bgTextY: 50,
  bgTextRotation: -30,
  bgTextRepeat: false,
  bgTextLetterSpacing: 0,
  bgTextTextTransform: 'none',
  bgTextBlendMode: 'normal',

  title: '',
  titleFontFamily: 'Inter',
  titleFontSize: 20,
  titleFontWeight: '600',
  titleColor: '#1a1a1a',
  titleAlign: 'center',
  titleSpacing: 12,
  titleLetterSpacing: 0,
  titleTextTransform: 'none',
  titleTextDecoration: 'none',
  titleTextShadow: false,
  titleTextShadowColor: '#00000040',
  titleTextShadowBlur: 4,
  caption: '',
  captionFontFamily: 'Inter',
  captionFontSize: 14,
  captionFontWeight: '400',
  captionColor: '#666666',
  captionAlign: 'center',
  captionSpacing: 12,
  captionLetterSpacing: 0,
  captionTextTransform: 'none',
  captionTextDecoration: 'none',
  captionTextShadow: false,
  captionTextShadowColor: '#00000040',
  captionTextShadowBlur: 4,

  logoImage: null,
  logoSize: 0.25,
  logoMargin: 5,
  logoPadding: 5,
  logoRadius: 4,
  logoOpacity: 1,
  logoRotation: 0,
  logoBgColor: '#FFFFFF',
  logoBgEnabled: false,
  logoBorderWidth: 2,
  logoBorderColor: '#000000',
  logoBorderEnabled: false,
  logoShape: 'square',
  logoGrayscale: false,
  logoShadowEnabled: false,
  logoShadowBlur: 8,
  logoShadowColor: '#00000040',

  qrSize: 280,
  errorCorrectionLevel: 'M',

  exportFormat: 'png',
  exportScale: 2,
  transparentBg: false,

  activeTab: 'colors',
};

export const useQRStore = create<QRStore>((set, get) => ({
  ...initialState,

  set: (partial) => set(partial),

  reset: () => set({ ...initialState }),

  generateUPIUrl: () => {
    const { upiId, payeeName, amount, transactionNote } = get();
    if (!upiId.trim()) return '';
    const params = new URLSearchParams();
    params.set('pa', upiId.trim());
    if (payeeName.trim()) params.set('pn', payeeName.trim());
    if (amount.trim()) {
      const cleaned = amount.trim().replace(/[^\d.]/g, '');
      const num = Number(cleaned);
      if (cleaned && cleaned !== '.' && !isNaN(num) && num > 0 && isFinite(num)) {
        params.set('am', num.toFixed(2));
        params.set('cu', 'INR');
      }
    }
    if (transactionNote.trim()) params.set('tn', transactionNote.trim());
    return `upi://pay?${params.toString()}`;
  },
}));
