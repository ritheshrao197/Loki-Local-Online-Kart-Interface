
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { Promotions } from '@/components/home/Promotions';
import { PopularProducts } from '@/components/home/PopularProducts';
import { getProducts } from '@/lib/firebase/firestore';
import { ProductGrid } from '@/components/products/ProductGrid';

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
          <ProductGrid products={approvedProducts} />
        </div>
      </div>
    </div>
  );
}
