
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
        setCategories(uniqueCategories.slice(0, 4));
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
            <h2 className="text-2xl font-bold font-headline mb-6 text-gradient">Featured Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="aspect-square"/>)}
            </div>
        </div>
    )
  }

  if (categories.length === 0) {
      return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-6 text-gradient">Featured Categories</h2>
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
    </div>
  );
}
