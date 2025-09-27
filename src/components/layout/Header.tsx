
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/logo';
import { Badge } from '../ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { usePathname, useRouter } from 'next/navigation';

type UserRole = 'admin' | 'seller' | 'buyer' | null;

export const Header = React.memo(function Header() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    setIsMounted(true);
    const role = sessionStorage.getItem('userRole') as UserRole;
    const id = sessionStorage.getItem('userId');
    setUserRole(role);
    setUserId(id);

    // Prefetch important pages for buyers/guests
    if (!role || role === 'buyer') {
        router.prefetch('/blogs');
        router.prefetch('/discover');
    }
  }, [router]);

  const cartItemCount = 2; // Mock count
  const isDashboard = pathname.startsWith('/dashboard');

  if (!isMounted) {
    return <div className="h-16 border-b" />;
  }

  const renderActionButtons = () => {
    if (userRole === 'admin') {
      return (
        <>
          <Button asChild variant="ghost" className="rounded-full px-4">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Admin Profile</span>
            </Link>
          </Button>
          <ThemeToggle />
        </>
      );
    }

    if (userRole === 'seller' && userId) {
      return (
        <>
          <Button asChild variant="ghost" className="rounded-full px-4">
            <Link href={`/dashboard/${userId}`}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
            </Link>
          </Button>
           <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={`/dashboard/${userId}/profile`}>
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <ThemeToggle />
        </>
      );
    }
    
    // Buyer or guest view
    return (
      <>
        <Button variant="ghost" asChild className="rounded-full px-4">
          <Link href="/blogs">Stories</Link>
        </Button>
        <Button variant="ghost" asChild className="rounded-full px-4">
          <Link href="/discover">Discover</Link>
        </Button>
        <Button variant="ghost" asChild className="rounded-full px-4">
          <Link href="/login/admin">Sell on Loki</Link>
        </Button>
        <div className="flex items-center space-x-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full relative">
            <Link href="/cart">
              {cartItemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs bg-primary text-primary-foreground border-0">
                  {cartItemCount}
                </Badge>
              )}
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center px-8 max-w-2xl">
            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for local products..."
                    className="w-full rounded-full pl-12 pr-4 py-3 text-sm shadow-depth-1 focus:shadow-depth-2 transition-shadow"
                />
            </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
           {renderActionButtons()}
        </nav>
      </div>
    </header>
  );
});
