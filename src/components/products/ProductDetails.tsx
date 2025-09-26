'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ShoppingCart, ThumbsUp, Truck, Warehouse, Zap, Share2, Star } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product, Seller } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENTLY_VIEWED = 8;

export function ProductDetails({ product, seller, relatedProducts }: { product: Product, seller: Seller, relatedProducts: Product[] }) {
  const { toast } = useToast();

  useEffect(() => {
    // Add to recently viewed on client side
    if (typeof window !== 'undefined') {
      const recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]') as string[];
      const updatedRecentlyViewed = [product.id, ...recentlyViewed.filter(itemId => itemId !== product.id)].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedRecentlyViewed));
    }
  }, [product.id]);

  const handleAddToCart = () => {
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this product: ${product?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link Copied!",
            description: "Product link copied to your clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Product link copied to your clipboard.",
      });
    }
  };
  
  const handleChat = () => {
     toast({
      title: "Coming Soon!",
      description: "The chat with seller feature is under development.",
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.images[0].hint}
                priority
                />
            </div>
        </motion.div>

        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
        >
            <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Badge variant="secondary">{product.category}</Badge>
                </motion.div>
                <motion.h1 
                  className="mt-2 text-3xl font-bold font-headline lg:text-4xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {product.name}
                </motion.h1>
                <motion.p 
                  className="mt-2 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Sold by{' '}
                    <Link href={`/sellers/${seller.id}`} className="text-accent-foreground font-medium hover:underline">
                        {seller.name}
                    </Link>
                </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
                <p className="text-4xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(12 reviews)</span>
                </div>
            </motion.div>

            <motion.p 
              className="text-foreground/80 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {product.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2" /> Add to Cart
                    </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                    <Button size="lg" variant="outline" className="flex-1 bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-primary" onClick={handleAddToCart}>
                        <Zap className="mr-2" /> Buy Now (UPI)
                    </Button>
                </motion.div>
            </motion.div>

             <motion.div 
               className="flex items-center justify-between gap-4 text-sm"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.9 }}
             >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                    <Button variant="ghost" className="text-muted-foreground" onClick={handleChat}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat with Seller
                    </Button>
                </motion.div>
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                    <Button variant="ghost" className="text-muted-foreground" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
                <Separator />
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
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
            </motion.div>
        </motion.div>
      </div>
      
      {relatedProducts.length > 0 && (
        <motion.section 
          className="mt-20" 
          aria-labelledby="related-products-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.h2 
            id="related-products-heading" 
            className="text-2xl font-bold font-headline mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            Related Products
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1.4 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}