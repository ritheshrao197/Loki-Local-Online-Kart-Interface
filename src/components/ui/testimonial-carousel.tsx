'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function TestimonialCarousel({ 
  testimonials, 
  title, 
  subtitle, 
  className = '',
  autoPlay = true,
  autoPlayInterval = 5000
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useState(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(nextTestimonial, autoPlayInterval);
    return () => clearInterval(interval);
  });

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-4xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <ScrollReveal direction="up" distance={30}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {title}
                </h2>
              </ScrollReveal>
            )}
            {subtitle && (
              <ScrollReveal direction="up" distance={30} delay={0.2}>
                <p className="text-lg text-muted-foreground">
                  {subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center"
            >
              <div className="relative mb-8">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/20" />
                <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
                  "{currentTestimonial.content}"
                </blockquote>
                <Quote className="absolute -bottom-4 -right-4 w-12 h-12 text-primary/20 rotate-180" />
              </div>

              <div className="flex items-center justify-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < currentTestimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                {currentTestimonial.avatar && (
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-lg">{currentTestimonial.name}</h4>
                  <p className="text-muted-foreground">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  return (
    <ScrollReveal direction="up" distance={30}>
      <div className={cn("bg-card rounded-lg p-6 shadow-sm border", className)}>
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < testimonial.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>

        <blockquote className="text-muted-foreground mb-4 italic">
          "{testimonial.content}"
        </blockquote>

        <div className="flex items-center gap-3">
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
