'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'default',
  animation = 'pulse',
  width,
  height,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-muted';
  
  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: ''
  };

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...props}
    />
  );
}

// Predefined skeleton components
export function AvatarSkeleton({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function TextSkeleton({ 
  lines = 1, 
  className = '',
  lineHeight = 20,
  spacing = 8
}: { 
  lines?: number; 
  className?: string;
  lineHeight?: number;
  spacing?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          className={cn(
            i === lines - 1 ? "w-3/4" : "w-full",
            i === 0 && lines > 1 ? "w-5/6" : ""
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="space-y-4">
        <Skeleton height={200} className="w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton height={24} className="w-3/4" />
          <Skeleton height={16} className="w-1/2" />
          <Skeleton height={16} className="w-2/3" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton height={32} className="w-20" />
          <Skeleton height={32} className="w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      <Skeleton height={200} className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height={20} className="w-3/4" />
        <Skeleton height={16} className="w-1/2" />
        <div className="flex justify-between items-center">
          <Skeleton height={24} className="w-16" />
          <Skeleton height={32} className="w-20" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={20} className="flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              height={16} 
              className={cn(
                "flex-1",
                colIndex === 0 ? "w-1/3" : ""
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ 
  items = 5, 
  showAvatar = true,
  className = '' 
}: { 
  items?: number; 
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {showAvatar && <AvatarSkeleton size={40} />}
          <div className="flex-1 space-y-2">
            <Skeleton height={16} className="w-3/4" />
            <Skeleton height={14} className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ 
  fields = 4, 
  showSubmit = true,
  className = '' 
}: { 
  fields?: number; 
  showSubmit?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={16} className="w-1/4" />
          <Skeleton height={40} className="w-full" />
        </div>
      ))}
      
      {showSubmit && (
        <div className="flex justify-end space-x-4">
          <Skeleton height={40} className="w-20" />
          <Skeleton height={40} className="w-24" />
        </div>
      )}
    </div>
  );
}

export function DashboardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton height={32} className="w-1/3" />
        <Skeleton height={16} className="w-1/2" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <Skeleton height={16} className="w-1/2" />
              <Skeleton height={24} className="w-3/4" />
              <Skeleton height={12} className="w-1/3" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <Skeleton height={20} className="w-1/4" />
          <Skeleton height={200} className="w-full" />
        </div>
      </div>
      
      {/* Table */}
      <div className="rounded-lg border bg-card p-6">
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  );
}

export function PageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Page Header */}
      <div className="space-y-4">
        <Skeleton height={40} className="w-1/3" />
        <Skeleton height={20} className="w-1/2" />
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

// Loading states for specific components
export function ProductGridSkeleton({ 
  items = 8, 
  className = '' 
}: { 
  items?: number; 
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogPostSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <Skeleton height={300} className="w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton height={32} className="w-3/4" />
        <div className="flex items-center space-x-4">
          <AvatarSkeleton size={32} />
          <Skeleton height={16} className="w-24" />
          <Skeleton height={16} className="w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton height={16} className="w-full" />
          <Skeleton height={16} className="w-full" />
          <Skeleton height={16} className="w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn("flex space-x-4", className)}>
      <AvatarSkeleton size={40} />
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton height={16} className="w-24" />
          <Skeleton height={12} className="w-16" />
        </div>
        <Skeleton height={16} className="w-full" />
        <Skeleton height={16} className="w-2/3" />
      </div>
    </div>
  );
}
