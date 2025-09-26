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
    if (typeof window !== 'undefined') {
      const userRole = sessionStorage.getItem('userRole');
      const userId = sessionStorage.getItem('userId');

      // Define public routes that all users can access
      const publicRoutes = [
        '/home',
        '/products',
        '/categories',
        '/search',
        '/deals',
        '/wishlist',
        '/about',
        '/contact',
        '/faq',
        '/privacy',
        '/blogs',
        '/sellers',
        '/discover',
        '/cart',
        '/profile'
      ];

      // Only redirect if they are NOT on a public route
      if (!publicRoutes.includes(pathname)) {
        if (userRole === 'admin') {
          router.replace('/admin');
        } else if (userRole === 'seller' && userId) {
          router.replace(`/dashboard/${userId}`);
        }
      }
    }
  }, [router, pathname]);

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
