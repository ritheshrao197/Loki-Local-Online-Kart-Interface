
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { CalendarIcon, Loader2, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import type { Product, Seller } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProduct, updateProduct, getSellerById, getSellers } from '@/lib/firebase/firestore';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';


const formSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters.').optional().or(z.literal('')),
  category: z.string().min(1, 'Please select a category.'),
  subcategory: z.string().optional(),
  price: z.coerce.number().positive('Price must be a positive number.'),
  discountPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  unitOfMeasure: z.enum(['piece', 'kg', 'dozen', 'litre']),
  stockAlert: z.coerce.number().int().min(0, 'Stock alert must be a non-negative number.').optional(),
  keywords: z.string().optional(),
  images: z.array(z.object({ url: z.string(), hint: z.string() })).min(1, 'At least one image is required.').max(5, 'You can upload a maximum of 5 images.'),
  brand: z.string().optional(),
  weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
  dimensions: z.object({
    length: z.coerce.number().positive().optional(),
    width: z.coerce.number().positive().optional(),
    height: z.coerce.number().positive().optional(),
  }).optional(),
  manufacturingDate: z.date().optional(),
  expiryDate: z.date().optional(),
  isGstRegistered: z.boolean().optional(),
  certification: z.string().optional(),
  shippingOptions: z.array(z.string()).optional(),
  estimatedDelivery: z.string().optional(),
  returnPolicy: z.enum(['none', '7-day', '15-day']).optional(),
  isPromoted: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  // Admin-specific field
  sellerId: z.string().optional(),
}).refine(
    (data) => {
        if (data.discountPrice && data.price) {
            return data.discountPrice <= data.price;
        }
        return true;
    },
    { message: 'Discount price cannot be greater than the original price.', path: ['discountPrice'] }
);

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  isAdmin?: boolean;
}

