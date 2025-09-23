
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, ListOrdered, Package, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getOrdersBySeller, getProductsBySeller } from '@/lib/firebase/firestore';
import type { Order, Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  dispatched: 'outline',
  delivered: 'destructive',
} as const;

type DashboardStats = {
  totalRevenue: number;
  newOrders: number;
  activeProducts: number;
  uniqueCustomers: number;
};

export default function DashboardPage() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const sellerId = 'seller_1'; // Hardcoded for now
        const [orders, products] = await Promise.all([
          getOrdersBySeller(sellerId),
          getProductsBySeller(sellerId),
        ]);

        // Sort orders to get the most recent ones
        orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        setRecentOrders(orders.slice(0, 5));

        const totalRevenue = orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.total, 0);

        const newOrders = orders.filter(o => o.status === 'pending').length;

        const activeProducts = products.filter(p => p.status === 'approved').length;

        const uniqueCustomers = new Set(orders.map(o => o.buyer.id)).size;

        setStats({
          totalRevenue,
          newOrders,
          activeProducts,
          uniqueCustomers,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-32" /> : (
              <div className="text-2xl font-bold">₹{stats?.totalRevenue.toLocaleString('en-IN') ?? '0'}</div>
            )}
             <p className="text-xs text-muted-foreground">
              Based on delivered orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">+{stats?.newOrders ?? '0'}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Currently pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-2xl font-bold">{stats?.activeProducts ?? '0'}</div>
             )}
            <p className="text-xs text-muted-foreground">
              Approved and live
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">+{stats?.uniqueCustomers ?? '0'}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Across all orders
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>A list of your 5 most recent orders.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                      <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                      <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                      <TableCell><Skeleton className="h-5 w-16"/></TableCell>
                    </TableRow>
                  )) : recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.buyer.name}</TableCell>
                      <TableCell>{order.product.name}</TableCell>
                      <TableCell>
                         <Badge variant={statusVariant[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{order.total.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
