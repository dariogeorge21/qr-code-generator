'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/shared/BackButton';
import ActionBar from '../../components/shared/ActionBar';
import QRPreviewCanvas from '../../components/QRPreviewCanvas';
import { useQRStore } from '../../store/useQRStore';
import InputFormByType from '@/app/components/InputFormByType';

const VALID_TYPES = ['payment', 'website', 'social', 'contact', 'wifi', 'text', 'email', 'phone', 'sms'];

const TYPE_TITLES: Record<string, string> = {
  payment: 'Payment (UPI)',
  website: 'Website / URL',
  social: 'Social Media',
  contact: 'Contact Info',
  wifi: 'WiFi Network',
  text: 'Custom Text',
  email: 'Email',
  phone: 'Phone Number',
  sms: 'SMS Message',
};

export default function InputPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const router = useRouter();

  useEffect(() => {
    if (!VALID_TYPES.includes(type)) {
      router.replace('/create');
    }
  }, [type, router]);

  if (!VALID_TYPES.includes(type)) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
      <BackButton href="/create" label="Back" />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] mb-8">
        {TYPE_TITLES[type] || 'Create QR Code'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Input Form */}
        <div className="lg:w-[45%] shrink-0">
          <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
            <InputFormByType type={type} />
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 min-w-0">
          <div className="lg:sticky lg:top-24">
            <QRPreviewCanvas />
          </div>
        </div>
      </div>

      <ActionBar
        downloadHref={`/create/${type}/export`}
        continueHref={`/create/${type}/colors`}
        continueLabel="Customise QR Code"
      />
    </div>
  );
}
