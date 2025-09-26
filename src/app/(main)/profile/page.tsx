
'use client';

import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import type { Seller } from "@/lib/types";
import { getSellerById } from "@/lib/firebase/firestore";
import { Loader } from "@/components/common/Loader";

type UserRole = 'admin' | 'seller' | 'buyer' | null;

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole') as UserRole;
    const id = sessionStorage.getItem('userId');
    setUserRole(role);
    setUserId(id);

    if (role === 'seller' && id) {
      getSellerById(id).then(fetchedSeller => {
        setSeller(fetchedSeller);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const buyerUser = {
    name: 'Anjali Sharma',
    email: 'anjali.s@example.com',
    avatarUrl: 'https://picsum.photos/seed/user-anjali/200',
    fallback: 'AS',
    address: '123, Rose Villa, Mumbai, Maharashtra'
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      router.push('/login');
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
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
  ];

  if (loading) {
    return <Loader />;
  }

  // Seller Profile View
  if (userRole === 'seller' && seller) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://picsum.photos/seed/${seller.id}/200`} alt={seller.name} />
                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{seller.name}</h1>
                        <p className="text-muted-foreground">{seller.mobile}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                     <Button variant="outline" asChild>
                        <Link href={`/sellers/${seller.id}`}>View Public Profile</Link>
                    </Button>
                    <Button onClick={handleEditProfile}>Edit Profile</Button>
                </div>
            </div>
            {/* Seller-specific content can go here, for now it's simple */}
             <Card>
                <CardHeader>
                    <CardTitle>Seller Account</CardTitle>
                    <CardDescription>Manage your seller account and settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleLogout}><LogOut className="mr-2"/> Logout</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  // Buyer Profile View
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="flex items-center gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={buyerUser.avatarUrl} alt={buyerUser.name} />
            <AvatarFallback>{buyerUser.fallback}</AvatarFallback>
          </Avatar>
        </motion.div>
        <div>
          <motion.h1 
            className="text-3xl font-bold font-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {buyerUser.name}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {buyerUser.email}
          </motion.p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
               <motion.div 
                 className="flex items-center gap-3"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3, delay: 0.5 }}
               >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{buyerUser.name}</span>
               </motion.div>
               <motion.div 
                 className="flex items-center gap-3"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3, delay: 0.6 }}
               >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{buyerUser.email}</span>
               </motion.div>
               <motion.div 
                 className="flex items-start gap-3"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3, delay: 0.7 }}
               >
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span>{buyerUser.address}</span>
               </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <Separator className="my-4"/>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <Button variant="outline" className="w-full" onClick={handleEditProfile}>Edit Profile</Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                >
                  <Button 
                    variant="ghost" 
                    className="w-full text-destructive hover:text-destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>View your past and current orders.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                     <motion.div
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ duration: 0.5, delay: 0.6 }}
                     >
                       <ListOrdered className="mx-auto h-12 w-12 text-muted-foreground" />
                     </motion.div>
                    <motion.h3 
                      className="mt-4 text-lg font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      No Orders Yet
                    </motion.h3>
                    <motion.p 
                      className="mt-1 text-sm text-muted-foreground"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      You haven't placed any orders yet. Let's change that!
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <Button asChild className="mt-4">
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Rewards</CardTitle>
                  <CardDescription>Earn points and badges by shopping and engaging.</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div>
                      <h3 className="font-semibold">Your Points</h3>
                      <p className="text-sm text-muted-foreground">Keep shopping to earn more!</p>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      1,250
                    </div>
                  </motion.div>
                  <motion.h4 
                    className="font-semibold text-md mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    Your Badges
                  </motion.h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map((badge, index) => (
                      <motion.div 
                        key={badge.title} 
                        className="flex items-start gap-4 rounded-lg border p-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                        whileHover={{ 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div
                          className="p-2 bg-primary/10 rounded-full"
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <badge.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <div>
                          <p className="font-semibold">{badge.title}</p>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
