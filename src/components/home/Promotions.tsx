
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function Promotions() {
  const [promotedProducts, setPromotedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPromotedProducts() {
      try {
        const { getProducts } = await import('@/lib/firebase/firestore');
        const products = await getProducts('approved');
        // Sort by price descending and take top 2 as "promotions"
        const sorted = products.sort((a, b) => b.price - a.price);
        setPromotedProducts(sorted.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch products for promotions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPromotedProducts();
  }, []);

  if (loading) {
    return (
      <section className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  if (promotedProducts.length === 0) {
    return null;
  }

  return (
    <section className="grid md:grid-cols-2 gap-6">
      {promotedProducts.map((product, index) => (
        <Link href={`/products/${product.id}`} key={product.id} className="group">
          <Card className="relative overflow-hidden h-full">
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={800}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.images[0].hint}
            />
            <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold font-headline text-white">
                {index === 0 ? 'Featured Item' : 'Discover More'}
              </h3>
              <p className="text-white/90 mt-2">{product.name}</p>
              <Button variant="secondary" className="mt-4 w-fit">View Product</Button>
            </div>
          </Card>
        </Link>
      ))}
    </section>
  );
}
