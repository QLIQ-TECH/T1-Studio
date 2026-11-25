import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-x-hidden bg-black">
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
