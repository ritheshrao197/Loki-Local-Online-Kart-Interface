'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Loader2, Sparkles, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { adminReviewProductListing, type AdminReviewProductListingOutput } from '@/ai/flows/admin-review-product-listing';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface ProductModerationCardProps {
  product: Product;
  onStatusChange: (productId: string, newStatus: 'approved' | 'rejected') => void;
}

// Helper to convert image URL to data URI via a proxy if needed
async function toDataURL(url: string): Promise<string> {
    // In a real-world scenario, especially with browser security (CORS),
    // it's often better to have a server-side endpoint act as a proxy.
    // For this example, we'll try a direct fetch, which might fail for some URLs.
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("CORS or network error fetching image for AI review:", error);
        // Fallback or error handling. We'll throw to be caught by the caller.
        throw new Error("Could not load image for AI review due to browser security restrictions (CORS).");
    }
}


export function ProductModerationCard({ product, onStatusChange }: ProductModerationCardProps) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [review, setReview] = useState<AdminReviewProductListingOutput | null>(null);
  const { toast } = useToast();
  
  const handleReview = async () => {
    setIsReviewing(true);
    setReview(null);
    try {
      const imageUrl = product.images[0].url;
      const productImageUrl = await toDataURL(imageUrl);

      const result = await adminReviewProductListing({
        productName: product.name,
        productDescription: product.description,
        productImageUrl,
        productPrice: product.price,
        sellerInfo: product.seller.name,
      });
      setReview(result);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'AI Review Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsUpdating(true);
    await onStatusChange(product.id, newStatus);
    //setIsUpdating(false); // The component will be unmounted, so no need to set state
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>Sold by {product.seller.name} for ₹{product.price.toLocaleString('en-IN')}</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Image
            src={product.images[0].url}
            alt={product.name}
            width={300}
            height={300}
            className="rounded-md aspect-square object-cover w-full"
            data-ai-hint={product.images[0].hint}
          />
        </div>
        <div className="md:col-span-2 space-y-4">
            <p className="text-sm text-muted-foreground leading-6 line-clamp-4">{product.description}</p>
            <Button onClick={handleReview} disabled={isReviewing || isUpdating}>
                {isReviewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Run AI Review
            </Button>
            {review && (
                <div className="mt-4 border rounded-lg p-4 space-y-4 bg-secondary/50">
                    <h4 className="font-semibold font-headline">AI Analysis</h4>
                    
                    <p className="text-sm"><strong className="font-medium">Summary:</strong> {review.summary}</p>
                    
                    <div>
                        <strong className="font-medium text-sm">Violations:</strong>
                        {review.flaggedViolations && review.flaggedViolations.length > 0 && review.flaggedViolations[0] !== 'None' ? (
                            <ul className="list-disc list-inside mt-1">
                                {review.flaggedViolations.map((v, i) => (
                                    <li key={i} className="text-sm text-destructive flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0"/> <span>{v}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-1">None detected.</p>
                        )}
                    </div>
                    
                    <Separator />

                    <div className="flex items-center gap-2">
                        <strong className="font-medium text-sm">Recommendation:</strong>
                        <Badge variant={review.isApproved ? 'default' : 'destructive'}>
                            {review.isApproved ? <ThumbsUp className="mr-2 h-4 w-4"/> : <ThumbsDown className="mr-2 h-4 w-4"/>}
                            {review.isApproved ? 'Approve' : 'Reject'}
                        </Badge>
                    </div>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleStatusUpdate('rejected')} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4"/>}
             Reject
        </Button>
        <Button size="sm" onClick={() => handleStatusUpdate('approved')} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4"/>}
             Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
