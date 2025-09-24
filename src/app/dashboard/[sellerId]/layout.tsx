
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
  Store,
  Wallet,
  Settings,
  Newspaper,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getSellerById } from '@/lib/firebase/firestore';
import { useEffect, useState } from 'react';
import type { Seller } from '@/lib/types';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  const sellerId = params.sellerId as string;
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    if (sellerId) {
      getSellerById(sellerId).then(setSeller);
    }
  }, [sellerId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login/admin');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-headline text-lg font-semibold">
              <Store className="size-6 text-primary" />
              <span>Loki</span>
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
              <SidebarMenuButton asChild tooltip="Blogs">
                <Link href={`/dashboard/${sellerId}/blogs`}>
                  <Newspaper />
                  <span>Blogs</span>
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
             <SidebarMenuItem>
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
