
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

type CategoryWithImage = {
  name: string;
  image: string;
  hint: string;
};

interface FeaturedCategoriesProps {
    products: Product[];
}

export function FeaturedCategories({ products }: FeaturedCategoriesProps) {
  
  const uniqueCategories = products.reduce((acc, product) => {
    if (!acc.find(c => c.name === product.category)) {
      acc.push({
        name: product.category,
        image: product.images[0].url,
        hint: product.images[0].hint,
      });
    }
    return acc;
  }, [] as CategoryWithImage[]);

  const categories = uniqueCategories.slice(0, 4);

  if (products.length === 0) {
    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="aspect-square"/>)}
            </div>
        </section>
    )
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link href="/" key={category.name} className="group">
            <Card className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  data-ai-hint={category.hint}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="font-headline text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
