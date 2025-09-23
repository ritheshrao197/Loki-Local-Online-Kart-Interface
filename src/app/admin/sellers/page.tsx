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
import { MoreHorizontal, Check, X } from 'lucide-react';
import { mockSellers } from '@/lib/placeholder-data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Seller } from '@/lib/types';
import Link from 'next/link';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
} as const;

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>(mockSellers);

  const handleSellerStatusChange = (sellerId: string, newStatus: 'approved' | 'rejected') => {
    setSellers(prevSellers =>
      prevSellers.map(seller =>
        seller.id === sellerId ? { ...seller, status: newStatus } : seller
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Seller Management</h1>
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
            {sellers.map((seller) => (
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
                        <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleSellerStatusChange(seller.id, 'approved')}>
                            <Check className="h-4 w-4 mr-1"/> Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleSellerStatusChange(seller.id, 'rejected')}>
                            <X className="h-4 w-4 mr-1"/> Reject
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
                        <DropdownMenuItem>Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
