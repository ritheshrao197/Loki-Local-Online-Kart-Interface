
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Blog } from '@/lib/types';
import { addBlog, updateBlog, getSellerById } from '@/lib/firebase/firestore';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(100, 'Content must be at least 100 characters long.'),
  // In a real app, you'd handle file uploads properly. For now, we'll use a placeholder URL.
  featuredImageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  blog?: Blog;
  sellerId: string;
}

export function BlogForm({ blog, sellerId }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!blog;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          title: blog.title,
          content: blog.content,
          featuredImageUrl: blog.featuredImage?.url || '',
        }
      : {
          title: '',
          content: '',
          featuredImageUrl: '',
        },
  });

  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      const seller = await getSellerById(sellerId);
      if (!seller) throw new Error('Seller not found.');

      const blogData = {
        title: data.title,
        content: data.content,
        author: { id: sellerId, name: seller.name },
        status: 'pending' as const,
        ...(data.featuredImageUrl && { 
            featuredImage: { url: data.featuredImageUrl, hint: 'blog post' } 
        }),
      };

      if (isEditMode) {
        await updateBlog(blog.id, blogData);
        toast({ title: 'Blog Post Updated', description: 'Your changes are pending re-approval.' });
      } else {
        await addBlog(blogData);
        toast({ title: 'Blog Post Submitted', description: 'Your post is pending admin approval.' });
      }
      router.push(`/dashboard/${sellerId}/blogs`);
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({ title: "Submission Error", description: "Could not save the blog post.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Details</CardTitle>
            <CardDescription>Fill in the details for your new post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A catchy title for your post" {...field} />
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
