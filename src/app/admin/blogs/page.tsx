
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Blog } from '@/lib/types';
import { getBlogs, updateBlogStatus } from '@/lib/firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Loader2, Newspaper, X } from 'lucide-react';
import Link from 'next/link';

type BlogStatus = 'pending' | 'approved' | 'rejected';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<BlogStatus>('pending');
  const { toast } = useToast();

  const fetchBlogsByStatus = async (status: BlogStatus) => {
    setLoading(true);
    try {
      const fetchedBlogs = await getBlogs(status);
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error(`Error fetching ${status} blogs:`, error);
      toast({ title: "Error", description: `Could not fetch ${status} blogs.`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsByStatus(currentTab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleStatusUpdate = async (blogId: string, newStatus: 'approved' | 'rejected') => {
    const originalBlogs = [...blogs];
    setBlogs(prev => prev.filter(b => b.id !== blogId));

    try {
      await updateBlogStatus(blogId, newStatus);
      toast({ title: `Blog ${newStatus}`, description: `The blog post has been ${newStatus}.` });
    } catch (error) {
      console.error("Error updating blog status:", error);
      toast({ title: 'Update Failed', description: 'Could not update status.', variant: 'destructive' });
      setBlogs(originalBlogs);
    }
  };

  const renderBlogList = () => {
    if (loading) {
      return Array.from({ length: 2 }).map((_, i) => <BlogModerationCardSkeleton key={i} />);
    }
    if (blogs.length > 0) {
      return blogs.map(blog => (
        <BlogModerationCard key={blog.id} blog={blog} onStatusChange={handleStatusUpdate} />
      ));
    }
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">All Clear!</h3>
        <p className="text-muted-foreground mt-1">There are no {currentTab} blog posts.</p>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Blog Moderation</h1>
        <p className="text-muted-foreground">Review and manage blog posts submitted by sellers.</p>
      </div>

      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as BlogStatus)}>
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6 space-y-6">{renderBlogList()}</TabsContent>
        <TabsContent value="approved" className="mt-6 space-y-6">{renderBlogList()}</TabsContent>
        <TabsContent value="rejected" className="mt-6 space-y-6">{renderBlogList()}</TabsContent>
      </Tabs>
    </div>
  );
}

function BlogModerationCard({ blog, onStatusChange }: { blog: Blog, onStatusChange: (id: string, status: 'approved' | 'rejected') => void }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsUpdating(true);
    await onStatusChange(blog.id, newStatus);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
        <CardDescription>By {blog.author.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content.replace(/<[^>]+>/g, '') }}/>
      </CardContent>
      <CardContent className="flex justify-end gap-2 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/blogs/${blog.id}`} target="_blank">View Post</Link>
        </Button>
        {blog.status === 'pending' && (
          <>
            <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleUpdate('rejected')} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4"/>} Reject
            </Button>
            <Button size="sm" onClick={() => handleUpdate('approved')} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4"/>} Approve
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const BlogModerationCardSkeleton = () => (
  <Card className="p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex justify-end gap-2 pt-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </div>
  </Card>
);
