'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsCounterProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
  className?: string;
  columns?: 2 | 3 | 4;
  duration?: number;
}

export function StatsCounter({ 
  stats, 
  title, 
  subtitle, 
  className = '',
  columns = 4,
  duration = 2
}: StatsCounterProps) {
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

        <div className={cn("grid grid-cols-2 gap-8", gridCols[columns])}>
          {stats.map((stat, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              distance={30} 
              delay={index * 0.1}
            >
              <div className="text-center">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  duration={duration}
                />
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function Counter({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2,
  className = ''
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setCount(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className={cn("text-4xl md:text-5xl font-bold text-primary", className)}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

interface StatCardProps {
  stat: Stat;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function StatCard({ 
  stat, 
  icon,
  className = '',
  delay = 0,
  duration = 2
}: StatCardProps) {
  return (
    <ScrollReveal direction="up" distance={30} delay={delay}>
      <div className={cn("text-center p-6 bg-card rounded-lg border", className)}>
        {icon && (
          <div className="mb-4 flex justify-center">
            {icon}
          </div>
        )}
        
        <Counter
          value={stat.value}
          suffix={stat.suffix}
          prefix={stat.prefix}
          duration={duration}
        />
        
        <p className="text-muted-foreground mt-2">{stat.label}</p>
      </div>
    </ScrollReveal>
  );
}
