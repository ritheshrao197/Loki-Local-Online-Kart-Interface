
'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  MessageSquare,
  LogOut,
  Store,
  Wallet,
  Settings,
  Newspaper,
} from 'lucide-react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { getSellerById } from '@/lib/firebase/firestore';
import { useEffect, useState } from 'react';
import type { Seller } from '@/lib/types';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Logo from '@/components/common/logo';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  const isMobile = useIsMobile();
  
  const sellerId = params.sellerId as string;
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) {
      setLoading(true);
      getSellerById(sellerId)
        .then(fetchedSeller => {
          if (!fetchedSeller) {
            notFound();
          } else {
            setSeller(fetchedSeller);
          }
        })
        .catch(err => {
            console.error(err);
            notFound();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sellerId]);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      router.push('/login/admin');
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  if (loading || isMobile === undefined) {
    return <DashboardSkeleton />;
  }

  if (isMobile) {
    return (
      <>
        <MobileNav />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
          {/* Add padding to the bottom to avoid content being hidden by the mobile nav */}
          <div className="h-16" />
        </main>
      </>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-headline text-lg font-semibold">
              <Logo className="h-7" />
            </Link>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href={`/dashboard/${sellerId}`}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Products">
                <Link href={`/dashboard/${sellerId}/products`}>
                  <Package />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Stories">
                <Link href={`/dashboard/${sellerId}/blogs`}>
                  <Newspaper />
                  <span>Stories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Orders">
                <Link href={`/dashboard/${sellerId}/orders`}>
                  <ListOrdered />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Payments" disabled>
                    <Wallet />
                    <span>Payments</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Chat" disabled>
                <MessageSquare />
                <span>Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" disabled>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem className="flex justify-between items-center">
              <ThemeToggle />
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Avatar className="size-7">
                  <AvatarImage src={`https://picsum.photos/seed/${sellerId}/100/100`} />
                  <AvatarFallback>{seller?.name.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                <span className="truncate">{seller?.name || 'Seller'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}


function DashboardSkeleton() {
  return (
     <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
             <Store className="size-6 text-primary" />
             <Skeleton className="h-6 w-20" />
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {Array.from({length: 6}).map((_, i) => <SidebarMenuSkeleton key={i} showIcon />)}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuSkeleton showIcon/>
            <SidebarMenuSkeleton showIcon/>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-8 w-1/4 mb-6" />
            <Skeleton className="h-64 w-full" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
