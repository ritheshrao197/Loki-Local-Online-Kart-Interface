
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Search, ShoppingCart, User, Store, Heart, Tag, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from './MobileNav';
import { Badge } from '../ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type UserRole = 'admin' | 'seller' | 'buyer' | null;

export const Header = React.memo(function Header() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
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

  if (!isMounted) {
    return <div className="h-16 border-b" />;
  }

  const renderActionButtons = () => {
    return (
      <>
        {/* Admin buttons - conditionally visible */}
        <Button 
          asChild 
          variant="ghost" 
          className="rounded-full px-4"
          style={{ display: userRole === 'admin' ? 'flex' : 'none' }}
        >
          <Link href="/admin">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
          </Link>
        </Button>
        
        {/* Seller buttons - conditionally visible */}
        <Button 
          asChild 
          variant="ghost" 
          className="rounded-full px-4"
          style={{ display: userRole === 'seller' && userId ? 'flex' : 'none' }}
        >
          <Link href={userId ? `/dashboard/${userId}` : '#'}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
          </Link>
        </Button>
        
        {/* Default buttons for buyers or guests - conditionally visible */}
             <Button
               variant="ghost"
               asChild
               className="rounded-full px-4 text-gray-700 hover:text-orange-500"
               style={{ display: !userRole || userRole === 'buyer' ? 'flex' : 'none' }}
             >
               <Link href="/categories/tech">Tech</Link>
             </Button>

             <Button
               variant="ghost"
               asChild
               className="rounded-full px-4 text-gray-700 hover:text-orange-500"
               style={{ display: !userRole || userRole === 'buyer' ? 'flex' : 'none' }}
             >
               <Link href="/categories/bags">Bags & Wallets</Link>
             </Button>

             <Button
               variant="ghost"
               asChild
               className="rounded-full px-4 text-gray-700 hover:text-orange-500"
               style={{ display: !userRole || userRole === 'buyer' ? 'flex' : 'none' }}
             >
               <Link href="/categories/work">Work Essentials</Link>
             </Button>

             <Button
               variant="ghost"
               asChild
               className="rounded-full px-4 text-gray-700 hover:text-orange-500"
               style={{ display: !userRole || userRole === 'buyer' ? 'flex' : 'none' }}
             >
               <Link href="/categories/gifting">Gifting</Link>
             </Button>

             <Button
               variant="ghost"
               asChild
               className="rounded-full px-4 text-gray-700 hover:text-orange-500"
               style={{ display: !userRole || userRole === 'buyer' ? 'flex' : 'none' }}
             >
               <Link href="/categories/collections">Collections</Link>
             </Button>
        
        <div 
          className="flex items-center space-x-1"
          style={{ display: !userRole || userRole === 'buyer' ? 'flex' : 'none' }}
        >
          <div style={{ display: 'flex' }}>
            <ThemeToggle />
          </div>
               <Button variant="ghost" size="icon" asChild className="rounded-full relative text-gray-700 hover:text-orange-500">
                 <Link href="/wishlist">
                   <Heart className="h-5 w-5" />
                   <span className="sr-only">Wishlist</span>
                 </Link>
               </Button>
               <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-700 hover:text-orange-500">
                 <Link href="/profile">
                   <User className="h-5 w-5" />
                   <span className="sr-only">Profile</span>
                 </Link>
               </Button>
               <Button variant="ghost" size="icon" asChild className="rounded-full relative text-gray-700 hover:text-orange-500">
                 <Link href="/cart">
                   {isMounted && cartItemCount > 0 && (
                     <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs bg-orange-500 text-white border-0">
                       {cartItemCount}
                     </Badge>
                   )}
                   <ShoppingCart className="h-5 w-5" />
                   <span className="sr-only">Cart</span>
                 </Link>
               </Button>
        </div>
        
        {/* Always render ThemeToggle for all user roles but control visibility */}
        <div style={{ display: userRole && userRole !== 'buyer' ? 'flex' : 'none' }}>
          <ThemeToggle />
        </div>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Logo className="h-8 w-auto" />
            </motion.div>
            <span className="hidden sm:inline-block font-bold text-gray-900 text-xl">
              LocalKart
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center px-8 max-w-2xl">
            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="search"
                    placeholder="Search for local products..."
                    className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                />
            </div>
        </div>
        
        <nav className="flex items-center space-x-1">
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
           >
             {renderActionButtons()}
           </motion.div>
        </nav>
      </div>
    </header>
  );
});
