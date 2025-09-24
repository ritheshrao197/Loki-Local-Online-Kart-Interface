
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogById } from '@/lib/firebase/firestore';
import type { Blog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BlogPostPage() {
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchBlog() {
      try {
        const fetchedBlog = await getBlogById(id as string);
        if (!fetchedBlog || fetchedBlog.status !== 'approved') {
          notFound();
        } else {
          setBlog(fetchedBlog);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return <BlogSkeleton />;
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-12">
      <article className="prose lg:prose-xl max-w-none">
        {blog.featuredImage && (
          <div className="relative aspect-video mb-8">
            <Image
              src={blog.featuredImage.url}
              alt={blog.title}
              fill
              className="object-cover rounded-xl border"
              data-ai-hint={blog.featuredImage.hint}
            />
          </div>
        )}
        <h1 className="font-headline mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://picsum.photos/seed/${blog.author.id}/100`} />
              <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{blog.author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={blog.createdAt}>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</time>
        </div>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
}

const BlogSkeleton = () => (
  <div className="container max-w-4xl py-12">
    <div className="space-y-6">
      <Skeleton className="h-96 w-full rounded-xl" />
      <Skeleton className="h-12 w-3/4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  </div>
);
