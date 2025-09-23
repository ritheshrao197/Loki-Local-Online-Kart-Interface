'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = mobile.toLowerCase();

    if (user === 'admin') {
      toast({ title: 'Admin Login Successful' });
      router.push('/admin');
    } else if (user === 'seller') {
      toast({ title: 'Seller Login Successful' });
      router.push('/dashboard');
    } else if (user === 'buyer') {
      toast({ title: 'Login Successful' });
      router.push('/');
    } else {
      toast({
        title: 'Invalid Credentials',
        description: 'Use "admin", "seller", or "buyer" to log in.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mobile">Username</Label>
              <Input
                id="mobile"
                type="text"
                placeholder="Use 'admin', 'seller', or 'buyer'"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otp">Password</Label>
              <Input
                id="otp"
                type="password"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Can be left blank for now"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Not a seller yet?{' '}
            <Link href="/seller-signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
