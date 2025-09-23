
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, MapPin, User, Mail, LogOut } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const user = {
    name: 'Anjali Sharma',
    email: 'anjali.s@example.com',
    avatarUrl: 'https://picsum.photos/seed/user-anjali/200',
    fallback: 'AS',
    address: '123, Rose Villa, Mumbai, Maharashtra'
  };

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
                <Button variant="outline" className="w-full">Edit Profile</Button>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
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
        </div>
      </div>
    </div>
  );
}
