
import { Suspense } from 'react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGrid } from '@/components/products/ProductGrid';
import dynamic from 'next/dynamic';

const HeroSlider = dynamic(() => import('@/components/home/HeroSlider').then(mod => mod.HeroSlider));
const FeaturedCategories = dynamic(() => import('@/components/home/FeaturedCategories').then(mod => mod.FeaturedCategories));
const Promotions = dynamic(() => import('@/components/home/Promotions').then(mod => mod.Promotions));
const PopularProducts = dynamic(() => import('@/components/home/PopularProducts').then(mod => mod.PopularProducts));
const BannerAds = dynamic(() => import('@/components/home/BannerAds').then(mod => mod.BannerAds));
const RecentlyViewedProducts = dynamic(() => import('@/components/home/RecentlyViewedProducts').then(mod => mod.RecentlyViewedProducts));

export default function HomePage() {
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
            <Suspense fallback={<div className="h-48" />}>
              <BannerAds placement="homepage_top" />
            </Suspense>
          </div>
        </section>

        <section className="py-12">
          <div className="px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<FeaturedCategoriesSkeleton />}>
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
             <Suspense fallback={<ProductGridSkeleton />}>
                  <PopularProducts />
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
);

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
);

const FeaturedCategoriesSkeleton = () => (
    <div>
        <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="aspect-[4/5]"/>)}
        </div>
    </div>
);
