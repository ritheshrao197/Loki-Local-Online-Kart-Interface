'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useSWRData';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';

export function PopularProducts() {
  const { products, isLoading, isError } = useProducts('approved');
  
  // Take the first 8 approved products as "popular"
  const popularProducts = products.slice(0, 8);

  if (isLoading) {
    return (
      <div>
        <motion.h2 
          className="text-2xl font-bold font-headline mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Popular Products
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError || popularProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <motion.h2 
        className="text-2xl font-bold font-headline mb-6 text-gradient text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Popular Products
      </motion.h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {popularProducts.map((product, index) => (
            <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-background/80 hover:bg-background border-border" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-background/80 hover:bg-background border-border" />
      </Carousel>
    </div>
  );
}