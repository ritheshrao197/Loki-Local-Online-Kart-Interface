
'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from '@/components/layout/MobileNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or null on the server
    // to prevent hydration mismatch
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 border-b" />
        <main className="flex-1">{children}</main>
        <div className="h-16" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? <MobileNav /> : <Header />}
      <main className="flex-1">{children}</main>
      {isMobile ? <div className="h-16" /> : <Footer />}
    </div>
  );
}
