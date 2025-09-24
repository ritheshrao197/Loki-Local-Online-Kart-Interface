

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogById } from '@/lib/firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function BlogPostPage({ params }: { params: { id: string }}) {
  const { id } = params;
  
  const blog = await getBlogById(id as string);

  if (!blog || blog.status !== 'approved') {
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
