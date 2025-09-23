import Link from 'next/link';
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

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Seller Login</CardTitle>
          <CardDescription>
            Enter your mobile number to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="98765 43210"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input id="otp" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Not a seller yet?{' '}
            <Link href="/auth/seller-signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
