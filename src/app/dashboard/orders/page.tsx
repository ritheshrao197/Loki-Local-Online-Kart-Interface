
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getOrdersBySeller, updateOrderStatus } from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { format } from 'date-fns';

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  dispatched: 'outline',
  delivered: 'destructive', // Using destructive for visual difference. Should be a success color.
} as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        // We'll use a hardcoded seller ID for now.
        // In a real app, you'd get this from the logged-in user's session.
        const sellerOrders = await getOrdersBySeller('seller_2');
        sellerOrders.sort((a, b) => b.orderDate.toMillis() - a.orderDate.toMillis());
        setOrders(sellerOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Could not fetch orders.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [toast]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const originalOrders = [...orders];
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: 'Order Status Updated',
        description: `Order ${orderId.substring(0,6)}... is now ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: 'Update Failed',
        description: 'Could not update order status.',
        variant: 'destructive',
      });
      setOrders(originalOrders);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Orders</h1>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        You have no orders yet.
                    </TableCell>
                </TableRow>
            ) : (
              orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.substring(0,10)}...</TableCell>
                <TableCell>{order.buyer.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      alt={order.product.name}
                      className="aspect-square rounded-md object-cover"
                      height="40"
                      src={order.product.images[0].url}
                      width="40"
                      data-ai-hint={order.product.images[0].hint}
                    />
                    <span className="font-medium truncate max-w-xs">{order.product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">₹{order.total.toLocaleString('en-IN')}</TableCell>
                <TableCell className="hidden md:table-cell">{format(order.orderDate.toDate(), 'PPP')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'confirmed')}>Confirmed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'dispatched')}>Dispatched</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>Delivered</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
