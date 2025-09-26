'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FloatingElement } from '@/components/ui/floating-elements';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  backgroundImage?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'dark' | 'light';
}

export function CTASection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundImage,
  className = '',
  variant = 'default'
}: CTASectionProps) {
  const variantClasses = {
    default: 'bg-background',
    gradient: 'bg-gradient-to-r from-primary to-primary/80',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50',
  };

  const textColor = variant === 'dark' ? 'text-white' : 'text-foreground';
  const subtitleColor = variant === 'dark' ? 'text-white/80' : 'text-muted-foreground';

  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden", variantClasses[variant], className)}>
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay for background image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold mb-6", textColor)}>
            {variant === 'gradient' ? (
              <GradientText gradient="rainbow" size="5xl" className="text-white">
                {title}
              </GradientText>
            ) : (
              title
            )}
          </h2>
        </ScrollReveal>

        {subtitle && (
          <ScrollReveal direction="up" distance={30} delay={0.4}>
            <p className={cn("text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed", subtitleColor)}>
              {subtitle}
            </p>
          </ScrollReveal>
        )}

        {(primaryAction || secondaryAction) && (
          <ScrollReveal direction="up" distance={30} delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryAction && (
                <FloatingElement delay={0.2}>
                  <Button 
                    size="lg" 
                    variant={primaryAction.variant || 'default'}
                    className={cn(
                      "px-8 py-4 text-lg font-semibold",
                      variant === 'dark' && primaryAction.variant === 'outline' && "border-white/30 text-white hover:bg-white/10"
                    )}
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                </FloatingElement>
              )}
              {secondaryAction && (
                <FloatingElement delay={0.4}>
                  <Button 
                    variant={secondaryAction.variant || 'outline'}
                    size="lg" 
                    className={cn(
                      "px-8 py-4 text-lg font-semibold",
                      variant === 'dark' && secondaryAction.variant === 'outline' && "border-white/30 text-white hover:bg-white/10"
                    )}
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                </FloatingElement>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.5}
            duration={4 + i * 0.5}
            distance={15 + i * 5}
            className="absolute opacity-20"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
          >
            <div className="w-4 h-4 bg-primary/30 rounded-full" />
          </FloatingElement>
        ))}
      </div>
    </section>
  );
}

interface CTACardProps {
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function CTACard({ 
  title, 
  description, 
  action, 
  icon,
  className = '' 
}: CTACardProps) {
  return (
    <ScrollReveal direction="up" distance={30}>
      <div className={cn("bg-card rounded-lg p-6 shadow-sm border text-center", className)}>
        {icon && (
          <div className="mb-4 flex justify-center">
            {icon}
          </div>
        )}
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <Button onClick={action.onClick} className="w-full">
          {action.label}
        </Button>
      </div>
    </ScrollReveal>
  );
}
