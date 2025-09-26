
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Blog as Story } from '@/lib/types';
import { addBlog, updateBlog, getSellerById } from '@/lib/firebase/firestore';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(100, 'Content must be at least 100 characters long.'),
  featuredImageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  videoUrl: z.string().url('Please enter a valid video URL.').optional().or(z.literal('')),
  shortVideoUrl: z.string().url('Please enter a valid video URL.').optional().or(z.literal('')),
});

type StoryFormValues = z.infer<typeof formSchema>;

interface StoryFormProps {
  story?: Story;
  sellerId: string;
}

export function StoryForm({ story, sellerId }: StoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!story;

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          title: story.title,
          content: story.content,
          featuredImageUrl: story.featuredImage?.url || '',
          videoUrl: story.videoUrl || '',
          shortVideoUrl: story.shortVideoUrl || '',
        }
      : {
          title: '',
          content: '',
          featuredImageUrl: '',
          videoUrl: '',
          shortVideoUrl: '',
        },
  });

  const onSubmit = async (data: StoryFormValues) => {
    setIsSubmitting(true);
    try {
      const seller = await getSellerById(sellerId);
      if (!seller) throw new Error('Seller not found.');

      const storyData = {
        title: data.title,
        content: data.content,
        author: { id: sellerId, name: seller.name },
        ...(data.featuredImageUrl && { 
            featuredImage: { url: data.featuredImageUrl, hint: 'blog post' } 
        }),
        ...(data.videoUrl && { videoUrl: data.videoUrl }),
        ...(data.shortVideoUrl && { shortVideoUrl: data.shortVideoUrl }),
      };

      if (isEditMode) {
        await updateBlog(story.id, storyData);
        toast({ title: 'Seller Story Updated', description: 'Your changes are pending re-approval.' });
      } else {
        await addBlog({ ...storyData, status: 'pending' });
        toast({ title: 'Seller Story Submitted', description: 'Your story is pending admin approval.' });
      }
      router.push(`/dashboard/${sellerId}/blogs`);
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({ title: "Submission Error", description: "Could not save the story.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
            <CardDescription>Share the inspiration and craftsmanship behind your work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A catchy title for your story" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Write your story here... (at least 100 characters)"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    You can use basic HTML for formatting, e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;p&gt;paragraphs&lt;/p&gt;.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="featuredImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                   <FormDescription>
                    Link to a longer video about your brand or process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="shortVideoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/shorts/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to a short, vertical video (e.g., YouTube Short, Instagram Reel).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Submit for Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
