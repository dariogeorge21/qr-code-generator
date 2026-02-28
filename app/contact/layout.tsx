import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
