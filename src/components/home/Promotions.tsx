
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase/firestore';


async function fetchPromotions(): Promise<Product[]> {
    try {
        const products = await getProducts('approved');
        return products.filter(p => p.isPromoted).slice(0, 2);
    } catch (error) {
        console.error("Failed to fetch promoted products:", error);
        return [];
    }
}


export async function Promotions() {
    const promotedProducts = await fetchPromotions();

    if (promotedProducts.length === 0) {
        return null;
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
        {promotedProducts.map((product, index) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
            <Card className="relative overflow-hidden h-80">
                <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={product.images[0].hint}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-8 flex flex-col justify-center items-start text-left">
                <h3 className="text-3xl font-bold font-headline text-white">
                    {product.name}
                </h3>
                <p className="text-white/90 mt-2 max-w-xs">{index === 0 ? 'Featured Promotion' : 'Special Offer'}</p>
                <Button variant="secondary" className="mt-6">View Product</Button>
                </div>
            </Card>
            </Link>
        ))}
        </div>
    );
}
