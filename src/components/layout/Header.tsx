
'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from './MobileNav';
import { Badge } from '../ui/badge';

export function Header() {
  const isMobile = useIsMobile();
  const cartItemCount = 2; // Mock count

  if (isMobile === undefined) {
    return <div className="h-16 border-b" />; // Prevent layout shift
  }

  return isMobile ? (
    <MobileNav />
  ) : (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
        </Link>
        
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for local products..."
              className="w-full max-w-sm rounded-full pl-10"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto flex items-center space-x-2">
           <Button variant="ghost" asChild>
              <Link href="/blogs">Blogs</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login/admin">Sell on Loki</Link>
          </Button>

          <div className="flex items-center space-x-1 pl-4">
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
        </nav>
      </div>
    </header>
  );
}
