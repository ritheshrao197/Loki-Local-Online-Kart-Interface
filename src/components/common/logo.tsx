
'use client';

import { getBrandingSettings } from '@/lib/firebase/firestore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function DefaultLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100"
      height="33"
      viewBox="0 0 200 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
       <text x="5" y="55" fontFamily="Montserrat, sans-serif" fontSize="60" fontWeight="bold" fill="hsl(var(--primary))">L</text>
      <circle cx="95" cy="33" r="28" fill="#FFD655"/>
      <text x="125" y="55" fontFamily="Montserrat, sans-serif" fontSize="60" fontWeight="bold" fill="hsl(var(--primary))">KI</text>
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const settings = await getBrandingSettings();
        if (settings?.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch branding settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogo();
  }, []);

  if (loading) {
    // To prevent layout shift, we can render a placeholder with the same dimensions
    // as the logo. Let's assume a default aspect ratio if className doesn't specify size.
    return <div className={cn('h-8 w-auto', className)} style={{ aspectRatio: '100/33' }} />;
  }

  if (logoUrl) {
    return (
      <div className={cn('relative h-8 w-auto', className)} style={{ aspectRatio: '100/33' }}>
        <Image src={logoUrl} alt="Loki Logo" fill style={{ objectFit: 'contain' }} />
      </div>
    );
  }

  return <DefaultLogo className={cn('h-8 w-auto', className)} />;
}
