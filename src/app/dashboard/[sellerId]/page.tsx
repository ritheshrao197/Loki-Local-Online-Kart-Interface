

'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
import { getOrdersBySeller, getProductsBySeller } from '@/lib/firebase/firestore';
import type { Order, Product } from '@/lib/types';
import { Loader } from '@/components/common/Loader';

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  shipped: 'outline',
  delivered: 'destructive',
} as const;

export default function DashboardPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    async function fetchData() {
      try {
        const [sellerOrders, sellerProducts] = await Promise.all([
          getOrdersBySeller(sellerId),
          getProductsBySeller(sellerId),
        ]);
        
        sellerOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        setOrders(sellerOrders);
        setProducts(sellerProducts);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sellerId]);

  const recentOrders = orders.slice(0, 5);

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const newOrdersCount = orders.filter(o => o.status === 'pending').length;
  const activeProductsCount = products.filter(p => p.status === 'approved').length;
  const uniqueCustomersCount = new Set(orders.map(o => o.buyer.id)).size;

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6 text-gradient">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
             <p className="text-xs text-muted-foreground">
              Based on delivered orders
            </p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">+{newOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently pending
            </p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{activeProductsCount}</div>
            <p className="text-xs text-muted-foreground">
              Approved and live
            </p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{uniqueCustomersCount}</div>
            <p className="text-xs text-muted-foreground">
              Across all orders
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card className="card-modern">
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
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
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
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No recent orders.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
