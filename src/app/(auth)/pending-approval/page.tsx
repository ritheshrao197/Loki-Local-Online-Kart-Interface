import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Logo from '@/components/common/logo';

export default function PendingApprovalPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <Logo className="h-10 mb-4" />
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-headline">Registration Submitted!</CardTitle>
          <CardDescription>
            Thank you for registering. Your application is under review by our admin team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You will receive a notification once your account is approved. This usually takes 24-48 hours.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
