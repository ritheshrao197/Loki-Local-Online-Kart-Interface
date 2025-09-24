
'use client';
import { useState, useEffect } from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { Promotions } from '@/components/home/Promotions';
import { PopularProducts } from '@/components/home/PopularProducts';
import { getProducts } from '@/lib/firebase/firestore';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [approvedProducts, setApprovedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts('approved');
        setApprovedProducts(products);
      } catch (error) {
        console.error("Failed to fetch approved products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
       <div className="flex flex-col">
        <Skeleton className="h-[600px] w-full" />
        <div className="container py-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="aspect-square w-full" />
            </div>
             <div className="mt-12">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <HeroSlider />
      <div className="container py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
            Discover Local Treasures
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore unique, handcrafted products from local artisans and manufacturers near you.
          </p>
        </section>

        <FeaturedCategories products={approvedProducts} />

        <div className="mt-12">
          <Promotions products={approvedProducts} />
        </div>
        
        {approvedProducts.length > 0 && (
          <div className="mt-12">
              <PopularProducts products={approvedProducts.slice(0,8)} />
          </div>
        )}

        <div className="mt-20">
          <h2 className="text-2xl font-bold font-headline mb-6">All Products</h2>
          <ProductGrid products={approvedProducts} />
        </div>
      </div>
    </div>
  );
}
