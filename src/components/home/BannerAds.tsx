

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBannerAds } from '@/lib/firebase/firestore';
import type { BannerAd } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BannerAdsProps {
  placement: BannerAd['placement'];
}

export function BannerAds({ placement }: BannerAdsProps) {
  const [ads, setAds] = useState<BannerAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      try {
        const fetchedAds = await getBannerAds(placement);
        setAds(fetchedAds);
      } catch (error) {
        console.error(`Error fetching banner ads for ${placement}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, [placement]);

  if (loading) {
    return (
      <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </section>
    );
  }

  if (ads.length === 0) {
    return null; // Don't render anything if there are no ads for this placement
  }

  return (
    <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {ads.map((ad) => (
        <Link href={ad.linkUrl} key={ad.id} className="group block">
          <Card className="overflow-hidden">
            <div className="relative aspect-[2/1] w-full">
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Card>
        </Link>
      ))}
    </section>
  );
}
