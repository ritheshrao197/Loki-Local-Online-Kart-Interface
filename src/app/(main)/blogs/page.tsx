
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogs } from '@/lib/firebase/firestore';
import type { Blog } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Newspaper } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogsPage() {
  const [approvedBlogs, setApprovedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogs = await getBlogs('approved');
        blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setApprovedBlogs(blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);
  
  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

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

      {approvedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {approvedBlogs.map((blog) => (
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    <Card className="h-full flex flex-col">
        <Skeleton className="aspect-video w-full rounded-t-lg" />
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
            </div>
        </CardFooter>
    </Card>
)
