
'use client';
import { useEffect, useState } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isClient ? (isMobile ? <MobileNav /> : <Header />) : <div className="h-16 border-b" />}
      <main className="flex-1">{children}</main>
      {isClient ? (isMobile ? <div className="h-16" /> : <Footer />) : <div className="h-16" />}
    </div>
  );
}
