
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Search, ShoppingCart, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from './MobileNav';
import { Badge } from '../ui/badge';
import { ThemeToggle } from './ThemeToggle';

type UserRole = 'admin' | 'seller' | 'buyer' | null;

export function Header() {
  const isMobile = useIsMobile();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole') as UserRole;
      const id = sessionStorage.getItem('userId');
      setUserRole(role);
      setUserId(id);
    }
  }, []);

  const cartItemCount = 2; // Mock count

  if (isMobile === undefined) {
    return <div className="h-16 border-b" />; // Prevent layout shift
  }

  if (isMobile) {
    return <MobileNav />;
  }

  const renderActionButtons = () => {
    if (userRole === 'admin') {
      return (
        <>
          <Button asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2" /> Admin Dashboard
            </Link>
          </Button>
          <ThemeToggle />
        </>
      );
    }
    if (userRole === 'seller' && userId) {
      return (
        <>
          <Button asChild>
            <Link href={`/dashboard/${userId}`}>
              <LayoutDashboard className="mr-2" /> Seller Dashboard
            </Link>
          </Button>
          <ThemeToggle />
        </>
      );
    }
    // Default for buyers or guests
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/blogs">Stories</Link>
        </Button>
         <Button variant="ghost" asChild>
          <Link href="/discover">Discover</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/login/admin">Sell on Loki</Link>
        </Button>
        <div className="flex items-center space-x-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-[10px]">
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
        </Link>
        
        {/* Search Bar (Centered) */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for local products..."
              className="w-full rounded-full pl-10"
            />
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <nav className="flex items-center space-x-4">
           {renderActionButtons()}
        </nav>
      </div>
    </header>
  );
}
