
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Logo from '@/components/common/logo';

export default function SellerSignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/pending-approval');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center items-center">
          <Logo className="h-10 mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">Become a Loki Seller</CardTitle>
          <CardDescription>
            Join our community of local manufacturers.
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
            <Button type="submit" className="w-full">
                Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">
                By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
            <div className="text-sm">
                Already have an account?{' '}
                <Link href="/login/admin" className="underline font-medium">
                    Log In
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
