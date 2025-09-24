
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

type CategoryWithImage = {
  name: string;
  image: string;
  hint: string;
};

export function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { getProducts } = await import('@/lib/firebase/firestore');
        const products = await getProducts('approved');
        
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

        setCategories(uniqueCategories.slice(0, 4)); // Show max 4 categories
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : (
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
      )}
    </section>
  );
}
