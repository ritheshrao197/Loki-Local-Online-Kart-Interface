
'use client';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { Promotions } from '@/components/home/Promotions';
import { PopularProducts } from '@/components/home/PopularProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BannerAds } from '@/components/home/BannerAds';

export default function HomePage() {
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

        <BannerAds placement="homepage_top" />

        <FeaturedCategories />

        <div className="mt-12">
          <Promotions />
        </div>
        
        <div className="mt-12">
            <PopularProducts />
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold font-headline mb-6">All Products</h2>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}

