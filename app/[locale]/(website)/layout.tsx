// import Image from 'next/image';
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
      {/* Global page background — fixed wrapper keeps the image from scrolling.
          Commented out: the photo's own details (floor tile grout, cabinet
          seams, window lines) bled through section overlays as faint lines.
          bg-black on the wrapper above replaces it for now. */}
      {/* <div className="fixed inset-0 -z-10" aria-hidden="true">
        <Image
          src="/assets/images/Home.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover scale-125"
          priority
        />
      </div> */}
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
