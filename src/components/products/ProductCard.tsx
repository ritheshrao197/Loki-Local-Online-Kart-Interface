import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.images[0].hint}
            />
            {product.status === 'pending' && (
              <Badge variant="secondary" className="absolute top-2 left-2">Pending</Badge>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h3 className="mt-1 font-headline font-semibold text-lg truncate">{product.name}</h3>
            <p className="mt-2 text-xl font-bold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              by {product.seller.name}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
