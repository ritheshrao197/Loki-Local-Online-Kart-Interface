
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getSellers } from '@/lib/firebase/firestore';
import { SellerManagementClient } from '@/components/admin/SellerManagementClient';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

async function SellerList() {
    const sellers = await getSellers();
    sellers.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return a.name.localeCompare(b.name);
    });
    return <SellerManagementClient initialSellers={sellers} />;
}

const SellerListSkeleton = () => (
    <div className="border rounded-lg overflow-x-auto">
        <Table>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
)


export default function SellersPage() {
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
            <Suspense fallback={<SellerListSkeleton />}>
                <SellerList />
            </Suspense>
        </div>
    );
}
