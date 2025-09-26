
'use client';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { Promotions } from '@/components/home/Promotions';
import { PopularProducts } from '@/components/home/PopularProducts';
import { BannerAds } from '@/components/home/BannerAds';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const RecentlyViewedProducts = dynamic(() => import('@/components/home/RecentlyViewedProducts').then(mod => mod.RecentlyViewedProducts), {
  ssr: false,
  loading: () => <RecentlyViewedSkeleton />
});

const ProductGrid = dynamic(() => import('@/components/products/ProductGrid').then(mod => mod.ProductGrid), {
  loading: () => <ProductGridSkeleton />,
  ssr: false,
});


export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-12">
        <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full" />
        <div className="container space-y-4 py-12">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
          </div>
        </div>
        <div className="container space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroSlider />
      <div className="container py-12 space-y-20">
        <section className="text-center">
          <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl text-gradient">
            Discover Local Treasures
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore unique, handcrafted products from local artisans and manufacturers near you.
          </p>
        </section>

        <section>
          <BannerAds placement="homepage_top" />
        </section>

        <section>
          <FeaturedCategories />
        </section>

        <section>
          <Promotions />
        </section>

        <section>
          <RecentlyViewedProducts />
        </section>
        
        <section>
          <PopularProducts />
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline mb-6 text-gradient">All Products</h2>
          <ProductGrid />
        </section>
      </div>
    </div>
  );
}


const ProductGridSkeleton = () => (
    <div className="space-y-8">
    <div className="flex gap-4">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 flex-1" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
    </div>
   </div>
)

const RecentlyViewedSkeleton = () => (
  <div>
    <h2 className="text-2xl font-bold font-headline mb-6 text-gradient">Recently Viewed</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({length: 4}).map((_, i) => (
         <div key={i} className="space-y-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
         </div>
      ))}
    </div>
  </div>
)
