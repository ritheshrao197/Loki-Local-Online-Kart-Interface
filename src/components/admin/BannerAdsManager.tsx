

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addBannerAd, deleteBannerAd, getAllBannerAds, updateBannerAd } from '@/lib/firebase/firestore';
import type { BannerAd } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Plus, Trash2, Edit, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  imageUrl: z.any().refine(val => (typeof val === 'string' && val.length > 0) || (val instanceof FileList && val.length > 0), {
    message: 'An image is required.',
  }),
  linkUrl: z.string().min(1, 'Link URL is required.'),
  placement: z.enum(['homepage_top', 'homepage_middle', 'homepage_bottom']),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function BannerAdsManager() {
  const [ads, setAds] = useState<BannerAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<BannerAd | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      linkUrl: '/',
      placement: 'homepage_top',
      isActive: true,
    },
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const fetchedAds = await getAllBannerAds();
      setAds(fetchedAds);
    } catch (error) {
      toast({ title: 'Error fetching banner ads', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (ad: BannerAd | null = null) => {
    setEditingAd(ad);
    setImagePreview(null);
    if (ad) {
      form.reset({ ...ad, imageUrl: ad.imageUrl });
      setImagePreview(ad.imageUrl);
    } else {
      form.reset({
        title: '',
        imageUrl: undefined,
        linkUrl: '/',
        placement: 'homepage_top',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('imageUrl', event.target.files);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (typeof data.imageUrl === 'string') {
        imageUrl = data.imageUrl;
      } else if (data.imageUrl instanceof FileList && data.imageUrl.length > 0) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data.imageUrl[0]);
        });
      }

      const adData = { ...data, imageUrl };
      
      if (editingAd) {
        await updateBannerAd(editingAd.id, adData);
        toast({ title: 'Banner Ad Updated' });
      } else {
        await addBannerAd(adData);
        toast({ title: 'Banner Ad Added' });
      }
      await fetchAds();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      await deleteBannerAd(adId);
      await fetchAds();
      toast({ title: 'Banner Ad Deleted' });
    } catch (error) {
      toast({ title: 'Could not delete banner ad', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Banner Ads Management</CardTitle>
          <CardDescription>Add, edit, and manage homepage banner advertisements.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogOpen()}>
              <Plus className="mr-2" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAd ? 'Edit' : 'Add'} Banner Ad</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={() => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                       <FormControl>
                        <div className="flex items-center gap-4">
                          <div className="w-48 h-24 bg-muted rounded-md flex items-center justify-center relative">
                            {imagePreview ? 
                              <Image src={imagePreview} alt="Preview" fill className="object-contain rounded-md"/> : 
                              <Upload className="h-6 w-6 text-muted-foreground"/>}
                          </div>
                           <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title / Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Descriptive title for the banner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/products/prod_123 or https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="placement"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Placement</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a placement" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="homepage_top">Homepage Top</SelectItem>
                                    <SelectItem value="homepage_middle">Homepage Middle</SelectItem>
                                    <SelectItem value="homepage_bottom">Homepage Bottom</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                          <FormItem className="flex flex-col justify-center">
                          <FormLabel>Status</FormLabel>
                          <div className="flex items-center space-x-2 h-10">
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>{field.value ? 'Active' : 'Inactive'}</FormLabel>
                          </div>
                          </FormItem>
                      )}
                    />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : ads.length > 0 ? (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="flex items-center gap-4 rounded-lg border p-3">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  width={120}
                  height={60}
                  className="rounded-md object-contain aspect-video bg-muted"
                />
                <div className="flex-1">
                  <p className="font-semibold">{ad.title}</p>
                  <p className="text-sm text-muted-foreground">{ad.placement}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(ad)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(ad.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No banner ads have been created yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
