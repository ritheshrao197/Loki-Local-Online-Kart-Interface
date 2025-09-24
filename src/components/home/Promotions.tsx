
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


interface PromotionsProps {
    products: Product[];
}

export function Promotions({ products }: PromotionsProps) {
  const promotedProducts = products.filter(p => p.isPromoted).slice(0, 2);

  if (products.length === 0) {
      return (
          <section className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
          </section>
      )
  }

  if (promotedProducts.length === 0) {
    return null;
  }

  return (
    <section className="grid md:grid-cols-2 gap-6">
      {promotedProducts.map((product, index) => (
        <Link href={`/products/${product.id}`} key={product.id} className="group">
          <Card className="relative overflow-hidden h-64">
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={product.images[0].hint}
            />
            <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold font-headline text-white">
                {index === 0 ? 'Featured Promotion' : 'Special Offer'}
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
