'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageIcon, AlertTriangle } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
  skeletonClassName?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  onLoad,
  onError,
  fallback,
  showSkeleton = true,
  skeletonClassName = ''
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const imageProps = {
    ref: imgRef,
    src: isInView ? src : undefined,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoaded ? 'opacity-100' : 'opacity-0',
      className
    ),
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes }),
    ...(quality && { quality }),
    ...(blurDataURL && { 'data-blur': blurDataURL })
  };

  if (isError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        {fallback || (
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">Failed to load</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', fill ? 'absolute inset-0' : '')}
      style={!fill ? { width, height } : undefined}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && (placeholder || blurDataURL) && (
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center bg-no-repeat',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          style={{
            backgroundImage: `url(${blurDataURL || placeholder})`,
            filter: blurDataURL ? 'blur(10px)' : 'none'
          }}
        />
      )}

      {/* Skeleton */}
      {!isLoaded && showSkeleton && !placeholder && !blurDataURL && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            skeletonClassName
          )}
        >
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
        </motion.div>
      )}

      {/* Actual Image */}
      <AnimatePresence>
        {isInView && (
          <motion.img
            {...imageProps}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Optimized image with Next.js Image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  onLoad,
  onError,
  fallback
}: OptimizedImageProps) {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  if (isError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        {fallback || (
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">Failed to load</p>
          </div>
        )}
      </div>
    );
  }

  // Use Next.js Image component for optimization
  const ImageComponent = require('next/image').default;
  
  return (
    <ImageComponent
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      priority={priority}
      quality={quality}
      sizes={sizes}
      fill={fill}
      onLoad={onLoad}
      onError={handleError}
    />
  );
}

// Image gallery with lazy loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  className?: string;
  thumbnailClassName?: string;
  onImageClick?: (index: number) => void;
}

export function ImageGallery({
  images,
  className = '',
  thumbnailClassName = '',
  onImageClick
}: ImageGalleryProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative aspect-square cursor-pointer group"
          onClick={() => onImageClick?.(index)}
        >
          <LazyImage
            src={image.thumbnail || image.src}
            alt={image.alt}
            fill
            className={cn(
              'rounded-lg object-cover transition-transform duration-300 group-hover:scale-105',
              thumbnailClassName
            )}
            showSkeleton={true}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}

// Progressive image loading
interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lowQualitySrc?: string;
  highQualitySrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  lowQualitySrc,
  highQualitySrc,
  onLoad,
  onError
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  const handleHighQualityLoad = () => {
    setIsHighQualityLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  useEffect(() => {
    if (highQualitySrc && highQualitySrc !== currentSrc) {
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(highQualitySrc);
        handleHighQualityLoad();
      };
      img.onerror = handleError;
      img.src = highQualitySrc;
    }
  }, [highQualitySrc, currentSrc]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Low quality image */}
      {lowQualitySrc && !isHighQualityLoaded && (
        <img
          src={lowQualitySrc}
          alt={alt}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
        />
      )}
      
      {/* High quality image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          isHighQualityLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onError={handleError}
      />
    </div>
  );
}

// Image with zoom functionality
interface ZoomableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  zoomLevel?: number;
  onZoom?: (isZoomed: boolean) => void;
}

export function ZoomableImage({
  src,
  alt,
  width,
  height,
  className = '',
  zoomLevel = 2,
  onZoom
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClick = () => {
    const newZoomed = !isZoomed;
    setIsZoomed(newZoomed);
    onZoom?.(newZoomed);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden cursor-zoom-in',
        isZoomed && 'cursor-zoom-out',
        className
      )}
      style={{ width, height }}
      onClick={handleClick}
    >
      <LazyImage
        src={src}
        alt={alt}
        fill
        className={cn(
          'object-cover transition-transform duration-300',
          isZoomed ? `scale-${zoomLevel}` : 'scale-100'
        )}
      />
    </div>
  );
}
