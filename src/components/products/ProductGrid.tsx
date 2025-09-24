
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/lib/firebase/firestore';

export function ProductGrid() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(10000);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts('approved');
        setInitialProducts(products);
      } catch (error) {
        console.error("Failed to fetch products for grid:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];

    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    products = products.filter(p => p.price <= priceRange);

    switch (sortOption) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming ID is sortable by date, which is not guaranteed.
        // A 'createdAt' timestamp is better.
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'featured':
      default:
        // No default sorting for 'featured' without an explicit order field
        break;
    }

    return products;
  }, [initialProducts, sortOption, selectedCategory, priceRange]);

  if (loading) {
    return (
       <div className="space-y-8">
        <div className="flex gap-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 flex-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
       </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <ProductFilters 
          sortOption={sortOption}
          setSortOption={setSortOption}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold">No Products Match Your Filters</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </>
  );
}
