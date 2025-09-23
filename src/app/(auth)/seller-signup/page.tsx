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

export default function SellerSignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Become a Loki Seller</CardTitle>
          <CardDescription>
            Join our community of local manufacturers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
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
            <Button type="submit" className="w-full" asChild>
                <Link href="/auth/pending-approval">Register</Link>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">
                By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
            <div className="text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="underline font-medium">
                    Log In
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
