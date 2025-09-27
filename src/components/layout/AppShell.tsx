
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Loader } from '../common/Loader';
import { MainLayoutClient } from './MainLayoutClient';
import { AdminLayoutClient } from './AdminLayoutClient';
import { DashboardLayoutClient } from './DashboardLayoutClient';

type UserRole = 'admin' | 'seller' | 'buyer' | null;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    const role = sessionStorage.getItem('userRole') as UserRole;
    setUserRole(role);
    setIsMounted(true);
  }, [pathname]); // Re-check on path change

  if (!isMounted) {
    // On the server and during initial client render, show a loader.
    // This ensures the initial render matches on both sides.
    return <Loader />;
  }

  // After mounting, render the correct layout based on the user role.
  if (userRole === 'admin') {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  }

  if (userRole === 'seller') {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
  }

  // Default to the main/buyer layout.
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
