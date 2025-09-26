
'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { updateProductStatus, deleteProduct } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductModerationCard } from '@/components/admin/ProductModerationCard';
import { Skeleton } from '@/components/ui/skeleton';

type ProductStatus = 'pending' | 'approved' | 'rejected';

interface ProductModerationClientProps {
  initialProducts: Product[];
  searchParams: { tab?: string };
}

const CardSkeleton = () => (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex gap-6">
        <Skeleton className="h-24 w-24 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );

export function ProductModerationClient({ initialProducts, searchParams }: ProductModerationClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentTab = (searchParams?.tab || 'pending') as ProductStatus;

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', value);
    startTransition(() => {
      router.replace(`/admin/products?${params.toString()}`);
    });
  };

  const handleProductUpdate = async (productId: string, newStatus: 'approved' | 'rejected') => {
    const originalProducts = [...products];
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));

    try {
      await updateProductStatus(productId, newStatus);
      toast({
        title: `Product ${newStatus}`,
        description: `The product has been successfully ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: 'Update Failed',
        description: 'Could not update the product status. Please try again.',
        variant: 'destructive',
      });
      setProducts(originalProducts);
    }
  };
  
  const handleProductDelete = async (productId: string) => {
    const originalProducts = [...products];
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));

    try {
      await deleteProduct(productId);
      toast({
        title: 'Product Deleted',
        description: 'The product has been permanently removed.',
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: 'Delete Failed',
        description: 'Could not delete the product. Please try again.',
        variant: 'destructive',
      });
      setProducts(originalProducts);
    }
  };
  
  const renderProductList = () => {
    if (products.length > 0) {
      return products.map(product => (
        <ProductModerationCard 
          key={product.id} 
          product={product} 
          onStatusChange={handleProductUpdate}
          onDelete={handleProductDelete}
        />
      ));
    }
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-semibold">All Clear!</h3>
        <p className="text-muted-foreground mt-1">There are no {currentTab} products to review.</p>
      </div>
    );
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
      <TabsContent value={currentTab} className="mt-6 space-y-6" forceMount>
         <Suspense fallback={<CardSkeleton />}>
          {isPending ? <CardSkeleton /> : renderProductList()}
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
