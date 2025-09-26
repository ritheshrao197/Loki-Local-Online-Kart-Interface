'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  className?: string;
  count?: number;
  speed?: 'slow' | 'normal' | 'fast';
}

export function LoadingDots({
  size = 'md',
  color = 'primary',
  className = '',
  count = 3,
  speed = 'normal'
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    muted: 'bg-muted-foreground',
    white: 'bg-white'
  };

  const speedClasses = {
    slow: 1.5,
    normal: 1,
    fast: 0.5
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full",
            sizeClasses[size],
            colorClasses[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: speedClasses[speed],
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

interface TypingIndicatorProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
}

export function TypingIndicator({
  message = "Typing",
  className = '',
  size = 'md',
  color = 'muted'
}: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-sm text-muted-foreground">{message}</span>
      <LoadingDots size={size} color={color} />
    </div>
  );
}

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export function PulseLoader({
  size = 'md',
  color = 'primary',
  className = ''
}: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    muted: 'bg-muted-foreground'
  };

  return (
    <motion.div
      className={cn(
        "rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

interface WaveLoaderProps {
  bars?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export function WaveLoader({
  bars = 5,
  size = 'md',
  color = 'primary',
  className = ''
}: WaveLoaderProps) {
  const sizeClasses = {
    sm: { width: '2px', height: '12px' },
    md: { width: '3px', height: '16px' },
    lg: { width: '4px', height: '20px' }
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    muted: 'bg-muted-foreground'
  };

  return (
    <div className={cn("flex items-end space-x-1", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full",
            colorClasses[color]
          )}
          style={sizeClasses[size]}
          animate={{
            height: [
              sizeClasses[size].height,
              `${parseInt(sizeClasses[size].height) * 1.5}px`,
              sizeClasses[size].height
            ],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

interface SpinnerLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
  thickness?: number;
}

export function SpinnerLoader({
  size = 'md',
  color = 'primary',
  className = '',
  thickness = 2
}: SpinnerLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    muted: 'border-muted-foreground'
  };

  return (
    <motion.div
      className={cn(
        "rounded-full border-2 border-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{ borderTopWidth: thickness }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

interface BounceLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
  count?: number;
}

export function BounceLoader({
  size = 'md',
  color = 'primary',
  className = '',
  count = 3
}: BounceLoaderProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    muted: 'bg-muted-foreground'
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full",
            sizeClasses[size],
            colorClasses[color]
          )}
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

interface RingLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
  progress?: number;
}

export function RingLoader({
  size = 'md',
  color = 'primary',
  className = '',
  progress
}: RingLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'stroke-primary',
    secondary: 'stroke-secondary',
    muted: 'stroke-muted-foreground'
  };

  const circumference = 2 * Math.PI * 20; // radius = 20
  const strokeDasharray = progress 
    ? `${(progress / 100) * circumference} ${circumference}`
    : undefined;

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 44 44"
      >
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground/20"
        />
        <motion.circle
          cx="22"
          cy="22"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className={colorClasses[color]}
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: progress 
              ? circumference - (progress / 100) * circumference
              : 0 
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      
      {progress !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}
