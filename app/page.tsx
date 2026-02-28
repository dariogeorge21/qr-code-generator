'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Eye, Download, Loader2 } from 'lucide-react';
import ThemeToggle from './components/shared/ThemeToggle';
import Footer from './components/shared/Footer';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/create');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--color-primary)] mb-6 tracking-tight">
            QR CODE STUDIO
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            A highly customisable QR Code Generator. Create QR codes for payments, websites, social media, contacts, WiFi, and more — instantly, for free.
          </p>
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[var(--color-secondary)]/30 cursor-pointer ${
              loading
                ? 'bg-[var(--color-secondary)] dark:bg-[var(--color-primary)] text-white dark:text-black w-48'
                : 'bg-[var(--color-secondary)] text-white dark:bg-[var(--color-primary)] dark:text-black w-48'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: QrCode,
              title: '9 QR Types',
              desc: 'Payment, Website, Social Media, Contact, WiFi, Text, Email, Phone, SMS',
            },
            {
              icon: Eye,
              title: 'Live Preview',
              desc: 'See your QR code update in real-time as you customise every detail',
            },
            {
              icon: Download,
              title: 'Export PNG / SVG',
              desc: 'Download in multiple formats at up to 4× resolution — completely free',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-[var(--color-secondary)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            Generate QR Codes for Any Purpose
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            QR Code Studio is a free QR code generator that lets you create wifi QR codes, UPI payment QR codes, and fully custom QR codes in seconds. Whether you need a QR code for your business card, restaurant menu, or event — our custom QR code maker has you covered. No sign-up required. No watermarks. Just free, beautiful QR codes.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
