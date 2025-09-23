
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { autoCategorizeProduct } from '@/ai/flows/auto-categorize-product';
import { Loader2, Sparkles, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProduct, updateProduct } from '@/lib/firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  keywords: z.string().min(3, 'Please provide at least one keyword.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(1, 'Price must be greater than 0.'),
  category: z.string().min(1, 'Please select a category.'),
  image: z.any().refine(files => files?.length > 0 || typeof files === 'string', 'Image is required.'),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>(product ? [product.category] : []);
  const [imageDataUri, setImageDataUri] = useState<string | null>(product ? product.images[0].url : null);
  
  const isEditMode = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode ? {
        name: product.name,
        keywords: product.keywords || '',
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.images[0].url,
    } : {
      name: '',
      keywords: '',
      description: '',
      price: 0,
      category: '',
      image: undefined,
    },
  });

  const handleGenerateDescription = async () => {
    const { name, keywords } = form.getValues();
    if (!name || !keywords) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a product name and keywords first.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const result = await generateProductDescription({ title: name, keywords });
      form.setValue('description', result.description, { shouldValidate: true });
      toast({
        title: 'Description Generated!',
        description: 'The AI-powered description has been added.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate a description at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImageDataUri(dataUri);
        handleAutoCategorize(dataUri, form.getValues('description'));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAutoCategorize = async (photoDataUri: string, description: string) => {
    if (!photoDataUri || !description) return;
    setIsCategorizing(true);
    try {
      const result = await autoCategorizeProduct({ photoDataUri, description });
      setSuggestedCategories(result.suggestedCategories);
      if(result.suggestedCategories.length > 0 && !form.getValues('category')) {
        form.setValue('category', result.suggestedCategories[0]);
      }
    } catch (error) {
        console.error(error);
        toast({ title: 'Categorization Failed', description: 'Could not suggest categories.', variant: 'destructive' });
    } finally {
        setIsCategorizing(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Use a random placeholder for the image unless one is uploaded
      const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
      const image = imageDataUri
        ? { url: imageDataUri, hint: 'custom image' }
        : { url: randomImage.imageUrl, hint: randomImage.imageHint };
        
      if (isEditMode && product) {
        const updatedProductData: Partial<Product> = {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          keywords: data.keywords,
          images: imageDataUri ? [image] : product.images,
          status: 'pending', // After edit, it should be re-approved.
        };
        await updateProduct(product.id, updatedProductData);
      } else {
        const newProduct: Omit<Product, 'id'> = {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          keywords: data.keywords,
          images: [image],
          seller: { id: 'seller_1', name: 'Artisan Crafts Co.' }, // Mock seller
          status: 'pending',
        };
        await addProduct(newProduct);
      }
      
      toast({
        title: isEditMode ? 'Product Updated!' : 'Product Submitted!',
        description: `Your product is ${isEditMode ? 'updated and pending re-approval' : 'pending admin approval'}.`,
      });
      router.push('/dashboard/products');
      router.refresh();

    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Error",
        description: "There was an error saving the product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const productCategories = ["Home Decor", "Apparel", "Food & Groceries", "Art", "Footwear", "Bath & Body", "Accessories", "Kitchenware", "Jewelry"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Enter the name, description, and keywords for your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Handcrafted Ceramic Mug" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl><Input placeholder="e.g. pottery, handmade, coffee" {...field} /></FormControl>
                      <FormDescription>Comma-separated keywords for better discovery.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Description</FormLabel>
                            <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGeneratingDesc}>
                                {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Generate with AI
                            </Button>
                        </div>
                        <FormControl><Textarea rows={6} placeholder="Describe your product..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Image & Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={handleImageChange} />
                            </FormControl>
                             {isEditMode && <FormDescription>Leave blank to keep the current image.</FormDescription>}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {imageDataUri && <img src={imageDataUri} alt="Preview" className="rounded-md object-cover aspect-video"/>}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                    <FormLabel>AI Suggested Categories</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {isCategorizing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {suggestedCategories.length > 0 ? (
                            suggestedCategories.map(cat => (
                              <Button key={cat} type="button" size="sm" variant="outline" onClick={() => form.setValue('category', cat, {shouldValidate: true})}>
                                {cat}
                              </Button>
                            ))
                        ) : !isCategorizing && <p className="text-sm text-muted-foreground">Upload an image and add a description to see suggestions.</p>}
                    </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (INR)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g. 499" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Submit for Review'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
