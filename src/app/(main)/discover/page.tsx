
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MapPin, Store, LocateFixed, Loader2 } from 'lucide-react';
import { getSellers } from '@/lib/firebase/firestore';
import type { Seller } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getDistance, type Coordinates } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type SellerWithDistance = Seller & { distance: number | null };

export default function DiscoverPage() {
  const [sellers, setSellers] = useState<SellerWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchSellersData = async (location: Coordinates | null) => {
    setLoading(true);
    try {
      const approvedSellers = (await getSellers()).filter(s => s.status === 'approved' && s.location);
      const sellersWithDistance = approvedSellers.map(seller => ({
        ...seller,
        distance: location && seller.location ? getDistance(location, seller.location) : null,
      }));

      if (location) {
        sellersWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      }
      
      setSellers(sellersWithDistance);
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      toast({ title: 'Error', description: 'Could not fetch sellers.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);
        fetchSellersData(location);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Could not get your location. Please enable location services in your browser settings.');
        fetchSellersData(null);
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };
  
  // Fetch sellers without location on initial load
  useEffect(() => {
    fetchSellersData(null);
  }, []);

  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => 
      seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          Discover Local Sellers
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find unique products from artisans and manufacturers near you.
        </p>
      </div>

       <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search sellers by name..." 
              className="w-full rounded-full pl-12 h-12 text-base" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!userLocation && (
            <Card className="mt-4 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/50">
              <div className="text-center sm:text-left">
                  <h3 className="font-semibold">Find sellers near you</h3>
                  <p className="text-sm text-muted-foreground">Allow location access to sort sellers by distance.</p>
              </div>
              <Button onClick={handleRequestLocation} disabled={isLocating}>
                  {isLocating ? <Loader2 className="mr-2 animate-spin"/> : <LocateFixed className="mr-2"/>}
                  {isLocating ? 'Locating...' : 'Use My Location'}
              </Button>
            </Card>
          )}
          {locationError && <p className="text-sm text-center text-destructive mt-2">{locationError}</p>}
       </div>

      {loading ? (
         <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-14 w-14 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                   <Skeleton className="h-5 w-24" />
                </div>
              </Card>
            ))}
          </div>
      ) : filteredSellers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map(seller => (
            <Card key={seller.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-background rounded-md border">
                        <Store className="h-6 w-6 text-primary" />
                     </div>
                     <div className="flex-1">
                        <Link href={`/sellers/${seller.id}`} className="font-semibold text-lg hover:underline">
                          {seller.name}
                        </Link>
                        {seller.location && (
                           <p className="text-sm text-muted-foreground line-clamp-1">{seller.location.address}</p>
                        )}
                     </div>
                     {seller.distance !== null && (
                       <Badge variant="outline" className="flex items-center gap-1.5 shrink-0">
                          <MapPin className="h-3.5 w-3.5" />
                          {seller.distance.toFixed(1)} km
                       </Badge>
                     )}
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">No Sellers Found</h2>
            <p className="mt-2 text-muted-foreground">
                Your search for "{searchTerm}" did not match any sellers.
            </p>
         </div>
      )}
    </div>
  );
}
