'use client';

import { useState, useEffect } from 'react';
import { ProductModerationCard } from "@/components/admin/ProductModerationCard";
import type { Product } from '@/lib/types';
import { getProducts, updateProductStatus } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const pendingProducts = await getProducts('pending');
      setProducts(pendingProducts);
    } catch (error) {
      console.error("Error fetching pending products:", error);
      toast({
        title: "Error",
        description: "Could not fetch pending products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductUpdate = async (productId: string, newStatus: 'approved' | 'rejected') => {
    const originalProducts = [...products];
    // Immediately update UI for better user experience
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
      // Revert UI change if update fails
      setProducts(originalProducts);
    }
  };
  
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Product Moderation</h1>
            <p className="text-muted-foreground">Review and approve products submitted by sellers.</p>
        </div>

        <div className="space-y-6">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : products.length > 0 ? (
                products.map(product => (
                    <ProductModerationCard 
                        key={product.id} 
                        product={product} 
                        onStatusChange={handleProductUpdate}
                    />
                ))
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">All Clear!</h3>
                    <p className="text-muted-foreground mt-1">There are no pending products to review.</p>
                </div>
            )}
        </div>
    </div>
  )
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);
