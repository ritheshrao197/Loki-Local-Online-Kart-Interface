'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface GalleryProps {
  items: GalleryItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  columns?: 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

export function Gallery({ 
  items, 
  title, 
  subtitle, 
  className = '',
  columns = 3,
  aspectRatio = 'square'
}: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-6xl mx-auto">
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
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>
        )}

        <div className={cn("grid grid-cols-1 gap-4", gridCols[columns])}>
          {items.map((item, index) => (
            <ScrollReveal 
              key={item.id} 
              direction="up" 
              distance={30} 
              delay={index * 0.1}
            >
              <motion.div
                className={cn(
                  "relative overflow-hidden rounded-lg cursor-pointer group",
                  aspectRatioClasses[aspectRatio]
                )}
                onClick={() => openLightbox(item, index)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {(item.title || item.description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.title && (
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-white/80 text-sm">{item.description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={items[currentIndex].src}
                  alt={items[currentIndex].alt}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                
                {(items[currentIndex].title || items[currentIndex].description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                    {items[currentIndex].title && (
                      <h3 className="text-white font-semibold mb-1">
                        {items[currentIndex].title}
                      </h3>
                    )}
                    {items[currentIndex].description && (
                      <p className="text-white/80 text-sm">
                        {items[currentIndex].description}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation */}
                {items.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Close button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  onClick={closeLightbox}
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Image counter */}
                {items.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {items.length}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface GalleryGridProps {
  items: GalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

export function GalleryGrid({ 
  items, 
  className = '',
  columns = 3,
  aspectRatio = 'square'
}: GalleryGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  return (
    <div className={cn("grid grid-cols-1 gap-4", gridCols[columns], className)}>
      {items.map((item, index) => (
        <ScrollReveal 
          key={item.id} 
          direction="up" 
          distance={30} 
          delay={index * 0.1}
        >
          <motion.div
            className={cn(
              "relative overflow-hidden rounded-lg group",
              aspectRatioClasses[aspectRatio]
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {(item.title || item.description) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title && (
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-white/80 text-sm">{item.description}</p>
                )}
              </div>
            )}
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  );
}
