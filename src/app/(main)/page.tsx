
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { Promotions } from '@/components/home/Promotions';
import { PopularProducts } from '@/components/home/PopularProducts';
import { getProducts } from '@/lib/firebase/firestore';
import Link from 'next/link';

export default async function HomePage() {
  const approvedProducts = await getProducts('approved');

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

        <div className="mb-8">
          <ProductFilters />
        </div>

        <FeaturedCategories />

        <div className="mt-12">
          <Promotions />
        </div>
        
        {approvedProducts.length > 0 && (
          <div className="mt-12">
              <PopularProducts products={approvedProducts.slice(0,8)} />
          </div>
        )}

        <div className="mt-20">
          <h2 className="text-2xl font-bold font-headline mb-6">All Products</h2>
          {approvedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {approvedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold">No Products Yet</h3>
                <p className="text-muted-foreground mt-1">
                    There are no approved products available right now. Please check back later.
                    <br/>
                    Are you a seller? <Link href="/login/admin" className="text-primary underline">Log in to add products</Link>.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
