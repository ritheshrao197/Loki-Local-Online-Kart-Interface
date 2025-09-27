
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
    const role = sessionStorage.getItem('userRole') as UserRole;
    setUserRole(role);
    setIsMounted(true);
  }, [pathname]);

  if (!isMounted) {
    return <Loader />;
  }

  if (userRole === 'admin') {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  }

  if (userRole === 'seller') {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
  }

  return <MainLayoutClient>{children}</MainLayoutClient>;
}
