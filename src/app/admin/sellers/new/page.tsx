
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewSellerPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: 'Seller Created',
        description: 'The new seller account has been created and approved.'
    });
    router.push('/admin/sellers');
  }

  return (
    <div>
        <div className="mb-6">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href="/admin/sellers">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
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
              <Input id="name" placeholder="e.g. Acme Crafts" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" type="tel" placeholder="10-digit mobile number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pan">PAN Number</Label>
              <Input id="pan" placeholder="e.g. ABCDE1234F" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commission">Default Commission Rate (%)</Label>
              <Input id="commission" type="number" placeholder="e.g. 15" defaultValue="15" required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Create Seller</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
