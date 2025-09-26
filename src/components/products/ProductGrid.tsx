
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/lib/firebase/firestore';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
    initialProducts: Product[];
}

function ProductGridClient({ initialProducts }: ProductGridProps) {
  const [sortOption, setSortOption] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(10000);

  const categories = useMemo(() => {
    const allCategories = initialProducts.map(p => p.category);
    return [...new Set(allCategories)];
  }, [initialProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];

    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    products = products.filter(p => p.price <= priceRange);

    switch (sortOption) {
      case 'price_asc':
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        products.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'featured':
      default:
        break;
    }

    return products;
  }, [initialProducts, sortOption, selectedCategory, priceRange]);

  return (
    <div className="space-y-8">
      <ProductFilters 
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        categories={categories}
      />
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg flex flex-col items-center">
            <PackageSearch className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-6 text-xl font-semibold">No Products Match Your Filters</h3>
            <p className="mt-2 text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
            </p>
        </div>
      )}
    </div>
  );
}


export async function ProductGrid() {
    const products = await getProducts('approved');
    return <ProductGridClient initialProducts={products} />;
}
