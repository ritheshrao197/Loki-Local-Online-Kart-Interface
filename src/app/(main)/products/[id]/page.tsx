
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ShoppingCart, ThumbsUp, Truck, Warehouse, Zap, Share2, Star } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    async function fetchProductData() {
      try {
        const { getProductById, getProducts } = await import('@/lib/firebase/firestore');
        const fetchedProduct = await getProductById(id as string);
        if (!fetchedProduct || fetchedProduct.status !== 'approved') {
          notFound();
          return;
        }
        setProduct(fetchedProduct);

        const allApprovedProducts = await getProducts('approved');
        const filteredRelated = allApprovedProducts
          .filter((p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 4);
        setRelatedProducts(filteredRelated);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return null; // notFound() would have been called
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.images[0].hint}
                />
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <div>
                <Badge variant="secondary">{product.category}</Badge>
                <h1 className="mt-2 text-3xl font-bold font-headline lg:text-4xl">{product.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Sold by <span className="text-accent-foreground font-medium">{product.seller.name}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(12 reviews)</span>
                </div>
            </div>

            <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1">
                    <ShoppingCart className="mr-2" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1 bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-primary">
                    <Zap className="mr-2" /> Buy Now (UPI)
                </Button>
            </div>

             <div className="flex items-center justify-between gap-4 text-sm">
                <Button variant="ghost" className="text-muted-foreground">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat with Seller
                </Button>
                 <Button variant="ghost" className="text-muted-foreground">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                    <Warehouse className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Local Manufacturer</p>
                        <p className="text-muted-foreground">Direct from source</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ThumbsUp className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Quality Assured</p>
                        <p className="text-muted-foreground">Admin-approved products</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Local Delivery</p>
                        <p className="text-muted-foreground">Check availability</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold font-headline mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}


const ProductDetailSkeleton = () => (
  <div className="container py-12">
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-5 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-48 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  </div>
);
