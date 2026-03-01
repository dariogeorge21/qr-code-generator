import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — QR Code Studio',
  description: 'Read the Terms of Service for QR Code Studio.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
