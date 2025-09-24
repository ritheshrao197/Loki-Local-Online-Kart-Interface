

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { getHeroSlides } from '@/lib/firebase/firestore';
import type { HeroSlide } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const fetchedSlides = await getHeroSlides();
        setSlides(fetchedSlides);
      } catch (error) {
        console.error("Error fetching hero slides:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  if (loading) {
     return <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full" />;
  }

  if (slides.length === 0) {
    return (
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full bg-secondary flex flex-col items-center justify-center text-center p-4">
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-secondary-foreground">
                Loki Marketplace
              </h2>
              <p className="mt-2 md:mt-4 max-w-lg text-lg text-secondary-foreground/80">
                No featured content yet. Check back soon!
              </p>
        </div>
    );
  }

  return (
    <section className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline">
                    {slide.title}
                  </h2>
                  <p className="mt-2 md:mt-4 max-w-lg text-lg">
                    {slide.subtitle}
                  </p>
                  <Button asChild className="mt-6 md:mt-8" size="lg">
                    <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
      </Carousel>
    </section>
  );
}
