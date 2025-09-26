
'use client';
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from '@/components/layout/MobileNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
