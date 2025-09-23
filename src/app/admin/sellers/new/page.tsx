
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { addSeller } from '@/lib/firebase/firestore';
import type { Seller } from '@/lib/types';

export default function NewSellerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const mobile = formData.get('mobile') as string;
    const pan = formData.get('pan') as string;
    const commission = formData.get('commission') as string;

    const newSellerData: Omit<Seller, 'id'> = {
      name,
      mobile,
      pan,
      commissionRate: parseFloat(commission),
      status: 'approved',
    };

    try {
      await addSeller(newSellerData);
      toast({
        title: 'Seller Created',
        description: 'The new seller account has been created and approved.',
      });

      // Redirect with a query param to trigger a refetch on the sellers page.
      const params = new URLSearchParams({
        newSellerName: name,
      });
      router.push(`/admin/sellers?${params.toString()}`);

    } catch (error) {
      console.error("Error adding seller: ", error);
      toast({
        title: 'Error',
        description: 'Failed to create seller. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/admin/sellers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sellers
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Add New Seller</h1>
        <p className="text-muted-foreground">Manually onboard a new seller to the platform.</p>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
          <CardDescription>
            Fill in the details to create a new seller account. The account will be approved by default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name / Company Name</Label>
              <Input id="name" name="name" placeholder="e.g. Acme Crafts" required disabled={loading}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" type="tel" placeholder="10-digit mobile number" required disabled={loading}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pan">PAN Number</Label>
              <Input id="pan" name="pan" placeholder="e.g. ABCDE1234F" required disabled={loading}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commission">Default Commission Rate (%)</Label>
              <Input id="commission" name="commission" type="number" placeholder="e.g. 15" defaultValue="15" required disabled={loading}/>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 animate-spin" />}
                {loading ? 'Creating...' : 'Create Seller'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
