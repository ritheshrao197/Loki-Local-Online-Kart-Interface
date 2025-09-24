
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addHeroSlide, deleteHeroSlide, getAllHeroSlides, updateHeroSlide } from '@/lib/firebase/firestore';
import type { HeroSlide } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
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

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  subtitle: z.string().min(1, 'Subtitle is required.'),
  imageUrl: z.string().url('A valid image URL is required.'),
  ctaText: z.string().min(1, 'CTA text is required.'),
  ctaLink: z.string().min(1, 'CTA link is required.'),
  order: z.coerce.number().int(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function HeroSliderManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: 'Shop Now',
      ctaLink: '/',
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const fetchedSlides = await getAllHeroSlides();
      setSlides(fetchedSlides);
    } catch (error) {
      toast({ title: 'Error fetching slides', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (slide: HeroSlide | null = null) => {
    setEditingSlide(slide);
    if (slide) {
      form.reset(slide);
    } else {
      form.reset({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaText: 'Shop Now',
        ctaLink: '/',
        order: slides.length,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (editingSlide) {
        await updateHeroSlide(editingSlide.id, data);
        toast({ title: 'Slide Updated' });
      } else {
        await addHeroSlide(data);
        toast({ title: 'Slide Added' });
      }
      await fetchSlides();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slideId: string) => {
    try {
      await deleteHeroSlide(slideId);
      await fetchSlides();
      toast({ title: 'Slide Deleted' });
    } catch (error) {
      toast({ title: 'Could not delete slide', variant: 'destructive' });
    }
  };
  
  const handleUpdateOrder = async (slideId: string, newOrder: number) => {
    try {
      await updateHeroSlide(slideId, { order: newOrder });
      // Note: This is an optimistic update. For drag-and-drop, a more robust solution is needed.
      const updatedSlides = slides.map(s => s.id === slideId ? {...s, order: newOrder} : s);
      updatedSlides.sort((a,b) => a.order - b.order);
      setSlides(updatedSlides);
      toast({ title: 'Order updated'});
    } catch (e) {
      toast({ title: 'Failed to update order', variant: 'destructive'});
    }
  }


  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Hero Slider Management</CardTitle>
          <CardDescription>Add, edit, and reorder the slides on your homepage carousel.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogOpen()}>
              <Plus className="mr-2" /> Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit' : 'Add'} Slide</DialogTitle>
              <DialogDescription>Fill in the details for your hero slide.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Main heading" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Supporting text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="ctaText"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CTA Button Text</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Shop Now" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="ctaLink"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CTA Button Link</FormLabel>
                        <FormControl>
                            <Input placeholder="/products/prod_123" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
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
        ) : slides.length > 0 ? (
          <div className="space-y-4">
            {slides.map((slide) => (
              <div key={slide.id} className="flex items-center gap-4 rounded-lg border p-3">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  width={100}
                  height={56}
                  className="rounded-md object-cover aspect-video bg-muted"
                />
                <div className="flex-1">
                  <p className="font-semibold">{slide.title}</p>
                  <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input type="number" value={slide.order} className="w-16 h-8 text-center" onChange={(e) => handleUpdateOrder(slide.id, parseInt(e.target.value))} />
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(slide)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(slide.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No slides have been created yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
