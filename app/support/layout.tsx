import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

export const metadata = {
  title: 'Support This Project — QR Code Studio',
  description: 'Support the development of QR Code Studio. Every coffee helps keep this free tool alive.',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
