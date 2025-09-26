
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to product page
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
    });
    // Here you would typically dispatch an action to add the item to a global state (e.g., Redux, Zustand, or Context)
  }

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 flex flex-col group">
        <CardContent className="p-0 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block flex flex-col flex-grow">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              data-ai-hint={product.images[0].hint}
            />
            {product.status === 'pending' && (
              <Badge variant="secondary" className="absolute top-2 left-2">Pending</Badge>
            )}
             {product.discountPrice && (
                 <Badge variant="destructive" className="absolute top-2 right-2">SALE</Badge>
            )}
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h3 className="mt-1 font-headline font-semibold text-lg truncate group-hover:text-primary">{product.name}</h3>
             <p className="mt-1 text-xs text-muted-foreground">
              by {product.seller.name}
            </p>
          </div>
        </Link>
        <div className="p-4 pt-0 mt-auto">
             <div className="flex items-center gap-2">
                <p className={`text-xl font-bold ${product.discountPrice ? 'text-destructive' : 'text-primary'}`}>
                    &#8377;{product.discountPrice ? product.discountPrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
                </p>
                {product.discountPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                        &#8377;{product.price.toLocaleString('en-IN')}
                    </p>
                )}
            </div>

            <div className="mt-4 flex gap-2">
                <Button size="sm" className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4"/>
                    Add to Cart
                </Button>
            </div>
        </div>
        </CardContent>
    </Card>
  );
}
