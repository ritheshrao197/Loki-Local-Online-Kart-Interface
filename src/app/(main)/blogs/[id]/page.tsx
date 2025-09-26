import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogById } from '@/lib/firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Blog } from '@/lib/types';

interface BlogPostPageProps {
  params: { id: string };
}

async function getBlogData(id: string): Promise<Blog | null> {
  try {
    const fetchedBlog = await getBlogById(id as string);
    if (!fetchedBlog || fetchedBlog.status !== 'approved') {
      return null;
    }
    return fetchedBlog;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = params;
  const blog = await getBlogData(id);

  if (!blog) {
    notFound();
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
              priority
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

export function BlogPostSkeleton() {
  return (
    <div className="container max-w-4xl py-12">
      <Skeleton className="relative aspect-video mb-8" />
      <Skeleton className="h-12 w-3/4 mb-4" />
      <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
      </div>
    </div>
  );
}
