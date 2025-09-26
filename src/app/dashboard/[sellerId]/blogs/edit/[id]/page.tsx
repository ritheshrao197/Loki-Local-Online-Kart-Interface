
'use client';
import { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { getBlogById } from '@/lib/firebase/firestore';
import type { Blog } from '@/lib/types';
import { StoryForm } from '@/components/dashboard/StoryForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;
  const sellerId = params.sellerId as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!blogId || !sellerId) return;

    getBlogById(blogId)
      .then(fetchedBlog => {
        if (!fetchedBlog || fetchedBlog.author.id !== sellerId) {
          notFound();
        } else {
          setBlog(fetchedBlog);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [blogId, sellerId]);

  if (loading) {
    return <FormSkeleton />;
  }

  if (error || !blog) {
    notFound();
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
        <h1 className="text-3xl font-bold font-headline">Edit Story</h1>
      </div>
      <StoryForm story={blog} sellerId={sellerId} />
    </div>
  );
}

const FormSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
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
