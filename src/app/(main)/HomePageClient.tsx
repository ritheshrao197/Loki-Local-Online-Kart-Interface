
'use client';

import { Suspense } from 'react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { RecentlyViewedLoader } from '@/components/home/RecentlyViewedLoader';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { motion } from 'framer-motion';

// Dynamically import components with optimized loading
const HeroSlider = dynamic(() => import('@/components/home/HeroSlider').then(mod => mod.HeroSlider), {
  loading: () => <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-apple-xl" />,
  ssr: true
});

const FeaturedCategories = dynamic(() => import('@/components/home/FeaturedCategories').then(mod => mod.FeaturedCategories), {
  loading: () => <FeaturedCategoriesSkeleton />,
  ssr: true
});

const Promotions = dynamic(() => import('@/components/home/Promotions').then(mod => mod.Promotions), {
  loading: () => <Skeleton className="h-80 w-full rounded-apple-xl" />,
  ssr: true
});

const PopularProducts = dynamic(() => import('@/components/home/PopularProducts').then(mod => mod.PopularProducts), {
  loading: () => <ProductGridSkeleton />,
  ssr: true
});

const BannerAds = dynamic(() => import('@/components/home/BannerAds').then(mod => mod.BannerAds), {
  loading: () => <div className="h-48" />,
  ssr: true
});

const ProductGrid = dynamic(() => import('@/components/products/ProductGrid').then(mod => mod.ProductGrid), {
  loading: () => <ProductGridSkeleton />,
  ssr: true
});

export function HomePageClient() {
  return (
    <div className="flex flex-col">
      <ErrorBoundary>
        <HeroSlider />
      </ErrorBoundary>
      
      <div className="space-y-24 py-12">
        <motion.section 
          className="py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.h1 
              className="text-4xl font-bold font-headline tracking-tight lg:text-5xl text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover Local Treasures
            </motion.h1>
            <motion.p 
              className="mt-4 max-w-2xl text-lg text-muted-foreground text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Explore unique, handcrafted products from local artisans and manufacturers near you.
            </motion.p>
          </div>
        </motion.section>

        <ErrorBoundary>
          <motion.section 
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<div className="h-48" />}>
                <BannerAds placement="homepage_top" />
              </Suspense>
            </div>
          </motion.section>
        </ErrorBoundary>

        <ErrorBoundary>
          <motion.section 
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<FeaturedCategoriesSkeleton />}>
                <FeaturedCategories />
              </Suspense>
            </div>
          </motion.section>
        </ErrorBoundary>

        <ErrorBoundary>
          <motion.section 
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<div className="h-64" />}>
                <Promotions />
              </Suspense>
            </div>
          </motion.section>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <motion.section 
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
               <Suspense fallback={<ProductGridSkeleton />}>
                    <PopularProducts />
                  </Suspense>
            </div>
          </motion.section>
        </ErrorBoundary>

        <ErrorBoundary>
          <motion.section 
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <RecentlyViewedLoader />
            </div>
          </motion.section>
        </ErrorBoundary>

        <ErrorBoundary>
          <motion.section 
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold font-headline mb-6">All Products</h2>
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid />
              </Suspense>
            </div>
          </motion.section>
        </ErrorBoundary>
      </div>
    </div>
  );
}

const ProductGridSkeleton = () => (
    <div className="space-y-8">
    <div className="flex gap-4">
        <Skeleton className="h-10 w-[180px] rounded-full" />
        <Skeleton className="h-10 w-[180px] rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-apple-xl" />
            <Skeleton className="h-5 w-3/4 rounded-full" />
            <Skeleton className="h-5 w-1/2 rounded-full" />
          </div>
        ))}
    </div>
   </div>
);

const FeaturedCategoriesSkeleton = () => (
    <div>
        <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="aspect-[4/5] rounded-apple-xl"/>)}
        </div>
    </div>
);
