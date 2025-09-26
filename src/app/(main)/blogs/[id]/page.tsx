
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogById } from '@/lib/firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Blog } from '@/lib/types';

interface StoryPageProps {
  params: { id: string };
}

async function getStoryData(id: string): Promise<Blog | null> {
  try {
    const fetchedStory = await getBlogById(id as string);
    if (!fetchedStory || fetchedStory.status !== 'approved') {
      return null;
    }
    return fetchedStory;
  } catch (error) {
    console.error("Failed to fetch story:", error);
    return null;
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = params;
  const story = await getStoryData(id);

  if (!story) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-12">
      <article className="prose lg:prose-xl max-w-none">
        {story.featuredImage && (
          <div className="relative aspect-video mb-8">
            <Image
              src={story.featuredImage.url}
              alt={story.title}
              fill
              className="object-cover rounded-xl border"
              data-ai-hint={story.featuredImage.hint}
              priority
            />
          </div>
        )}
        <h1 className="font-headline mb-4">{story.title}</h1>
        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://picsum.photos/seed/${story.author.id}/100`} />
              <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{story.author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={story.createdAt}>{format(new Date(story.createdAt), 'MMMM d, yyyy')}</time>
        </div>
        <div dangerouslySetInnerHTML={{ __html: story.content }} />
      </article>
    </div>
  );
}

export function StoryPageSkeleton() {
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
