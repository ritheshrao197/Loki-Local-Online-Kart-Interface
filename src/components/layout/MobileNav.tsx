
'use client';
import { useState, useEffect } from 'react';
import { Home, Newspaper, Search, ShoppingCart, User, LayoutDashboard, Compass, Package, ListOrdered, Settings, Wallet, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '../ui/sheet';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import Logo from '../common/logo';
import { Trash2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import type { Seller } from '@/lib/types';
import { getSellerById } from '@/lib/firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


type UserRole = 'admin' | 'seller' | 'buyer' | null;


export function MobileNav() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole') as UserRole;
      const id = sessionStorage.getItem('userId');
      setUserRole(role);
      setUserId(id);

      if (role === 'seller' && id) {
        getSellerById(id).then(setSeller);
      }
      
      setCartItems([
        { 
          id: 'prod_101', 
          name: 'Handwoven Cotton Scarf', 
          quantity: 1, 
          price: 499, 
          seller: { name: 'Artisan Fabrics Co.' }, 
          images: [{ url: 'https://images.unsplash.com/photo-1640747669771-b62a6e40f534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb2xvcmZ1bCUyMHRleHRpbGV8ZW58MHx8fHwxNzU4NjYwNTc5fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'cotton scarf' }]
        },
        { 
          id: 'prod_115', 
          name: 'Bamboo Toothbrush Set', 
          quantity: 1, 
          price: 399, 
          seller: { name: 'GreenEarth' }, 
          images: [{ url: 'https://images.unsplash.com/photo-1629828822437-003507d4b4e7?q=80&w=870&auto=format&fit=crop', hint: 'bamboo toothbrush' }]
        }
      ]);
    }
  }, []);

  const buyerNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/blogs', label: 'Stories', icon: Newspaper },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '#', label: 'Cart', icon: ShoppingCart, isAction: true, isCart: true },
  ];
  
  const sellerNavItems = [
    { href: `/dashboard/${userId}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/dashboard/${userId}/products`, label: 'Products', icon: Package },
    { href: `/dashboard/${userId}/blogs`, label: 'Stories', icon: Newspaper },
    { href: `/dashboard/${userId}/orders`, label: 'Orders', icon: ListOrdered },
    { href: `#`, label: 'Seller', icon: User, isAction: true, isProfile: true },
  ];
  
  const navItems = isDashboard ? sellerNavItems : buyerNavItems;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;
  const { toast } = useToast();

  const handleLogout = () => {
      // Dummy logout logic
      sessionStorage.clear();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      window.location.href = '/login/admin'; // Force reload
  };


  const handleActionClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if ('isAction' in item && item.isAction) {
        e.preventDefault();
    }
    if ('isCart' in item && item.isCart) {
      setIsCartOpen(true);
    }
    if ('isProfile' in item && item.isProfile) {
        setIsProfileOpen(true);
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
            const isActive = item.href === '/' ? pathname === item.href : (item.href !== '#' && pathname.startsWith(item.href));
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
                {'isCart' in item && item.isCart && cartItems.length > 0 && (
                   <Badge variant="destructive" className="absolute -right-2 top-0 h-4 w-4 justify-center p-0 text-[10px] sm:right-0 md:right-1">
                        {cartItems.length}
                    </Badge>
                )}
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Cart Sheet */}
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
                      alt={item.name}
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

      {/* Profile Sheet for Seller */}
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent side="bottom" className="flex w-full flex-col p-4 rounded-t-lg">
          <SheetHeader className="px-2 pb-2">
             <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://picsum.photos/seed/${userId}/100`} />
                  <AvatarFallback>{seller?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <SheetTitle>{seller?.name}</SheetTitle>
                    <SheetDescription>Manage your seller account</SheetDescription>
                </div>
             </div>
          </SheetHeader>
          <div className="flex-1 py-2 space-y-1">
             <Button asChild variant="ghost" className="w-full justify-start">
                 <Link href={`/sellers/${userId}`} onClick={() => setIsProfileOpen(false)}>
                    <User className="mr-2" />
                    View Public Profile
                </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                <Settings className="mr-2" />
                Settings
            </Button>
             <Separator />
             <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                <LayoutDashboard className="mr-2" />
                Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
