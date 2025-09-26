
'use client';
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from '@/components/layout/MobileNav';
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 border-b" />
        <main className="flex-1">{children}</main>
        <div className="h-20 border-t" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden md:block">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="md:hidden">
         <div className="h-16" /> {/* Spacer for the bottom nav */}
        <MobileNav />
      </div>
    </div>
  );
}
