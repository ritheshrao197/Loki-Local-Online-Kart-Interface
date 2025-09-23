
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
import { Separator } from '@/components/ui/separator';

export default function BuyerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation for demonstration
    if (mobile.length === 10 && otp === '1234') {
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push('/');
    } else {
        toast({
            title: 'Login Failed',
            description: 'Please enter a valid mobile number and OTP. Use 1234 as OTP for now.',
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Buyer Login</CardTitle>
          <CardDescription>
            Enter your mobile number to log in or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="password"
                required
                placeholder="Enter OTP (use 1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
           <Separator className="my-6" />
            <div className="text-center text-sm">
                Are you a seller or admin?{' '}
                <Link href="/login/admin" className="underline font-medium">
                    Login here
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
