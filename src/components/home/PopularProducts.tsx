
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase/firestore';

async function fetchPopularProducts(): Promise<Product[]> {
    try {
        const approvedProducts = await getProducts('approved');
        // Simple logic for "popular": take the first 8 approved products.
        // In a real app, this would be based on sales, views, etc.
        return approvedProducts.slice(0, 8);
    } catch (error) {
        console.error("Failed to fetch popular products:", error);
        return [];
    }
}

export async function PopularProducts() {
  const products = await fetchPopularProducts();

  if(products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-6">Popular Products</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                    <ProductCard product={product} />
                </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
      </Carousel>
    </div>
  );
}
