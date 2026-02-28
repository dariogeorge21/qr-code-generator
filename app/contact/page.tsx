'use client';

import { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle } from 'lucide-react';

const SOCIAL = [
  {
    icon: Github,
    label: 'GitHub',
    handle: '@dariogeorge21',
    href: 'https://github.com/dariogeorge21',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    handle: 'Dario George',
    href: 'https://linkedin.com/in/dariogeorge21',
  },
  {
    icon: Mail,
    label: 'Email',
    handle: 'hello@qrcodestudio.app',
    href: 'mailto:hello@qrcodestudio.app',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-600 outline-none bg-[var(--color-background)] text-[var(--color-text)] placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200';
  const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate submission — wire up a real backend/formspree/resend here
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text)] mb-4 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Have a question, found a bug, or just want to say hi? I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact form */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="w-9 h-9 text-green-500" />
                </div>
                <h2 className="text-xl font-extrabold text-[var(--color-text)] mb-2">
                  Message Sent!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Thanks for reaching out. I&apos;ll get back to you as soon as I can.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 text-sm font-semibold text-orange-600 dark:text-yellow-400 hover:opacity-70 transition-opacity"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me what's on your mind..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-orange-600 dark:bg-yellow-400 dark:text-black hover:opacity-90 transition-all active:scale-[0.98] shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
            <h2 className="text-base font-extrabold text-[var(--color-text)] mb-4">
              Other ways to reach me
            </h2>
            <ul className="space-y-4">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-orange-50 dark:group-hover:bg-yellow-400/10 transition-colors">
                      <s.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {s.label}
                      </p>
                      <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-orange-600 dark:group-hover:text-yellow-400 transition-colors">
                        {s.handle}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
            <h2 className="text-base font-extrabold text-[var(--color-text)] mb-2">
              Response time
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              I typically respond within 24–48 hours. For bug reports, please include your browser and OS version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
