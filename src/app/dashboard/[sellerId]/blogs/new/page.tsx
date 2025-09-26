
'use client';
import { useParams } from 'next/navigation';
import { StoryForm } from '@/components/dashboard/StoryForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

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
      <StoryForm sellerId={sellerId} />
    </div>
  );
}
