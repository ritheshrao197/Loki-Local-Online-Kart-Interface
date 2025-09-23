
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function HeroSlider() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { getProducts } = await import('@/lib/firebase/firestore');
        const products = await getProducts('approved');
        setFeaturedProducts(products.slice(0, 3)); // Take first 3 approved products
      } catch (error) {
        console.error("Failed to fetch products for hero slider:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full" />;
  }
  
  if (featuredProducts.length === 0) {
    return null; // Don't show slider if no products
  }

  return (
    <section className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {featuredProducts.map((product) => (
            <CarouselItem key={product.id}>
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.images[0].hint}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline">
                    {product.name}
                  </h2>
                  <p className="mt-2 md:mt-4 max-w-lg text-lg">
                    {product.description.substring(0, 100)}...
                  </p>
                  <Button asChild className="mt-6 md:mt-8" size="lg">
                    <Link href={`/products/${product.id}`}>View Product</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
      </Carousel>
    </section>
  );
}
