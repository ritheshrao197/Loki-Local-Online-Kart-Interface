
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-8 w-auto', className)} style={{ aspectRatio: '200/66' }}>
      <Image 
        src="/images/logo.svg" 
        alt="Loki Logo" 
        fill 
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
}
