
'use client';

import { useState, useEffect } from 'react';
import { ProductModerationCard } from "@/components/admin/ProductModerationCard";
import type { Product } from '@/lib/types';
import { getProducts, updateProductStatus, deleteProduct } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

type ProductStatus = 'pending' | 'approved' | 'rejected';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<ProductStatus>('pending');
  const { toast } = useToast();

  const fetchProductsByStatus = async (status: ProductStatus) => {
    setLoading(true);
    try {
      const fetchedProducts = await getProducts(status);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error(`Error fetching ${status} products:`, error);
      toast({
        title: "Error",
        description: `Could not fetch ${status} products.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByStatus(currentTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

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
    if (loading) {
      return Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />);
    }
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
    <div className="md:col-span-2 lg:col-span-3">
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Product Moderation</h1>
            <p className="text-muted-foreground">Review and manage products submitted by sellers.</p>
        </div>

        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as ProductStatus)}>
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-6 space-y-6">
            {renderProductList()}
          </TabsContent>
          <TabsContent value="approved" className="mt-6 space-y-6">
            {renderProductList()}
          </TabsContent>
          <TabsContent value="rejected" className="mt-6 space-y-6">
            {renderProductList()}
          </TabsContent>
        </Tabs>
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
