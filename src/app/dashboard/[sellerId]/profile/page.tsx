'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/common/Loader';
import { mockSellers } from '@/lib/placeholder-data';

interface SellerProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  pan: string;
  address: string;
  profilePicture: string;
  commissionRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export default function SellerProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<SellerProfile>({
    id: '',
    name: '',
    email: '',
    mobile: '',
    pan: '',
    address: '',
    profilePicture: '',
    commissionRate: 0,
    status: 'pending',
  });

  // Load seller profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch from your backend
        // For now, we'll use mock data
        const seller = mockSellers.find(s => s.id === sellerId) || mockSellers[0];
        
        if (seller) {
          const mockProfile: SellerProfile = {
            id: seller.id,
            name: seller.name,
            email: `${seller.name.replace(/\s+/g, '').toLowerCase()}@loki.com`,
            mobile: seller.mobile,
            pan: seller.pan,
            address: seller.location?.address || '',
            profilePicture: `https://picsum.photos/seed/${seller.id}/100/100`,
            commissionRate: seller.commissionRate,
            status: seller.status,
          };
          
          setProfile(mockProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (sellerId) {
      loadProfile();
    } else {
      // Redirect to dashboard if no sellerId
      router.push('/dashboard');
    }
  }, [sellerId, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // In a real app, this would save to your backend
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          profilePicture: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Seller Profile</CardTitle>
          <CardDescription>Manage your seller profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.profilePicture} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profilePicture" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>Change Picture</span>
                </Button>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, or GIF (max 2MB)
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Enter your business name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              name="mobile"
              value={profile.mobile}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
            />
          </div>

          {/* PAN */}
          <div className="space-y-2">
            <Label htmlFor="pan">PAN Number</Label>
            <Input
              id="pan"
              name="pan"
              value={profile.pan}
              onChange={handleInputChange}
              placeholder="Enter your PAN number"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              placeholder="Enter your business address"
              rows={3}
            />
          </div>

          {/* Commission Rate (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="commissionRate">Commission Rate</Label>
            <Input
              id="commissionRate"
              name="commissionRate"
              value={`${profile.commissionRate}%`}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Commission rate is set by admin
            </p>
          </div>

          {/* Status (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="status">Account Status</Label>
            <Input
              id="status"
              name="status"
              value={profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              disabled
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}