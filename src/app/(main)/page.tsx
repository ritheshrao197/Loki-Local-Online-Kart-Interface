import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { mockProducts } from '@/lib/placeholder-data';

export default function HomePage() {
  const approvedProducts = mockProducts.filter(p => p.status === 'approved');

  return (
    <div className="container py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          Discover Local Treasures
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore unique, handcrafted products from local artisans and manufacturers near you.
        </p>
      </section>

      <div className="mb-8">
        <ProductFilters />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {approvedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
