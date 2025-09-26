'use client';

import { useProducts } from '@/hooks/useSWRData';
import { ProductGridClient } from './ProductGridClient';
import { Skeleton } from '../ui/skeleton';

export function ProductGrid() {
    const { products, isLoading, isError } = useProducts('approved');
    
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">Failed to load products. Please try again later.</p>
            </div>
        );
    }
    
    return <ProductGridClient initialProducts={products} />;
}