import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div>
            <h3 className="text-lg font-extrabold text-[var(--color-primary)] mb-2">
              QR CODE STUDIO
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Free QR code generator for students and small businesses.
            </p>
          </div>

          {/* Centre */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text)] mb-3 uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'URL QR Code', href: '/create/website' },
                { label: 'WiFi QR Code', href: '/create/wifi' },
                { label: 'Payment QR Code', href: '/create/payment' },
                { label: 'Custom QR Code', href: '/create/text' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text)] mb-3 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'About', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Support This Project', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2026 QR Code Studio. Built with love by Dario.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
