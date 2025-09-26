'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = sessionStorage.getItem('userRole');
      const userId = sessionStorage.getItem('userId');

      // Only redirect if they are NOT on the homepage
      if (pathname !== '/') {
        if (userRole === 'admin') {
          router.replace('/admin');
        } else if (userRole === 'seller' && userId) {
          router.replace(`/dashboard/${userId}`);
        }
      }
    }
  }, [router, pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {isMobile ? <div className="h-16" /> : <Footer />}
    </div>
  );
}