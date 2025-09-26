'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FloatingCard } from '@/components/ui/floating-elements';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ 
  features, 
  title, 
  subtitle, 
  className = '',
  columns = 3
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
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

        <div className={cn("grid grid-cols-1 gap-8", gridCols[columns])}>
          {features.map((feature, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              distance={30} 
              delay={index * 0.1}
            >
              <FloatingCard delay={index * 0.1}>
                <div className="text-center p-6 h-full">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{ backgroundColor: feature.color + '20' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon 
                      className="w-8 h-8" 
                      style={{ color: feature.color }}
                    />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FloatingCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  className?: string;
  delay?: number;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color = '#3b82f6',
  className = '',
  delay = 0
}: FeatureCardProps) {
  return (
    <ScrollReveal direction="up" distance={30} delay={delay}>
      <FloatingCard delay={delay}>
        <div className={cn("p-6 h-full", className)}>
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
            style={{ backgroundColor: color + '20' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon 
              className="w-6 h-6" 
              style={{ color }}
            />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </FloatingCard>
    </ScrollReveal>
  );
}
