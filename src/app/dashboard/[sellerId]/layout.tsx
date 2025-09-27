
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
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  MessageSquare,
  LogOut,
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
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Logo from '@/components/common/logo';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
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

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-4 sm:p-6">{children}</main>
            <div className="h-16" /> {/* Spacer for the bottom nav */}
            <MobileNav />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
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
                    <SidebarMenuButton asChild>
                    <Link href="/profile">
                        <Avatar className="size-7">
                        <AvatarImage src={`https://picsum.photos/seed/${sellerId}/100/100`} />
                        <AvatarFallback>{seller?.name.charAt(0) || 'S'}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{seller?.name || 'Seller'}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            </Sidebar>
            <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
