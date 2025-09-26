
'use client';
import { Suspense, lazy } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const StoryForm = lazy(() => import('@/components/dashboard/StoryForm').then(mod => ({ default: mod.StoryForm })));

const FormSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-4 border p-6 rounded-lg">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4 border p-6 rounded-lg">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full" />
        </div>
        <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
)

export default function NewStoryPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;

  if (!sellerId) {
    // This can happen during initial render on the client
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/dashboard/${sellerId}/blogs`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Create New Story</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <StoryForm sellerId={sellerId} />
      </Suspense>
    </div>
  );
}
