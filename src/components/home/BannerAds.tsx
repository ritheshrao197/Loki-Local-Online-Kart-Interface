'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBannerAds } from '@/lib/firebase/firestore';
import type { BannerAd } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (ads.length === 0) {
    return null; // Don't render anything if there are no ads for this placement
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ads.map((ad, index) => (
        <motion.div
          key={ad.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.2,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3 }
          }}
          className="group block"
        >
          <Link href={ad.linkUrl} className="group block">
            <Card className="overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[2/1] w-full">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}