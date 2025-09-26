
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Eye, Heart, BookOpen, Info, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Blog } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { getBlogsBySeller, deleteBlog } from '@/lib/firebase/firestore'; 
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const statusInfo = {
  pending: { variant: 'secondary', label: 'Pending', description: 'Waiting for admin review.' },
  approved: { variant: 'default', label: 'Approved', description: 'Visible to customers.' },
  rejected: { variant: 'destructive', label: 'Rejected', description: 'Does not meet guidelines. Check for feedback.' },
} as const;


export default function SellerStoriesPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const sellerId = params.sellerId as string;

  const fetchBlogs = useCallback(async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const sellerBlogs = await getBlogsBySeller(sellerId);
      sellerBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBlogs(sellerBlogs);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast({ title: "Error", description: "Could not fetch your stories.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [sellerId, toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!blogToDelete) return;
    
    try {
      await deleteBlog(blogToDelete.id);
      setBlogs(blogs.filter(p => p.id !== blogToDelete.id));
      toast({ title: 'Story Deleted' });
    } catch (error) {
      toast({ title: "Delete Failed", description: "Could not delete the story.", variant: "destructive" });
    } finally {
      setBlogToDelete(null);
    }
  };

  const totalStories = blogs.length;
  // Mock data for analytics
  const totalViews = loading ? 0 : blogs.length > 0 ? 1234 : 0;
  const totalLikes = loading ? 0 : blogs.length > 0 ? 157 : 0;

  if (!sellerId) return <div>Loading...</div>;

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline text-gradient">My Stories</h1>
            <p className="text-muted-foreground mt-1">Share your brand's journey and connect with your customers.</p>
          </div>
          <Button asChild className="btn-primary">
            <Link href={`/dashboard/${sellerId}/blogs/new`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Story
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalStories}</div>}
                </CardContent>
            </Card>
            <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalViews.toLocaleString('en-IN')}</div>}
                </CardContent>
            </Card>
            <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalLikes.toLocaleString('en-IN')}</div>}
                </CardContent>
            </Card>
        </div>

        <div className="border rounded-lg card-modern">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    You haven't written any stories yet. <Link href={`/dashboard/${sellerId}/blogs/new`} className="text-primary underline">Create your first one</Link>.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        {blog.featuredImage ? (
                          <Image src={blog.featuredImage.url} alt={blog.title} width={48} height={48} className="aspect-square object-cover rounded-md" />
                        ) : (
                          <Newspaper className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                  </TableCell>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                         <Badge variant={statusInfo[blog.status as keyof typeof statusInfo].variant}>
                            {statusInfo[blog.status as keyof typeof statusInfo].label}
                          </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{statusInfo[blog.status as keyof typeof statusInfo].description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(blog.createdAt), 'PPP')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/${sellerId}/blogs/edit/${blog.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/blogs/${blog.id}`} target="_blank">View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBlogToDelete(blog)} className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
        
        <AlertDialog open={!!blogToDelete} onOpenChange={() => setBlogToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete the story "{blogToDelete?.title}".</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
