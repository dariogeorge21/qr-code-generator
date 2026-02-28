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
              Pages
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
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
              Community
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Contact', href: '/contact' },
                { label: 'About', href: '/about' },
                { label: 'Support This Project', href: '/support' },
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
            © 2026 QR Code Studio. Built with love by Dario George
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dariogeorge21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/dariogeorge21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/dariogeorge21/qr-code-studio/issues/new?assignees=&labels=bug&template=bug_report.md&title="
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
