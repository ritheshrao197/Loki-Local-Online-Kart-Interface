import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Promotions() {
  return (
    <section className="grid md:grid-cols-2 gap-6">
      <Link href="#" className="group">
        <Card className="relative overflow-hidden h-full">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
            alt="Seasonal Discounts"
            width={800}
            height={400}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="seasonal discounts"
          />
          <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
            <h3 className="text-2xl font-bold font-headline text-white">Seasonal Discounts</h3>
            <p className="text-white/90 mt-2">Up to 30% off on selected apparel.</p>
            <Button variant="secondary" className="mt-4 w-fit">Shop Sale</Button>
          </div>
        </Card>
      </Link>
      <Link href="#" className="group">
        <Card className="relative overflow-hidden h-full">
          <Image
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
            alt="Sponsored Manufacturer"
            width={800}
            height={400}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="sponsored manufacturer"
          />
          <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
            <h3 className="text-2xl font-bold font-headline text-white">Meet The Artisans</h3>
            <p className="text-white/90 mt-2">Discover the story behind your products.</p>
            <Button variant="secondary" className="mt-4 w-fit">Learn More</Button>
          </div>
        </Card>
      </Link>
    </section>
  );
}
