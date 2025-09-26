"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/firebase/firestore';

type CategoryWithImage = {
  name: string;
  image: string;
  hint: string;
};

export function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);

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
        setCategories(uniqueCategories.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch products for categories:", error);
      }
    }

    fetchFeaturedCategories();
  }, []);

  if (categories.length === 0) {
      return null;
  }

  return (
    <div>
      <motion.h2 
        className="text-2xl font-bold font-headline mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Featured Categories
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -15,
              transition: { duration: 0.3 }
            }}
            className="group"
          >
            <Link href="/" className="block h-full">
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-xl transition-all duration-300 h-full transform-gpu rounded-app-lg">
                <div className="relative aspect-[4/5]">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                      data-ai-hint={category.hint}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end justify-start p-4">
                    <motion.h3 
                      className="font-headline text-white text-lg font-semibold drop-shadow-md"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {category.name}
                    </motion.h3>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
