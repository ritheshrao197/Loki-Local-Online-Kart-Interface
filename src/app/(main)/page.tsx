
'use client';
import { HeroSlider } from '@/components/home/HeroSlider';
import { useEffect, useState, Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const FeaturedCategories = lazy(() => import('@/components/home/FeaturedCategories').then(mod => ({ default: mod.FeaturedCategories })));
const Promotions = lazy(() => import('@/components/home/Promotions').then(mod => ({ default: mod.Promotions })));
const PopularProducts = lazy(() => import('@/components/home/PopularProducts').then(mod => ({ default: mod.PopularProducts })));
const BannerAds = lazy(() => import('@/components/home/BannerAds').then(mod => ({ default: mod.BannerAds })));
const RecentlyViewedProducts = lazy(() => import('@/components/home/RecentlyViewedProducts').then(mod => ({ default: mod.RecentlyViewedProducts })));
const ProductGrid = lazy(() => import('@/components/products/ProductGrid').then(mod => ({ default: mod.ProductGrid })));


export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-12">
        <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full" />
        <div className="px-4 sm:px-6 lg:px-8 space-y-4 py-12">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroSlider />
      <div className="space-y-24">
        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl text-left">
                    Discover Local Treasures
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-left">
                    Explore unique, handcrafted products from local artisans and manufacturers near you.
                </p>
            </div>
        </section>

        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div />}>
                  <BannerAds placement="homepage_top" />
                </Suspense>
            </div>
        </section>

        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                 <Suspense fallback={<div className="h-48" />}>
                  <FeaturedCategories />
                </Suspense>
            </div>
        </section>

        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div className="h-64" />}>
                  <Promotions />
                </Suspense>
            </div>
        </section>

        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<RecentlyViewedSkeleton />}>
                  <RecentlyViewedProducts />
                </Suspense>
            </div>
        </section>
        
        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<ProductGridSkeleton />}>
                  <PopularProducts />
                </Suspense>
            </div>
        </section>

        <section className="py-12">
            <div className="px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold font-headline mb-6">All Products</h2>
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid />
                </Suspense>
            </div>
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
    <h2 className="text-2xl font-bold font-headline mb-6">Recently Viewed</h2>
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
