import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1974&auto=format&fit=crop',
    title: 'Featured Handcrafted Pottery',
    description: 'Unique designs from local artisans.',
    cta: 'Shop Now',
    link: '#',
    hint: 'handcrafted pottery'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop',
    title: 'New Arrivals: Summer Apparel',
    description: 'Light and breezy fabrics for the season.',
    cta: 'Explore Collection',
    link: '#',
    hint: 'summer apparel'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1576989462838-83c34089a597?q=80&w=2070&auto=format&fit=crop',
    title: 'Limited Time Offer',
    description: 'Get 20% off on all home decor items.',
    cta: 'View Deals',
    link: '#',
    hint: 'home decor'
  },
];

export function HeroSlider() {
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
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  data-ai-hint={slide.hint}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline">
                    {slide.title}
                  </h2>
                  <p className="mt-2 md:mt-4 max-w-lg text-lg">
                    {slide.description}
                  </p>
                  <Button asChild className="mt-6 md:mt-8" size="lg">
                    <Link href={slide.link}>{slide.cta}</Link>
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
