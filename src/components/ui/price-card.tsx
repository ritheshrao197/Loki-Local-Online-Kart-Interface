'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FloatingCard } from '@/components/ui/floating-elements';
import { cn } from '@/lib/utils';

interface Feature {
  name: string;
  included: boolean;
}

interface PriceCardProps {
  name: string;
  price: number;
  period?: string;
  description?: string;
  features: Feature[];
  isPopular?: boolean;
  action: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  delay?: number;
}

export function PriceCard({
  name,
  price,
  period = 'month',
  description,
  features,
  isPopular = false,
  action,
  className = '',
  delay = 0
}: PriceCardProps) {
  return (
    <ScrollReveal direction="up" distance={30} delay={delay}>
      <FloatingCard delay={delay}>
        <div className={cn(
          "relative bg-card rounded-lg p-6 shadow-sm border h-full flex flex-col",
          isPopular && "border-primary shadow-lg scale-105",
          className
        )}>
          {isPopular && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              Most Popular
            </Badge>
          )}

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            {description && (
              <p className="text-muted-foreground text-sm mb-4">{description}</p>
            )}
            <div className="mb-4">
              <span className="text-4xl font-bold">${price}</span>
              <span className="text-muted-foreground">/{period}</span>
            </div>
          </div>

          <div className="flex-1 mb-6">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.1 + index * 0.05 }}
                >
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={cn(
                    "text-sm",
                    feature.included ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {feature.name}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <Button 
            className={cn(
              "w-full",
              isPopular && "bg-primary hover:bg-primary/90"
            )}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      </FloatingCard>
    </ScrollReveal>
  );
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  cards: PriceCardProps[];
  className?: string;
}

export function PricingSection({ 
  title, 
  subtitle, 
  cards, 
  className = '' 
}: PricingSectionProps) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <PriceCard
              key={index}
              {...card}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
