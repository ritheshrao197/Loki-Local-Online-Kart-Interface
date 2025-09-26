
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const RecentlyViewedProducts = dynamic(() => import('@/components/home/RecentlyViewedProducts').then(mod => mod.RecentlyViewedProducts), {
    loading: () => <RecentlyViewedSkeleton />,
    ssr: false
});

const RecentlyViewedSkeleton = () => (
  <div>
    <h2 className="text-2xl font-bold font-headline mb-6">Recently Viewed</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({length: 4}).map((_, i) => (
         <div key={i} className="space-y-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
         </div>
      ))}
    </div>
  </div>
);

export function RecentlyViewedLoader() {
    return <RecentlyViewedProducts />;
}
