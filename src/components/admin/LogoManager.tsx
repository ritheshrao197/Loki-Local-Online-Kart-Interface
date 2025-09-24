
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { getBrandingSettings, updateBrandingSettings } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Label } from '../ui/label';

export function LogoManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newLogoDataUri, setNewLogoDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const settings = await getBrandingSettings();
        if (settings?.logoUrl) {
          setImagePreview(settings.logoUrl);
        }
      } catch (error) {
        toast({ title: 'Error fetching branding settings', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [toast]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewLogoDataUri(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newLogoDataUri) {
      toast({ title: 'No new logo selected', description: 'Please choose a file to upload first.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBrandingSettings({ logoUrl: newLogoDataUri });
      toast({ title: 'Logo Updated Successfully' });
      setNewLogoDataUri(null); // Reset after successful submission
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
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="logo-upload">Site Logo</Label>
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
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs"/>
                </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || loading || !newLogoDataUri}>
                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                Save Logo
              </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
