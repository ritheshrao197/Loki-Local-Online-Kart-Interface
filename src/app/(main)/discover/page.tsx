'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MapPin, Store } from 'lucide-react';
import { getSellers } from '@/lib/firebase/firestore';
import type { Seller } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const DiscoverMap = dynamic(() => import('@/components/discover/DiscoverMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full bg-muted" />,
});

export default function DiscoverPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  useEffect(() => {
    const fetchSellersData = async () => {
      setLoading(true);
      try {
        const approvedSellers = (await getSellers()).filter(s => s.status === 'approved' && s.location);
        setSellers(approvedSellers);
        if (approvedSellers.length > 0) {
          setSelectedSeller(approvedSellers[0]);
        }
      } catch (error) {
        console.error('Failed to fetch sellers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellersData();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold font-headline">Discover Sellers</h1>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or category" className="pl-10" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {sellers.map(seller => (
                <button
                  key={seller.id}
                  onClick={() => setSelectedSeller(seller)}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-4 ${
                    selectedSeller?.id === seller.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                  }`}
                >
                  <div className="p-3 bg-background rounded-md border">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{seller.location?.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <DiscoverMap sellers={sellers} selectedSeller={selectedSeller} />

        {/* Selected Seller Card */}
        {selectedSeller && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[1000]">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-24 h-24 relative rounded-md overflow-hidden bg-secondary">
                  <Image
                    src={`https://picsum.photos/seed/${selectedSeller.id}/200`}
                    alt={selectedSeller.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold font-headline text-lg">{selectedSeller.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-start gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{selectedSeller.location?.address}</span>
                  </p>
                  <Button size="sm" className="mt-3">View Store</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
