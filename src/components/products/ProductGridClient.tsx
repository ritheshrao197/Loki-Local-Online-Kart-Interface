'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductCard } from '@/components/products/ProductCard';
import { PackageSearch } from 'lucide-react';

interface ProductGridClientProps {
    initialProducts: Product[];
}

export function ProductGridClient({ initialProducts }: ProductGridClientProps) {
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
        // Assuming products are fetched in a default order, we can rely on that or a timestamp
        // For mock data, we can sort by ID as a proxy for newest
        products.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      case 'featured':
      default:
        // No sort, use default order
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
