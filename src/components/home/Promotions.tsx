'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase/firestore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function fetchPromotions(): Promise<Product[]> {
    return new Promise((resolve) => {
        getProducts('approved')
            .then(products => {
                const promotedProducts = products.filter(p => p.isPromoted).slice(0, 2);
                resolve(promotedProducts);
            })
            .catch(error => {
                console.error("Failed to fetch promoted products:", error);
                resolve([]);
            });
    });
}

export function Promotions() {
    const [promotedProducts, setPromotedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions().then(products => {
            setPromotedProducts(products);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 gap-6">
                {Array.from({length: 2}).map((_, i) => (
                    <div key={i} className="h-80 bg-secondary rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (promotedProducts.length === 0) {
        return null;
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
        {promotedProducts.map((product, index) => (
            <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                }}
                whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                }}
                className="group"
            >
                <Link href={`/products/${product.id}`} className="group">
                <Card className="relative overflow-hidden h-80">
                    <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover w-full h-full"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        data-ai-hint={product.images[0].hint}
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-8 flex flex-col justify-center items-start text-left">
                    <motion.h3 
                        className="text-3xl font-bold font-headline text-white"
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {product.name}
                    </motion.h3>
                    <motion.p 
                        className="text-white/90 mt-2 max-w-xs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {index === 0 ? 'Featured Promotion' : 'Special Offer'}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button variant="secondary" className="mt-6">View Product</Button>
                    </motion.div>
                    </div>
                </Card>
                </Link>
            </motion.div>
        ))}
        </div>
    );
}