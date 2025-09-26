
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Seller } from '@/lib/types';
import Link from 'next/link';
import { updateSellerStatus } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  suspended: 'destructive',
} as const;

interface SellerManagementClientProps {
  initialSellers: Seller[];
}

export function SellerManagementClient({ initialSellers }: SellerManagementClientProps) {
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setSellers(initialSellers);
  }, [initialSellers]);

  const handleSellerStatusChange = async (sellerId: string, newStatus: Seller['status']) => {
    try {
      await updateSellerStatus(sellerId, newStatus);
      
      const updatedSellers = sellers.map(seller =>
        seller.id === sellerId ? { ...seller, status: newStatus } : seller
      );
      updatedSellers.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return a.name.localeCompare(b.name);
      });
      setSellers(updatedSellers);

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
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seller Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Mobile</TableHead>
            <TableHead className="hidden lg:table-cell">PAN</TableHead>
            <TableHead className="hidden lg:table-cell">Commission</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.length === 0 ? (
              <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                      No sellers found. <Link href="/admin/sellers/new" className="text-primary underline">Add the first seller</Link>.
                  </TableCell>
              </TableRow>
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
                <TableCell className="hidden lg:table-cell">{seller.pan}</TableCell>
                <TableCell className="hidden lg:table-cell">{seller.commissionRate ?? '15'}%</TableCell>
                <TableCell>
                  {seller.status === 'pending' ? (
                    <div className="flex flex-col sm:flex-row gap-2">
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
  );
}