export function ProductForm({ product, isAdmin = false }: ProductFormProps) {
  const router = useRouter();
  const params = useParams();
  const urlSellerId = params.sellerId as string;

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>(product ? [product.category] : []);
  const [sellers, setSellers] = useState<Seller[]>([]);
  
  const isEditMode = !!product;
  const isAdminCreateMode = isAdmin && !isEditMode;

  useEffect(() => {
    if (isAdminCreateMode) {
      getSellers().then(fetchedSellers => {
        const approvedSellers = fetchedSellers.filter(s => s.status === 'approved');
        setSellers(approvedSellers);
      });
    }
  }, [isAdminCreateMode]);


  const defaultValues: Partial<ProductFormValues> = isEditMode ? {
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory || '',
    price: product.price,
    discountPrice: product.discountPrice || null,
    stock: product.stock,
    unitOfMeasure: product.unitOfMeasure,
    stockAlert: product.stockAlert || undefined,
    keywords: product.keywords || '',
    images: product.images,
    brand: product.brand || '',
    weight: product.weight || undefined,
    dimensions: product.dimensions || { length: undefined, width: undefined, height: undefined },
    manufacturingDate: product.manufacturingDate ? new Date(product.manufacturingDate) : undefined,
    expiryDate: product.expiryDate ? new Date(product.expiryDate) : undefined,
    isGstRegistered: product.isGstRegistered || false,
    certification: product.certification || '',
    shippingOptions: product.shippingOptions || [],
    returnPolicy: product.returnPolicy || 'none',
    isPromoted: product.isPromoted || false,
    isFeatured: product.isFeatured || false,
    sellerId: product.seller.id,
  } : {
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    discountPrice: null,
    stock: 0,
    stockAlert: undefined,
    unitOfMeasure: 'piece' as const,
    keywords: '',
    images: [],
    brand: '',
    weight: undefined,
    dimensions: { length: undefined, width: undefined, height: undefined },
    manufacturingDate: undefined,
    expiryDate: undefined,
    isGstRegistered: false,
    certification: '',
    shippingOptions: [],
    estimatedDelivery: '',
    returnPolicy: 'none' as const,
    isPromoted: false,
    isFeatured: false,
  };


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleGenerateDescription = async () => {
    const isValid = await form.trigger(['name', 'keywords']);
    if (!isValid) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a product name and keywords first.',
        variant: 'destructive',
      });
      return;
    }
    
    const { name, keywords } = form.getValues();
    setIsGeneratingDesc(true);
    try {
      const result = await generateProductDescription({ title: name, keywords: keywords || '' });
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
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentImages = form.getValues('images');
    if (currentImages.length + files.length > 5) {
      toast({ title: "Too many images", description: "You can upload a maximum of 5 images.", variant: "destructive" });
      return;
    }

    setIsProcessingImages(true);
    try {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      
      const newImageDataUris = await Promise.all(imagePromises);
      const newImages = newImageDataUris.map(uri => ({ url: uri, hint: 'product image' }));
      
      const updatedImages = [...currentImages, ...newImages];
      form.setValue('images', updatedImages, { shouldValidate: true });

      toast({ title: `${newImageDataUris.length} image(s) added.` });
      
      // Trigger auto-categorization with the first new image
      if (newImageDataUris[0]) {
        await handleAutoCategorize(newImageDataUris[0], form.getValues('description') || '');
      }

    } catch (error) {
      console.error(error);
      toast({ title: 'Image Processing Failed', description: 'Could not process images.', variant: 'destructive' });
    } finally {
      setIsProcessingImages(false);
    }
  };
  
  const handleAutoCategorize = async (photoDataUri: string, description: string) => {
    if (!photoDataUri) return; // Description can be optional for categorization
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

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    const sellerId = isAdmin ? (isEditMode ? product.seller.id : data.sellerId) : urlSellerId;

    if (!sellerId) {
      toast({ title: "Seller Not Selected", description: "Please select a seller for this product.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode && product) {
        // Construct a clean data object for update
        const updatedProductData: Partial<Product> = {
          name: data.name,
          description: data.description || '',
          price: data.price,
          discountPrice: data.discountPrice,
          category: data.category,
          subcategory: data.subcategory,
          stock: data.stock,
          unitOfMeasure: data.unitOfMeasure,
          stockAlert: data.stockAlert,
          keywords: data.keywords,
          images: data.images.map(img => ({ url: img.url, hint: img.hint })),
          brand: data.brand,
          weight: data.weight,
          dimensions: data.dimensions,
          manufacturingDate: data.manufacturingDate?.toISOString(),
          expiryDate: data.expiryDate?.toISOString(),
          isGstRegistered: data.isGstRegistered,
          certification: data.certification,
          shippingOptions: data.shippingOptions,
          estimatedDelivery: data.estimatedDelivery,
          returnPolicy: data.returnPolicy,
          isPromoted: data.isPromoted,
          isFeatured: data.isFeatured,
          status: isAdmin ? product.status : 'pending',
          seller: { id: product.seller.id, name: product.seller.name },
        };
        
        await updateProduct(product.id, updatedProductData);
         toast({
          title: 'Product Updated!',
          description: isAdmin ? 'Product has been updated successfully.' : 'Your product is updated and pending re-approval.',
        });
        if (isAdmin) {
            router.push(`/admin/products?updated=true`);
        } else {
            router.push(`/dashboard/${sellerId}/products?updated=true`);
        }
      } else {
        const seller = await getSellerById(sellerId);
        if (!seller) {
            throw new Error("Could not find seller details.");
        }
        const newProduct: Omit<Product, 'id'> = {
          ...data,
          seller: { id: sellerId, name: seller.name },
          status: isAdmin ? 'approved' : 'pending',
        };
        await addProduct(newProduct);
        toast({
          title: 'Product Submitted!',
          description: `Your product is pending admin approval.`,
        });
        if (isAdmin) {
          router.push(`/admin/products?newProduct=true`);
        } else {
          router.push(`/dashboard/${sellerId}/products?newProduct=true`);
        }
      }
      router.refresh();

    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "There was an error saving the product. Please try again.";
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive"
      });
       setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
     const data = form.getValues();
     setIsSubmitting(true);
     
     const sellerId = isAdmin ? data.sellerId : urlSellerId;
     
      if (!sellerId) {
        toast({ title: "Error", description: "Seller not identified.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

    try {
        const seller = await getSellerById(sellerId);
        if (!seller) throw new Error("Could not find seller details.");

        const draftProduct: Omit<Product, 'id'> = {
            name: data.name || "Untitled Draft",
            description: data.description || '',
            price: data.price || 0,
            discountPrice: data.discountPrice,
            images: data.images || [],
            category: data.category || '',
            subcategory: data.subcategory,
            seller: { id: sellerId, name: seller.name },
            status: 'draft',
            keywords: data.keywords,
            stock: data.stock || 0,
            unitOfMeasure: data.unitOfMeasure,
            stockAlert: data.stockAlert,
            brand: data.brand,
            weight: data.weight,
            dimensions: data.dimensions,
            manufacturingDate: data.manufacturingDate?.toISOString(),
            expiryDate: data.expiryDate?.toISOString(),
            isGstRegistered: data.isGstRegistered,
            certification: data.certification,
            shippingOptions: data.shippingOptions,
            estimatedDelivery: data.estimatedDelivery,
            returnPolicy: data.returnPolicy,
            isPromoted: data.isPromoted,
            isFeatured: data.isFeatured,
        };

        if (isEditMode && (product?.status === 'draft' || product?.status === 'pending' || product?.status === 'rejected')) {
            await updateProduct(product.id, draftProduct);
            toast({ title: 'Draft Updated', description: 'Your product draft has been updated.' });
        } else {
            await addProduct(draftProduct);
            toast({ title: 'Saved as Draft', description: 'Your product has been saved as a draft.' });
        }
        router.push(`/dashboard/${urlSellerId}/products?draft=true`);
        router.refresh();
    } catch (error) {
        console.error("Draft submission error:", error);
        toast({ title: "Draft Error", description: "Could not save draft.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const productCategories = ["Home Decor", "Apparel", "Food & Groceries", "Art", "Footwear", "Bath & Body", "Accessories", "Kitchenware", "Jewelry"];
  const unitsOfMeasure = [
    { value: 'piece', label: 'Per Piece' },
    { value: 'kg', label: 'Per Kg' },
    { value: 'dozen', label: 'Per Dozen' },
    { value: 'litre', label: 'Per Litre' },
  ];
   const returnPolicies = [
    { value: 'none', label: 'No Returns' },
    { value: '7-day', label: '7 Days Return' },
    { value: '15-day', label: '15 Days Return' },
  ];
  
  const imagePreviews = form.watch('images');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter the basic details for your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isAdminCreateMode && (
                   <FormField control={form.control} name="sellerId" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Seller</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a seller to assign this product to" /></SelectTrigger></FormControl>
                            <SelectContent>{sellers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormDescription>This product will be created on behalf of the selected seller.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}/>
                )}
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Handcrafted Ceramic Mug" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>{productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="subcategory" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Subcategory (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. Coffee Mugs" {...field} value={field.value ?? ''} /></FormControl>
                        </FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Description</FormLabel>
                            <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGeneratingDesc}>
                                {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Generate with AI
                            </Button>
                        </div>
                        <FormControl><Textarea placeholder="Describe your product in detail..." {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Images & Media</CardTitle>
                    <CardDescription>Upload up to 5 images for your product. The first image will be the main one.</CardDescription>
                </CardHeader>
                <CardContent>
                     <FormField control={form.control} name="images" render={() => (
                        <FormItem>
                            <FormLabel>Product Images</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                <Input type="file" id="image-upload" accept="image/*" multiple onChange={handleImageChange} className="hidden"/>
                                <Button asChild variant="outline" size="sm">
                                  <label htmlFor="image-upload" className="cursor-pointer">
                                      {isProcessingImages ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                      {isProcessingImages ? 'Processing...' : 'Add Images'}
                                  </label>
                                </Button>
                                </div>
                            </FormControl>
                            <FormDescription>Recommended dimensions: 800x800px. Max 5 images.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {imagePreviews.map((img, index) => (
                            <div key={index} className="relative group aspect-square">
                                <Image src={img.url} alt={`Preview ${index+1}`} fill className="object-cover rounded-md border"/>
                                <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Pricing & Stock</CardTitle>
                <CardDescription>Manage your product's price and inventory.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g. 499" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="discountPrice" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Discount Price (₹) (Optional)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g. 399" {...field} value={field.value ?? ''}/></FormControl>
                         <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="unitOfMeasure" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Unit of Measure</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a unit" /></SelectTrigger></FormControl>
                            <SelectContent>{unitsOfMeasure.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="stock" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g. 50" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="stockAlert" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Low Stock Alert Threshold (Optional)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 5" {...field} value={field.value ?? ''} /></FormControl>
                    <FormDescription>Receive a notification when stock falls to this level.</FormDescription>
                    </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Shipping & Delivery</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="shippingOptions" render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel>Shipping Options Available</FormLabel>
                                <FormDescription>Select the methods you support for shipping.</FormDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                            {['local', 'courier', 'pickup'].map((item) => (
                                <FormField
                                key={item}
                                control={form.control}
                                name="shippingOptions"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), item])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== item
                                                    )
                                                )
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">
                                        {item === 'local' ? 'Local Delivery' : item === 'pickup' ? 'Self Pickup' : 'Courier'}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="estimatedDelivery" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Estimated Delivery Time (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., 2-4 business days" {...field} value={field.value ?? ''} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="returnPolicy" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Return Policy</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a policy" /></SelectTrigger></FormControl>
                                <SelectContent>{returnPolicies.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </CardContent>
            </Card>
            
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <FormLabel>AI Suggested Categories</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {isCategorizing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {suggestedCategories.length > 0 ? (
                            suggestedCategories.map(cat => (
                              <Button key={cat} type="button" size="sm" variant="outline" onClick={() => form.setValue('category', cat, {shouldValidate: true})}>
                                {cat}
                              </Button>
                            ))
                        ) : !isCategorizing && <p className="text-sm text-muted-foreground">Add an image to see suggestions.</p>}
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                     <FormField control={form.control} name="brand" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Brand Name (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Loki Originals" {...field} value={field.value ?? ''} /></FormControl>
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product Weight (grams) (Optional)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 500" {...field} value={field.value ?? ''} /></FormControl>
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="manufacturingDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Manufacture Date (Optional)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Compliance</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="isGstRegistered" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Is GST Registered?</FormLabel>
                                <FormDescription>Does this product fall under GST?</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="certification" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Certification Details (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., FSSAI, Organic Certified" {...field} value={field.value ?? ''} /></FormControl>
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Marketing</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="keywords" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Keywords/Tags (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. pottery, handmade, coffee" {...field} value={field.value ?? ''} /></FormControl>
                        <FormDescription>Comma-separated keywords for better discovery.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="isPromoted" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Promote Product</FormLabel>
                                <FormDescription>Mark for special promotion (admin approval).</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="isFeatured" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Feature on Homepage</FormLabel>
                                <FormDescription>Display this in the main hero slider (admin approval).</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>
            
          </div>
        </div>

        <div className="flex justify-end gap-2 sticky bottom-0 bg-background/80 backdrop-blur-sm py-4 px-8 -mx-8 -mb-8">
            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>Clear Form</Button>
            {!isAdmin && <Button type="button" variant="secondary" onClick={handleSaveAsDraft} disabled={isSubmitting}>Save as Draft</Button>}
            <Button type="submit" disabled={isSubmitting || isProcessingImages}>
              {(isSubmitting || isProcessingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : (isAdmin ? 'Create Product' : 'Submit for Review')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
