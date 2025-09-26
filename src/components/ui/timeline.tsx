'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  title: string;
  description: string;
  date: string;
  icon?: LucideIcon;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'vertical' | 'horizontal';
}

export function Timeline({ 
  items, 
  title, 
  subtitle, 
  className = '',
  variant = 'vertical'
}: TimelineProps) {
  if (variant === 'horizontal') {
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
                  <p className="text-lg text-muted-foreground">
                    {subtitle}
                  </p>
                </ScrollReveal>
              )}
            </div>
          )}

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2" />
            
            <div className="relative flex justify-between">
              {items.map((item, index) => (
                <ScrollReveal 
                  key={index} 
                  direction="up" 
                  distance={30} 
                  delay={index * 0.1}
                >
                  <TimelineItemHorizontal
                    item={item}
                    index={index}
                    total={items.length}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-8">
            {items.map((item, index) => (
              <ScrollReveal 
                key={index} 
                direction="up" 
                distance={30} 
                delay={index * 0.1}
              >
                <TimelineItemVertical
                  item={item}
                  index={index}
                  isLast={index === items.length - 1}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TimelineItemVerticalProps {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}

function TimelineItemVertical({ item, index, isLast }: TimelineItemVerticalProps) {
  return (
    <div className="relative flex items-start gap-6">
      <div className="relative z-10">
        <motion.div
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
        >
          {item.icon ? (
            <item.icon className="w-8 h-8" />
          ) : (
            <span className="text-lg font-bold">{index + 1}</span>
          )}
        </motion.div>
      </div>
      
      <div className="flex-1 pb-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              {item.date}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

interface TimelineItemHorizontalProps {
  item: TimelineItem;
  index: number;
  total: number;
}

function TimelineItemHorizontal({ item, index, total }: TimelineItemHorizontalProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <motion.div
        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4 relative z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
      >
        {item.icon ? (
          <item.icon className="w-6 h-6" />
        ) : (
          <span className="text-sm font-bold">{index + 1}</span>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
      >
        <h3 className="font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}
