
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
  Users,
  LogOut,
  Landmark,
  BarChart3,
  Gavel,
  LayoutTemplate,
  Newspaper,
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Logo from '@/components/common/logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminDashboardSkeleton() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-headline text-lg font-semibold">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-6 w-20" />
            </Link>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {Array.from({length: 8}).map((_, i) => <SidebarMenuSkeleton key={i} showIcon />)}
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      await signOut(auth);
      router.push('/login/admin');
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  if (!isClient) {
    return <AdminDashboardSkeleton />;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <div className="h-16" /> {/* Spacer for the bottom nav */}
        <MobileNav />
      </div>
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
              <SidebarMenuButton asChild tooltip="Overview">
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Products">
                <Link href="/admin/products">
                  <Package />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Stories">
                <Link href="/admin/blogs">
                  <Newspaper />
                  <span>Stories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sellers">
                <Link href="/admin/sellers">
                  <Users />
                  <span>Sellers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Commissions">
                <Link href="/admin/commissions">
                  <Landmark />
                  <span>Commissions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Content">
                <Link href="/admin/content">
                  <LayoutTemplate />
                  <span>Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Reports">
                <Link href="/admin/reports">
                  <BarChart3 />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Disputes">
                <Link href="/admin/disputes">
                  <Gavel />
                  <span>Disputes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
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
                    <AvatarImage src="https://picsum.photos/seed/avatarAdmin/100/100" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="truncate">Admin User</span>
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
  );
}
