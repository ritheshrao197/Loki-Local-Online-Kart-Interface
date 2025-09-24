
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBrandingSettings, updateBrandingSettings } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Upload } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import Image from 'next/image';

const formSchema = z.object({
  logoUrl: z.any().refine(val => (typeof val === 'string' && val.length > 0) || (val instanceof FileList && val.length > 0), {
    message: 'A logo image is required.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function LogoManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoUrl: '',
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const settings = await getBrandingSettings();
        if (settings?.logoUrl) {
          form.setValue('logoUrl', settings.logoUrl);
          setImagePreview(settings.logoUrl);
        }
      } catch (error) {
        toast({ title: 'Error fetching branding settings', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [form, toast]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('logoUrl', event.target.files);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let newLogoUrl = '';
      if (typeof data.logoUrl === 'string') {
        newLogoUrl = data.logoUrl;
      } else if (data.logoUrl instanceof FileList && data.logoUrl.length > 0) {
        newLogoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data.logoUrl[0]);
        });
      }

      await updateBrandingSettings({ logoUrl: newLogoUrl });
      toast({ title: 'Logo Updated Successfully' });
    } catch (error) {
      toast({ title: 'An error occurred while updating the logo', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Management</CardTitle>
        <CardDescription>Upload and manage your site's logo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="logoUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Site Logo</FormLabel>
                   <FormControl>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-48 h-24 bg-muted rounded-md flex items-center justify-center relative border">
                        {imagePreview ? 
                          <Image src={imagePreview} alt="Logo Preview" fill className="object-contain rounded-md p-2"/> : 
                          <div className="text-center text-muted-foreground p-2">
                            <Upload className="h-6 w-6 mx-auto"/>
                            <p className="text-xs mt-1">Upload Logo</p>
                          </div>
                        }
                      </div>
                       <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs"/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                Save Logo
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
