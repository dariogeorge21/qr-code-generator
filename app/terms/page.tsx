export default function TermsPage() {
  const EFFECTIVE = 'March 1, 2026';
  const CONTACT_EMAIL = 'edu.dariogeorge21@gmail.com';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-widest">
          Legal
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--color-text)]">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Effective date: <strong>{EFFECTIVE}</strong>
        </p>
      </div>

      {/* Body */}
      <article className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-[var(--color-text)]">

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using QR Code Studio (&quot;the Service&quot;, &quot;we&quot;, &quot;our&quot;) at this website, you agree to
            be bound by these Terms of Service. If you do not agree, please discontinue use immediately.
          </p>
          <p>
            These terms apply to all visitors, users, and others who access the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            QR Code Studio is a free, browser-based tool that lets you generate, customise, and download
            QR codes for personal and commercial use. The Service is provided &quot;as is&quot; without charge.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof)
            at any time without prior notice.
          </p>
        </Section>

        <Section title="3. Permitted Use">
          <ul>
            <li>You may use the Service to generate QR codes for any lawful purpose, personal or commercial.</li>
            <li>You may freely share, print, embed, and distribute QR codes generated with this tool.</li>
            <li>Attribution is appreciated but not required.</li>
          </ul>
        </Section>

        <Section title="4. Prohibited Use">
          <p>You agree <strong>not</strong> to use the Service to:</p>
          <ul>
            <li>Generate QR codes that link to illegal, harmful, fraudulent, or deceptive content.</li>
            <li>Distribute malware, phishing links, or any code designed to deceive end users.</li>
            <li>Attempt to scrape, reverse-engineer, or overload the Service infrastructure.</li>
            <li>Use the Service in a manner that violates any applicable local, national, or international law.</li>
          </ul>
          <p>
            We reserve the right to block access if we detect abuse of the Service.
          </p>
        </Section>

        <Section title="5. Your Content & Privacy">
          <p>
            <strong>We do not store the content of your QR codes.</strong> The URL, text, WiFi password,
            UPI ID, or any other data you encode into a QR code is processed entirely in your browser and
            is never transmitted to or retained on our servers.
          </p>
          <p>
            We collect only anonymous, non-identifiable usage metadata (e.g., which QR type was generated,
            which export format was chosen). See our{' '}
            <a href="/privacy" className="text-[var(--color-secondary)] underline underline-offset-2 hover:opacity-80">
              Privacy Policy
            </a>{' '}
            for full details.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The QR Code Studio name, logo, design, and source code are the property of Dario George.
            All rights are reserved except where otherwise noted.
          </p>
          <p>
            QR codes you generate belong entirely to you. We claim no ownership or rights over the
            content or QR images you create.
          </p>
        </Section>

        <Section title="7. Third-Party Services">
          <p>
            The Service uses <strong>Supabase</strong> for database storage (anonymous usage counters and
            contact form submissions). By using the Service, you acknowledge that data may be stored on
            Supabase&apos;s infrastructure. Supabase&apos;s own{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-secondary)] underline underline-offset-2 hover:opacity-80"
            >
              Privacy Policy
            </a>{' '}
            applies to that storage.
          </p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>
            The Service is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> without any
            warranties of any kind, either express or implied, including but not limited to
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, or free of viruses
            or other harmful components.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, QR Code Studio and its creator shall
            not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of, or inability to use, the Service.
          </p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>
            We reserve the right to update these Terms at any time. Changes become effective upon
            posting to this page. Continued use of the Service after changes constitutes acceptance
            of the revised Terms.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            If you have any questions about these Terms, please reach out:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--color-secondary)] underline underline-offset-2 hover:opacity-80"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>
      </article>

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex flex-wrap gap-4 text-sm">
        <a href="/privacy" className="text-[var(--color-secondary)] hover:opacity-80 transition">
          Privacy Policy →
        </a>
        <a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-[var(--color-secondary)] transition">
          Contact Us
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-3 mt-8">{title}</h2>
      <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
}
