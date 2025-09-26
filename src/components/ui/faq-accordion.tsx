'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  allowMultiple?: boolean;
}

export function FAQAccordion({ 
  items, 
  title, 
  subtitle, 
  className = '',
  allowMultiple = false
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

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

        <div className="space-y-4">
          {items.map((item, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              distance={30} 
              delay={index * 0.1}
            >
              <FAQItem
                item={item}
                index={index}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleItem(index)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ item, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-semibold text-lg pr-4">{item.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQCategoryProps {
  category: string;
  items: FAQItem[];
  className?: string;
}

export function FAQCategory({ category, items, className = '' }: FAQCategoryProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <ScrollReveal direction="up" distance={30}>
        <h3 className="text-2xl font-bold mb-4">{category}</h3>
      </ScrollReveal>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <ScrollReveal 
            key={index} 
            direction="up" 
            distance={30} 
            delay={index * 0.1}
          >
            <FAQItem
              item={item}
              index={index}
              isOpen={openItems.includes(index)}
              onToggle={() => toggleItem(index)}
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
