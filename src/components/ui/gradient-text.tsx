'use client';

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'rainbow' | 'custom';
  customGradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

const gradients = {
  primary: 'bg-gradient-to-r from-primary to-primary/80',
  secondary: 'bg-gradient-to-r from-secondary to-secondary/80',
  accent: 'bg-gradient-to-r from-accent to-accent/80',
  rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-orange-500',
  custom: '',
};

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

export function GradientText({ 
  children, 
  className = '',
  gradient = 'primary',
  customGradient,
  size = 'md',
  weight = 'bold'
}: GradientTextProps) {
  const gradientClass = gradient === 'custom' && customGradient 
    ? customGradient 
    : gradients[gradient];

  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        gradientClass,
        sizes[size],
        weights[weight],
        className
      )}
    >
      {children}
    </span>
  );
}

interface AnimatedGradientTextProps extends GradientTextProps {
  animate?: boolean;
  duration?: number;
}

export function AnimatedGradientText({ 
  children, 
  className = '',
  gradient = 'rainbow',
  animate = true,
  duration = 3,
  ...props 
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-orange-500',
        'bg-[length:200%_auto]',
        animate && 'animate-gradient',
        className
      )}
      style={{
        animationDuration: `${duration}s`,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
