
'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from './MobileNav';

export function Header() {
  const isMobile = useIsMobile();

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
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for local products..."
              className="w-full rounded-full pl-10"
            />
          </div>
        </div>
        <nav className="ml-6 flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild>
              <Link href="/blogs">Blogs</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login/admin">Sell on Loki</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
