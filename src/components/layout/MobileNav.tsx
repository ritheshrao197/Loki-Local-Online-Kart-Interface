
'use client';
import { useState, useEffect } from 'react';
import { Home, Newspaper, Search, ShoppingCart, User, LayoutDashboard, Compass } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../ui/sheet';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { mockSellers } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import Logo from '../common/logo';
import { Trash2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { placeholderImages } from '@/lib/placeholder-images';

type UserRole = 'admin' | 'seller' | 'buyer' | null;

const cartItems = [
    { 
        ...placeholderImages.find(p => p.id === 'prod_101'), 
        quantity: 1, 
        price: 499,
        images: [{ url: placeholderImages.find(p => p.id === 'prod_101')?.url!, hint: placeholderImages.find(p => p.id === 'prod_101')?.hint! }],
        seller: { name: mockSellers.find(s => s.id === 'seller_101')!.name } 
    },
    { 
        ...placeholderImages.find(p => p.id === 'prod_115'), 
        quantity: 1, 
        price: 399,
        images: [{ url: placeholderImages.find(p => p.id === 'prod_115')?.url!, hint: placeholderImages.find(p => p.id === 'prod_115')?.hint! }],
        seller: { name: mockSellers.find(s => s.id === 'seller_103')!.name } 
    },
];
  
const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shipping = 50;
const total = subtotal + shipping;

export function MobileNav() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const getProfileLink = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'seller' && userId) return `/dashboard/${userId}`;
    return '/profile';
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/blogs', label: 'Stories', icon: Newspaper },
    { href: getProfileLink(), label: 'Profile', icon: (userRole === 'admin' || userRole === 'seller') ? LayoutDashboard : User },
    { href: '#', label: 'Cart', icon: ShoppingCart, isAction: true, isCart: true },
  ];

  const handleActionClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.isAction) {
        e.preventDefault();
    }
    if (item.isCart) {
      setIsCartOpen(true);
    } else if (item.label === 'Search') {
      toast({
        title: `${item.label} feature is coming soon!`,
      });
    }
  }


  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
           <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
              </Button>
              <ThemeToggle />
            </div>
        </div>
      </header>

      <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="grid h-16 grid-cols-5 items-center text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors relative',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={(e) => handleActionClick(e, item)}
              >
                {item.isCart && cartItems.length > 0 && (
                   <Badge variant="destructive" className="absolute -right-2 top-0 h-4 w-4 justify-center p-0 text-[10px] sm:right-0 md:right-1">
                        {cartItems.length}
                    </Badge>
                )}
                <item.icon className="h-5 w-5" />
                <span>{item.label === 'Profile' && (userRole === 'admin' || userRole === 'seller') ? 'Dashboard' : item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
          <SheetHeader className="px-6">
            <SheetTitle>Shopping Cart ({cartItems.length})</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <Image
                      src={item.images[0].url}
                      alt={item.name!}
                      width={80}
                      height={80}
                      className="rounded-md object-cover aspect-square"
                      data-ai-hint={item.images[0].hint}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">Sold by {item.seller.name}</p>
                      <p className="text-md font-bold mt-1">&#8377;{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <Input
                        type="number"
                        min="1"
                        defaultValue={item.quantity}
                        className="w-16 h-8"
                      />
                      <Button variant="ghost" size="sm" className="text-muted-foreground font-normal text-xs">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <SheetFooter className="bg-secondary p-6 space-y-4">
             <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">&#8377;{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="font-medium">&#8377;{shipping.toLocaleString('en-IN')}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>&#8377;{total.toLocaleString('en-IN')}</span>
            </div>
            <Button size="lg" className="w-full as-child">
              <Link href="/cart">Proceed to Checkout</Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
