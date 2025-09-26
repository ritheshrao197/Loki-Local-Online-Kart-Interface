
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, MapPin, User, Mail, LogOut, Medal, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);

  const user = {
    name: 'Anjali Sharma',
    email: 'anjali.s@example.com',
    avatarUrl: 'https://picsum.photos/seed/user-anjali/200',
    fallback: 'AS',
    address: '123, Rose Villa, Mumbai, Maharashtra'
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  const handleEditProfile = () => {
    toast({
      title: "Coming Soon!",
      description: "You'll be able to edit your profile in a future update.",
    });
  }
  
  const badges = [
    { icon: Sparkles, title: 'First Purchase', description: 'Made your first order!' },
    { icon: Medal, title: 'Top Reviewer', description: 'Wrote 5 approved reviews' },
    { icon: ShieldCheck, title: 'Verified Buyer', description: 'Completed 3 successful orders' },
  ]

  return (
    <div className="container py-12">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.fallback}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
               <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
               </div>
               <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
               </div>
               <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span>{user.address}</span>
               </div>
                <Separator className="my-4"/>
                <Button variant="outline" className="w-full" onClick={handleEditProfile}>Edit Profile</Button>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>View your past and current orders.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                     <ListOrdered className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Orders Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You haven't placed any orders yet. Let's change that!</p>
                    <Button asChild className="mt-4">
                        <Link href="/">Start Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>My Rewards</CardTitle>
                    <CardDescription>Earn points and badges by shopping and engaging.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg mb-6">
                        <div>
                            <h3 className="font-semibold">Your Points</h3>
                            <p className="text-sm text-muted-foreground">Keep shopping to earn more!</p>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                            1,250
                        </div>
                    </div>
                    <h4 className="font-semibold text-md mb-4">Your Badges</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {badges.map((badge) => (
                        <div key={badge.title} className="flex items-start gap-4 rounded-lg border p-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <badge.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">{badge.title}</p>
                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
