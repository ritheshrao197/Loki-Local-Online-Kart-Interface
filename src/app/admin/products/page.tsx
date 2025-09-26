
import { Suspense } from 'react';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { ProductModerationClient } from '@/components/admin/ProductModerationClient';
import { Skeleton } from '@/components/ui/skeleton';

type ProductStatus = 'pending' | 'approved' | 'rejected';

async function ProductList({ status }: { status: ProductStatus }) {
  const products = await getProducts(status);
  return <ProductModerationClient initialProducts={products} status={status} />;
}

const ProductListSkeleton = () => (
    <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
);

export default async function AdminProductsPage({ searchParams }: { searchParams: { tab: string } }) {
  const currentTab = (searchParams.tab || 'pending') as ProductStatus;

  return (
    <div className="md:col-span-2 lg:col-span-3">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline">Product Moderation</h1>
                <p className="text-muted-foreground">Review and manage products submitted by sellers.</p>
            </div>
            <Button asChild>
                <Link href="/admin/products/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                </Link>
            </Button>
        </div>
        <Suspense fallback={<ProductListSkeleton />}>
            <ProductList status={currentTab} />
        </Suspense>
    </div>
  )
}

const CardSkeleton = () => (
  <Card className="p-6">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
      <div className="md:w-2/3 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
    <div className="flex justify-end gap-2 mt-6">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
    </div>
  </Card>
);
