
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Users, AlertTriangle } from 'lucide-react';
import { getProducts } from '@/lib/firebase/firestore';
import { getSellers } from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from '@/components/common/Loader';

export default function AdminDashboardPage() {
  const [pendingProductsCount, setPendingProductsCount] = useState(0);
  const [pendingSellersCount, setPendingSellersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pendingProducts, allSellers] = await Promise.all([
          getProducts('pending'),
          getSellers(),
        ]);
        setPendingProductsCount(pendingProducts.length);
        setPendingSellersCount(allSellers.filter(s => s.status === 'pending').length);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProductsCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review and approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSellersCount}</div>
            <p className="text-xs text-muted-foreground">
              New sellers to be onboarded
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Flagged Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Products flagged by AI for review
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
            <CardDescription>Items that require your immediate attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                    <h3 className="font-semibold">New Product Listings</h3>
                    <p className="text-sm text-muted-foreground">Review and approve new products from sellers.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products">Review Products</Link>
                </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                    <h3 className="font-semibold">New Seller Applications</h3>
                    <p className="text-sm text-muted-foreground">Onboard new manufacturers to the platform.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/sellers">Review Sellers</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
