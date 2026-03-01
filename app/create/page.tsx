'use client';

import { useRouter } from 'next/navigation';
import {
  Wallet,
  Globe,
  Share2,
  Contact,
  Wifi,
  Type,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';
import BackButton from '../components/shared/BackButton';
import { useQRStore } from '../store/useQRStore';

const QR_TYPES = [
  { label: 'Payment (UPI)', icon: Wallet, type: 'payment' },
  { label: 'Website / URL', icon: Globe, type: 'website' },
  { label: 'Social Media', icon: Share2, type: 'social' },
  { label: 'Contact Info', icon: Contact, type: 'contact' },
  { label: 'WiFi', icon: Wifi, type: 'wifi' },
  { label: 'Custom Text', icon: Type, type: 'text' },
  { label: 'Email', icon: Mail, type: 'email' },
  { label: 'Phone', icon: Phone, type: 'phone' },
  { label: 'SMS', icon: MessageSquare, type: 'sms' },
] as const;

export default function CreatePage() {
  const router = useRouter();
  const set = useQRStore((s) => s.set);
  const reset = useQRStore((s) => s.reset);

  const handleSelect = (type: string) => {
    reset();
    if (type === 'payment') {
      set({ mode: 'upi', qrType: type });
    } else {
      set({ mode: 'general', qrType: type });
    }

    // Log a 'generated' event with the chosen QR type (fire-and-forget, keepalive so navigation can't cancel it)
    fetch('/api/qr-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'generated', qr_type: type }),
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) res.json().then((d) => console.error('[qr-events] generated error:', d));
      })
      .catch((err) => console.error('[qr-events] network error (generated):', err));

    router.push(`/create/${type}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <BackButton href="/" label="Back" />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] mb-3">
          What do you want to create?
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Choose a QR code type to get started
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {QR_TYPES.map((item) => (
          <button
            key={item.type}
            onClick={() => handleSelect(item.type)}
            className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-600 dark:hover:border-yellow-400 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
          >
            <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-secondary)] dark:text-[var(--color-tertiary)] group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base font-semibold text-[var(--color-text)] text-center">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
