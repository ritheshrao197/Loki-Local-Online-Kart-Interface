'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Product, Seller } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSellerById } from '@/lib/firebase/firestore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    async function fetchSeller() {
      const fetchedSeller = await getSellerById(product.sellerId);
      setSeller(fetchedSeller);
    }
    fetchSeller();
  }, [product.sellerId]);


  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to product page
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
    });
    // Here you would typically dispatch an action to add the item to a global state (e.g., Redux, Zustand, or Context)
  }

  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group [perspective:1000px] hover:shadow-xl border-0 bg-gradient-to-br from-card to-card/80">
        <div className="h-full transition-all duration-300 group-hover:[transform:rotateX(10deg)_translateY(-0.5rem)] rounded-xl">
          <CardContent className="p-0 flex flex-col flex-grow h-full rounded-xl">
            <Link href={`/products/${product.id}`} className="block flex flex-col flex-grow">
              <div className="relative aspect-square w-full overflow-hidden rounded-t-xl">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  data-ai-hint={product.images[0].hint}
                  quality={80}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={`/_next/image?url=${product.images[0].url}&w=16&q=1`}
                />
                {product.status === 'pending' && (
                  <Badge variant="secondary" className="absolute top-2 left-2 z-10">Pending</Badge>
                )}
                 {product.discountPrice && (
                     <Badge variant="destructive" className="absolute top-2 right-2 z-10">SALE</Badge>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col bg-card rounded-b-xl">
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <h3 className="mt-1 font-headline font-semibold text-lg truncate group-hover:text-primary transition-colors">{product.name}</h3>
                 <p className="mt-1 text-xs text-muted-foreground">
                  by {seller?.name || '...'}
                </p>
              </div>
            </Link>
            <div className="p-4 pt-0 mt-auto bg-card rounded-b-xl">
                 <div className="flex items-center gap-2">
                    <p className={`text-xl font-bold ${product.discountPrice ? 'text-destructive' : 'text-primary'}`}>
                        ₹{product.discountPrice ? product.discountPrice.toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
                    </p>
                    {product.discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                            ₹{product.price.toLocaleString('en-IN')}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="sm" className="w-full shadow-md hover:shadow-lg transition-shadow">
                        <ShoppingCart className="mr-2 h-4 w-4"/>
                        Add to Cart
                    </Button>
                  </motion.div>
                </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
});