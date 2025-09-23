'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Check, X, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Seller } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSellers, addSeller, updateSellerStatus } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  suspended: 'destructive',
} as const;

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  async function fetchSellers() {
    setLoading(true);
    try {
      const fetchedSellers = await getSellers();
      // Sort sellers: pending first, then by name
      fetchedSellers.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return a.name.localeCompare(b.name);
      });
      setSellers(fetchedSellers);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch sellers.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSellers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newSellerName = searchParams.get('newSellerName');
    if (newSellerName) {
      // Refetch sellers list when a new seller is added.
      // The new seller is identified by the query param.
      fetchSellers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSellerStatusChange = async (sellerId: string, newStatus: Seller['status']) => {
    try {
      await updateSellerStatus(sellerId, newStatus);
      setSellers(prevSellers =>
        prevSellers.map(seller =>
          seller.id === sellerId ? { ...seller, status: newStatus } : seller
        )
      );
      toast({
        title: 'Status Updated',
        description: `Seller has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating seller status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update seller status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Seller Management</h1>
        <Button asChild>
          <Link href="/admin/sellers/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Seller
          </Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Mobile</TableHead>
              <TableHead className="hidden md:table-cell">PAN</TableHead>
              <TableHead className="hidden md:table-cell">Commission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : (
              sellers.map(seller => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[seller.status]}>
                      {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{seller.mobile}</TableCell>
                  <TableCell className="hidden md:table-cell">{seller.pan}</TableCell>
                  <TableCell className="hidden md:table-cell">{seller.commissionRate ?? 'N/A'}%</TableCell>
                  <TableCell>
                    {seller.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleSellerStatusChange(seller.id, 'approved')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleSellerStatusChange(seller.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/sellers/${seller.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSellerStatusChange(seller.id, 'suspended')}
                            className="text-destructive"
                            disabled={seller.status === 'suspended'}
                          >
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
