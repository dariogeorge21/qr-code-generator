'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle, MessageCircle, Twitter, Link2, Mail, QrCode, BanknoteX, Loader2 } from 'lucide-react';

export default function ThankYouPage() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://qr.dariogeorge.in';
  const shareMessage = `I just created a free QR code using QR Code Studio. Try it here: ${appUrl}`;

  const shareLinks = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'X / Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      color: 'bg-black dark:bg-white dark:text-black hover:opacity-90',
    },
    {
      label: 'Copy Link',
      icon: Link2,
      href: '#',
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => {
        navigator.clipboard.writeText(appUrl);
        alert('Link copied to clipboard!');
      },
    },
    {
      label: 'Email',
      icon: Mail,
      href: `mailto:?subject=Check%20out%20QR%20Code%20Studio&body=${encodeURIComponent(shareMessage)}`,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Confirmation Banner */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] mb-3">
          Your QR Code is Ready!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Thank you for using QR Code Studio — the free QR code generator.
        </p>
      </div>

      {/* Share Section */}
      <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm mb-8">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-2 text-center">
          Enjoying it? Share with a friend.
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
          Help others discover this free tool.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick(); } : undefined}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${link.color}`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="text-center mb-10 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Love this tool? Support the project
        </p>
        <a
          href="/support"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[var(--color-tertiary)] text-black hover:opacity-90 transition-all shadow-sm"
        >
          <BanknoteX className="w-4 h-4" />
          Support Us
        </a>
      </div>

      {/* Create Another */}
      <div className="text-center">
        <button
          onClick={() => { setNavigating(true); router.push('/create'); }}
          disabled={navigating}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold bg-orange-600 text-white dark:bg-yellow-400 dark:text-black hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer disabled:opacity-70"
        >
          {navigating ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
          {navigating ? 'Loading…' : 'Create Another QR Code'}
        </button>
        <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
          If this helped you, share it with a friend.
        </p>
      </div>
    </div>
  );
}
