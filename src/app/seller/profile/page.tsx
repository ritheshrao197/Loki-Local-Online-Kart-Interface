'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, Phone, Mail, MapPin, Clock, Package, ShoppingCart, Calendar, Upload, Shield, Store, Users, FileText, Headphones, BarChart3, User } from 'lucide-react';

// Mock data for seller profile
const mockSellerProfile = {
  id: 'seller-123',
  storeName: 'Fresh Local Groceries',
  businessName: 'Fresh Local Groceries Pvt. Ltd.',
  profilePicture: '/placeholder-seller.jpg',
  isVerified: true,
  ownerName: 'Rajesh Kumar',
  email: 'rajesh@freshlocal.com',
  mobile: '+91 98765 43210',
  storeAddress: '123 Main Street, Bangalore, Karnataka 560001',
  serviceArea: 'Bangalore South Zone',
  businessHours: '9:00 AM - 9:00 PM (Mon-Sun)',
  productsListed: 127,
  storeRating: 4.7,
  totalReviews: 243,
  totalOrders: 1842,
  joinedDate: '2023-05-15',
  storeBio: "Welcome to Fresh Local Groceries. We bring the best local products to your doorstep, ensuring quality and timely delivery. Our mission is to support local farmers and provide fresh, organic produce to our community.",
  featuredListings: [
    {
      id: 'prod-1',
      name: 'Organic Apples',
      price: 120,
      image: '/apple.jpg',
      rating: 4.8,
      reviews: 32
    },
    {
      id: 'prod-2',
      name: 'Farm Fresh Eggs',
      price: 80,
      image: '/eggs.jpg',
      rating: 4.9,
      reviews: 28
    },
    {
      id: 'prod-3',
      name: 'Whole Wheat Bread',
      price: 60,
      image: '/bread.jpg',
      rating: 4.6,
      reviews: 19
    }
  ],
  businessDocuments: {
    gstCertificate: '/documents/gst.pdf',
    fssaiLicense: '/documents/fssai.pdf',
    bankVerification: 'Verified'
  }
};

type SellerProfile = typeof mockSellerProfile;

export default function SellerProfilePage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<SellerProfile | null>(null);

  useEffect(() => {
    // Simulate fetching profile data
    setTimeout(() => {
      setProfile(mockSellerProfile);
      setEditedProfile(mockSellerProfile);
    }, 500);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof SellerProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

  if (!profile || !editedProfile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profilePicture} alt={profile.storeName} />
                  <AvatarFallback>{profile.storeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">{profile.storeName}</h1>
                  <p className="text-muted-foreground">{profile.businessName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {profile.isVerified && (
                      <Badge variant="default" className="bg-green-500">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Seller
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={isEditing ? handleSave : handleEdit} className="whitespace-nowrap">
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="w-5 h-5 mr-2" />
                  Contact & Basic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span className="font-medium">Owner:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.ownerName}
                      onChange={(e) => handleChange('ownerName', e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    />
                  ) : (
                    <span className="ml-2">{profile.ownerName}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.mobile}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                  {isEditing ? (
                    <textarea
                      value={editedProfile.storeAddress}
                      onChange={(e) => handleChange('storeAddress', e.target.value)}
                      className="ml-2 border rounded px-2 py-1 w-full"
                      rows={2}
                    />
                  ) : (
                    <span>{profile.storeAddress}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span className="font-medium">Service Area:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.serviceArea}
                      onChange={(e) => handleChange('serviceArea', e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    />
                  ) : (
                    <span className="ml-2">{profile.serviceArea}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.businessHours}
                      onChange={(e) => handleChange('businessHours', e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.businessHours}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Store Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Store Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Products Listed</span>
                  <span className="font-bold">{profile.productsListed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Store Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-bold">{profile.storeRating}</span>
                    <span className="text-muted-foreground ml-1">({profile.totalReviews} reviews)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Orders</span>
                  <span className="font-bold">{profile.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Joined Since</span>
                  <span className="font-bold">{new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Business Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Business Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>GST Certificate</span>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>FSSAI License</span>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bank Verification</span>
                  <Badge variant="default" className="bg-green-500">
                    {profile.businessDocuments.bankVerification}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Store Summary, Featured Listings, Action Buttons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Store Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={editedProfile.storeBio}
                    onChange={(e) => handleChange('storeBio', e.target.value)}
                    className="w-full border rounded p-3"
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.storeBio}</p>
                )}
              </CardContent>
            </Card>

            {/* Featured Listings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Featured Listings</CardTitle>
                <Button variant="link">View All Products</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.featuredListings.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-semibold">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-lg font-bold">₹{product.price}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm ml-1">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Action Center</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Package className="w-6 h-6 mb-2" />
                  Add New Product
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <ShoppingCart className="w-6 h-6 mb-2" />
                  View Orders
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Store className="w-6 h-6 mb-2" />
                  Manage Listings
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <Headphones className="w-6 h-6 mb-2" />
                  Customer Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
