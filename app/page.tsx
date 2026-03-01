'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Eye, Download, Loader2, TrendingUp } from 'lucide-react';
import ThemeToggle from './components/shared/ThemeToggle';
import Footer from './components/shared/Footer';

interface QRCounterData {
  total_generated: number;
  total_downloaded: number;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    // Adjust duration (1000ms = 1 second)
    const duration = 1000;
    const incrementTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState<QRCounterData | null>(null);
  const [counterLoading, setCounterLoading] = useState(true);

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch('/api/qr-counter');
        if (response.ok) {
          const data = await response.json();
          setCounter(data);
        }
      } catch (error) {
        console.error('Failed to fetch counter:', error);
      } finally {
        setCounterLoading(false);
      }
    };

    fetchCounter();
  }, []);


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
          
          {/* QR Counter Stats */}
          {!counterLoading && counter && (
            <div className="mb-12 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
              
              {/* Stat Card 1: Generated */}
              <div className="w-full sm:w-1/2 flex items-center gap-5 p-5 sm:p-6 rounded-3xl bg-[var(--color-background)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-3xl font-black text-[var(--color-text)] tracking-tight leading-none mb-1">
                    <AnimatedCounter value={counter.total_generated} />
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    QR Codes Generated
                  </span>
                </div>
              </div>

              {/* Stat Card 2: Downloaded */}
              <div className="w-full sm:w-1/2 flex items-center gap-5 p-5 sm:p-6 rounded-3xl bg-[var(--color-background)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-3xl font-black text-[var(--color-text)] tracking-tight leading-none mb-1">
                    <AnimatedCounter value={counter.total_downloaded} />
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Total Downloads
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-orange-500/30 cursor-pointer ${
              loading
                ? 'bg-orange-600 dark:bg-yellow-400 text-white dark:text-black w-48'
                : 'bg-orange-600 text-white dark:bg-yellow-400 dark:text-black w-48'
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
