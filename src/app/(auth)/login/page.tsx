
'use client';

import { useState, useEffect } from 'react';
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
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { app } from '@/lib/firebase/firebase';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/common/logo';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

export default function BuyerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, you can proceed with phone number sign-in.
        }
      });
    }
  }, [auth]);


  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
        const phoneNumber = "+91" + mobile;
        const verifier = window.recaptchaVerifier;
        if (!verifier) {
            throw new Error("Recaptcha verifier not initialized.");
        }
        
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        window.confirmationResult = confirmationResult;
        
        setOtpSent(true);
        toast({ title: 'OTP Sent', description: 'An OTP has been sent to your mobile number.' });

    } catch (error: any) {
        console.error("Error sending OTP:", error);
        toast({
            title: 'OTP Send Failed',
            description: error.message || 'Please check the mobile number and try again.',
            variant: 'destructive',
        });
        // It's good practice to render a new verifier if it fails
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then((widgetId) => {
                // @ts-ignore
                window.recaptchaWidgetId = widgetId;
            });
        }
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    if (!window.confirmationResult) {
        toast({ title: 'Error', description: 'No OTP confirmation result found.', variant: 'destructive'});
        setLoading(false);
        return;
    }

    try {
        await window.confirmationResult.confirm(otp);
        router.push('/');
        toast({ title: 'Login Successful', description: 'Welcome back!' });
    } catch (error: any) {
         console.error("Error verifying OTP:", error);
        toast({
            title: 'Login Failed',
            description: 'The OTP you entered is incorrect. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="items-center text-center">
          <Logo className="h-10 mb-4" />
          <CardTitle className="text-2xl font-headline">Buyer Login</CardTitle>
          <CardDescription>
            {otpSent ? 'Enter the OTP sent to your mobile.' : 'Enter your mobile number to log in or create an account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex items-center">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground">+91</span>
                    <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="rounded-l-none"
                    />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                 {loading && <Loader2 className="mr-2 animate-spin"/>}
                 Send OTP
              </Button>
            </form>
          ) : (
             <form onSubmit={handleVerifyOtp} className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                    id="otp"
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 animate-spin"/>}
                    Verify OTP & Login
                </Button>
                <Button variant="link" size="sm" onClick={() => setOtpSent(false)} disabled={loading}>
                    Back to mobile number
                </Button>
            </form>
          )}

           <Separator className="my-6" />
            <div className="text-center text-sm">
                Are you a seller or admin?{' '}
                <Link href="/login/admin" className="underline font-medium">
                    Login here
                </Link>
            </div>
        </CardContent>
      </Card>
      <div id="recaptcha-container"></div>
    </div>
  );
}
