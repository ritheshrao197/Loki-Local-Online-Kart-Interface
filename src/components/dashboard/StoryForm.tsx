
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Film, Image as ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import type { Blog as Story } from '@/lib/types';
import { addBlog, updateBlog, getSellerById } from '@/lib/firebase/firestore';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(100, 'Content must be at least 100 characters long.'),
  featuredImage: z.any().optional(),
  video: z.any().optional(),
  shortVideo: z.any().optional(),
});

type StoryFormValues = z.infer<typeof formSchema>;

interface StoryFormProps {
  story?: Story;
  sellerId: string;
}

// Helper to convert file to Data URI
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function StoryForm({ story, sellerId }: StoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(story?.featuredImage?.url || null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [shortVideoFileName, setShortVideoFileName] = useState<string | null>(null);

  const isEditMode = !!story;
  
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          title: story.title,
          content: story.content,
          featuredImage: story.featuredImage?.url,
          video: story.videoUrl,
          shortVideo: story.shortVideoUrl,
        }
      : {
          title: '',
          content: '',
        },
  });

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'featuredImage' | 'video' | 'shortVideo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue(field, file);

    if (field === 'featuredImage') {
      const dataUri = await fileToDataUri(file);
      setImagePreview(dataUri);
    } else if (field === 'video') {
      setVideoFileName(file.name);
    } else if (field === 'shortVideo') {
      setShortVideoFileName(file.name);
    }
  };

  const onSubmit = async (data: StoryFormValues) => {
    setIsSubmitting(true);
    try {
      const seller = await getSellerById(sellerId);
      if (!seller) throw new Error('Seller not found.');

      let featuredImageUrl: string | undefined = isEditMode ? story?.featuredImage?.url : undefined;
      if (data.featuredImage instanceof File) {
        featuredImageUrl = await fileToDataUri(data.featuredImage);
      }

      let videoUrl: string | undefined = isEditMode ? story?.videoUrl : undefined;
      if (data.video instanceof File) {
        videoUrl = await fileToDataUri(data.video);
      }

      let shortVideoUrl: string | undefined = isEditMode ? story?.shortVideoUrl : undefined;
      if (data.shortVideo instanceof File) {
        shortVideoUrl = await fileToDataUri(data.shortVideo);
      }
      
      const storyData = {
        title: data.title,
        content: data.content,
        author: { id: sellerId, name: seller.name },
        ...(featuredImageUrl && { featuredImage: { url: featuredImageUrl, hint: 'blog post' } }),
        ...(videoUrl && { videoUrl }),
        ...(shortVideoUrl && { shortVideoUrl }),
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
    } finally {
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
                name="featuredImage"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Featured Image (Optional)</FormLabel>
                    <div className="flex items-center gap-4">
                        <div className="w-48 h-27 bg-muted rounded-md flex items-center justify-center relative border aspect-video">
                            {imagePreview ? (
                            <Image src={imagePreview} alt="Preview" fill className="object-contain rounded-md p-1" />
                            ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <Input id="image-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'featuredImage')} className="hidden" />
                         <Button asChild variant="outline">
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <UploadCloud className="mr-2" /> Upload Image
                            </label>
                        </Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Video (Optional)</FormLabel>
                     <div className="flex items-center gap-4">
                        {videoFileName ? (
                            <div className="flex items-center gap-2 text-sm p-2 bg-secondary rounded-md">
                                <Film className="h-4 w-4" /> <span>{videoFileName}</span>
                            </div>
                        ) : isEditMode && story?.videoUrl ? (
                             <div className="flex items-center gap-2 text-sm p-2 bg-secondary rounded-md">
                                <Film className="h-4 w-4" /> <span>Existing Video</span>
                            </div>
                        ) : null}
                         <Input id="video-upload" type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" />
                         <Button asChild variant="outline">
                            <label htmlFor="video-upload" className="cursor-pointer">
                                <UploadCloud className="mr-2" /> Upload Video
                            </label>
                        </Button>
                    </div>
                    <FormDescription>Link to a longer video about your brand or process.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />

             <FormField
                control={form.control}
                name="shortVideo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Short Video (Optional)</FormLabel>
                     <div className="flex items-center gap-4">
                        {shortVideoFileName ? (
                             <div className="flex items-center gap-2 text-sm p-2 bg-secondary rounded-md">
                                <Film className="h-4 w-4" /> <span>{shortVideoFileName}</span>
                            </div>
                        ) : isEditMode && story?.shortVideoUrl ? (
                              <div className="flex items-center gap-2 text-sm p-2 bg-secondary rounded-md">
                                <Film className="h-4 w-4" /> <span>Existing Short</span>
                            </div>
                        ): null}
                        <Input id="short-video-upload" type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'shortVideo')} className="hidden" />
                         <Button asChild variant="outline">
                             <label htmlFor="short-video-upload" className="cursor-pointer">
                                <UploadCloud className="mr-2" /> Upload Short
                            </label>
                        </Button>
                    </div>
                    <FormDescription>Upload a short, vertical video (e.g., YouTube Short, Instagram Reel).</FormDescription>
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

