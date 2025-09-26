
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Blog } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { getBlogsBySeller, deleteBlog } from '@/lib/firebase/firestore'; 
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
} as const;

export default function SellerStoriesPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
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

  if (!sellerId) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">My Stories</h1>
        <Button asChild>
          <Link href={`/dashboard/${sellerId}/blogs/new`}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Story
          </Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
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
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  You haven't written any stories yet. <Link href={`/dashboard/${sellerId}/blogs/new`} className="text-primary underline">Create your first one</Link>.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>
                  <Badge variant={blog.status as keyof typeof statusVariant}>
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </Badge>
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
  );
}
