'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { getHeroSlides } from '@/lib/firebase/firestore';
import type { HeroSlide } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

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

  // Set up the carousel API
  const onSlideChange = useCallback((api: CarouselApi) => {
    if (api) {
      setCurrentSlide(api.selectedScrollSnap());
    }
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    onSlideChange(api);
    api.on("select", () => onSlideChange(api));
  }, [api, onSlideChange]);

  if (loading) {
     return <Skeleton className="h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-app-xl" />;
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[300px] md:h-[400px] w-full bg-card border border-border rounded-lg flex flex-col items-center justify-center text-center p-4">
        <motion.h2 
          className="text-2xl font-bold font-headline text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Loki
        </motion.h2>
        <motion.p 
          className="mt-4 max-w-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your local marketplace is getting ready. Content will appear here soon!
        </motion.p>
      </div>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent className="rounded-lg overflow-hidden shadow-modern">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="rounded-lg overflow-hidden">
              <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                <motion.div
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={`/_next/image?url=${slide.imageUrl}&w=16&q=1`}
                    quality={85}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent rounded-lg flex flex-col items-start justify-center text-left text-white p-6 md:p-8">
                  <motion.h2 
                    className="text-2xl md:text-3xl font-bold font-headline max-w-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p 
                    className="mt-4 max-w-md text-base"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.7,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <Button asChild className="mt-4 btn-primary" size="lg">
                      <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 w-10 h-10 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 w-10 h-10 text-white" />
      </Carousel>
    </section>
  );
}
