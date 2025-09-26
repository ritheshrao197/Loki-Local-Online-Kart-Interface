'use client';

import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
}

export function Glassmorphism({ 
  children, 
  className = '',
  blur = 'md',
  opacity = 0.1,
  border = true
}: GlassmorphismProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={cn(
        'relative',
        blurClasses[blur],
        'bg-white/10',
        border && 'border border-white/20',
        'rounded-lg',
        className
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {children}
    </div>
  );
}

interface GlassmorphismCardProps extends GlassmorphismProps {
  title?: string;
  description?: string;
}

export function GlassmorphismCard({ 
  children, 
  title,
  description,
  className = '',
  ...props 
}: GlassmorphismCardProps) {
  return (
    <Glassmorphism className={cn('p-6', className)} {...props}>
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      )}
      {description && (
        <p className="text-white/80 mb-4">{description}</p>
      )}
      {children}
    </Glassmorphism>
  );
}

interface GlassmorphismButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function GlassmorphismButton({ 
  children, 
  onClick,
  className = '',
  disabled = false
}: GlassmorphismButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-6 py-3',
        'backdrop-blur-md',
        'bg-white/10',
        'border border-white/20',
        'rounded-lg',
        'text-white',
        'font-medium',
        'transition-all duration-200',
        'hover:bg-white/20',
        'hover:border-white/30',
        'active:scale-95',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
