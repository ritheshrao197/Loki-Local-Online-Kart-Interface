
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { getProducts } from '@/lib/firebase/firestore';

type CategoryWithImage = {
  name: string;
  image: string;
  hint: string;
};

export function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedCategories() {
      try {
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
        setCategories(uniqueCategories.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch products for categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedCategories();
  }, []);

  if (loading) {
    return (
        <div>
            <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="aspect-[4/5]"/>)}
            </div>
        </div>
    )
  }

  if (categories.length === 0) {
      return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link href="/" key={category.name} className="group">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/5]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                  data-ai-hint={category.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent flex items-end justify-start p-4">
                  <h3 className="font-headline text-white text-lg font-semibold">{category.name}</h3>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
