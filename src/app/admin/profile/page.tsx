'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Package, 
  ShoppingCart, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Users,
  Store
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/common/Loader';

interface AdminProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  mobile: string;
  profilePicture: string;
  activeSince: string;
  totalSellersManaged: number;
  pendingApprovals: number;
  flaggedContent: number;
  supportTickets: number;
  recentActivity: {
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }[];
  permissions: string[];
  assignedZones: string[];
}

export default function AdminProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfile>({
    id: '',
    name: '',
    role: '',
    email: '',
    mobile: '',
    profilePicture: '',
    activeSince: '',
    totalSellersManaged: 0,
    pendingApprovals: 0,
    flaggedContent: 0,
    supportTickets: 0,
    recentActivity: [],
    permissions: [],
    assignedZones: [],
  });

  // Load admin profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch from your backend
        // For now, we'll use mock data
        const mockProfile: AdminProfile = {
          id: 'admin_1',
          name: 'Admin User',
          role: 'Super Admin',
          email: 'admin@loki.com',
          mobile: '+91 98765 43210',
          profilePicture: 'https://picsum.photos/seed/avatarAdmin/200',
          activeSince: '2023-01-15',
          totalSellersManaged: 124,
          pendingApprovals: 8,
          flaggedContent: 3,
          supportTickets: 12,
          recentActivity: [
            {
              id: '1',
              action: 'Approved Seller',
              timestamp: '2025-09-25 14:30',
              details: 'Approved seller application for Artisan Fabrics Co.'
            },
            {
              id: '2',
              action: 'Reviewed Product',
              timestamp: '2025-09-25 11:15',
              details: 'Reviewed and approved product listing for Organic Turmeric Powder'
            },
            {
              id: '3',
              action: 'Resolved Issue',
              timestamp: '2025-09-24 16:45',
              details: 'Resolved customer complaint about delayed delivery'
            },
            {
              id: '4',
              action: 'Updated Policy',
              timestamp: '2025-09-24 10:20',
              details: 'Updated return policy for all sellers'
            },
            {
              id: '5',
              action: 'Verified Document',
              timestamp: '2025-09-23 13:50',
              details: 'Verified GST certificate for GreenEarth store'
            }
          ],
          permissions: [
            'Can approve sellers',
            'Moderate reviews',
            'Manage products',
            'Access analytics',
            'Handle support tickets'
          ],
          assignedZones: ['Oversees South Zone Sellers', 'Manages Premium Accounts']
        };
        
        setProfile(mockProfile);
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

    loadProfile();
  }, [toast]);

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
      setIsEditing(false);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      router.push('/login/admin');
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {isEditing ? (
                  <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.profilePicture} alt={profile.name} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="profilePicture" className="cursor-pointer mt-2">
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
                  </div>
                ) : (
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.profilePicture} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold"
                      />
                      <Input
                        name="role"
                        value={profile.role}
                        onChange={handleInputChange}
                        className="text-muted-foreground"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold">{profile.name}</h1>
                      <p className="text-muted-foreground">{profile.role}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)}>
                      <Settings className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Details */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{profile.mobile}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Admin Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Since</p>
                    <p>{new Date(profile.activeSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Assigned Zones/Responsibilities</h3>
                  <ul className="space-y-1">
                    {profile.assignedZones.map((zone, index) => (
                      <li key={index} className="text-sm">{zone}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Role Details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {profile.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Quick Stats */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{profile.totalSellersManaged}</p>
                  <p className="text-sm text-center text-muted-foreground">Sellers Managed</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <Store className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{profile.pendingApprovals}</p>
                  <p className="text-sm text-center text-muted-foreground">Pending Approvals</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{profile.flaggedContent}</p>
                  <p className="text-sm text-center text-muted-foreground">Flagged Content</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <MessageSquare className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{profile.supportTickets}</p>
                  <p className="text-sm text-center text-muted-foreground">Support Tickets</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 5 actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <div className="h-full w-0.5 bg-border"></div>
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      <p className="text-sm mt-1">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action Buttons */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Action Center</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <a href="/admin/sellers">
                    <Users className="mr-2 h-4 w-4" /> Review Seller Applications
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/admin/products">
                    <Package className="mr-2 h-4 w-4" /> Manage Products/Stores
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/admin/reports">
                    <BarChart3 className="mr-2 h-4 w-4" /> Analytics Dashboard
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/admin/disputes">
                    <ShieldCheck className="mr-2 h-4 w-4" /> Support/Moderation Tools
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}