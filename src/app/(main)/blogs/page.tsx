
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogs } from '@/lib/firebase/firestore';
import type { Blog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Newspaper } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const approvedBlogs = await getBlogs('approved');
        approvedBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBlogs(approvedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          Stories from Our Sellers
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover the inspiration and craftsmanship behind the products you love.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">No Blog Posts Yet</h2>
          <p className="mt-2 text-muted-foreground">
            There are no stories to share right now. Please check back later!
          </p>
        </div>
      )}
    </div>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="h-full flex flex-col group">
      <Link href={`/blogs/${blog.id}`} className="block">
        {blog.featuredImage ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                <Image
                src={blog.featuredImage.url}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={blog.featuredImage.hint}
                />
            </div>
        ) : (
            <div className="aspect-video w-full bg-secondary rounded-t-lg" />
        )}
      </Link>
      <CardHeader>
        <CardTitle className="leading-snug group-hover:text-primary">
          <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content.replace(/<[^>]+>/g, '') }} />
      </CardContent>
      <CardFooter className="flex items-center gap-3 text-sm text-muted-foreground">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://picsum.photos/seed/${blog.author.id}/100`} />
          <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{blog.author.name}</p>
          <time dateTime={blog.createdAt}>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</time>
        </div>
      </CardFooter>
    </Card>
  );
}

const BlogCardSkeleton = () => (
  <Card>
    <Skeleton className="aspect-video w-full rounded-t-lg" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </CardContent>
    <CardFooter className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </CardFooter>
  </Card>
);
