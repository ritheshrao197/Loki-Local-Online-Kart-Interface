'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { Typewriter } from '@/components/ui/typewriter';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FloatingElement } from '@/components/ui/floating-elements';
import { ParallaxSection } from '@/components/ui/parallax-section';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  typewriterTexts?: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  className?: string;
  showParticles?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  description,
  typewriterTexts,
  primaryAction,
  secondaryAction,
  backgroundImage,
  className = '',
  showParticles = true
}: HeroSectionProps) {
  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          {subtitle && (
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-4 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} delay={0.4}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <GradientText 
              gradient="rainbow" 
              size="5xl" 
              className="text-white"
            >
              {title}
            </GradientText>
          </h1>
        </ScrollReveal>

        {typewriterTexts && typewriterTexts.length > 0 && (
          <ScrollReveal direction="up" distance={30} delay={0.6}>
            <div className="text-2xl md:text-3xl text-white/80 mb-8 min-h-[3rem]">
              <Typewriter 
                text={typewriterTexts[0]} 
                speed={100}
                className="text-white"
              />
            </div>
          </ScrollReveal>
        )}

        {description && (
          <ScrollReveal direction="up" distance={30} delay={0.8}>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </ScrollReveal>
        )}

        {(primaryAction || secondaryAction) && (
          <ScrollReveal direction="up" distance={30} delay={1.0}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryAction && (
                <FloatingElement delay={0.2}>
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg font-semibold"
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                </FloatingElement>
              )}
              {secondaryAction && (
                <FloatingElement delay={0.4}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10"
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

      {/* Floating Elements */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <FloatingElement
              key={i}
              delay={i * 0.5}
              duration={3 + i * 0.5}
              distance={20 + i * 5}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            >
              <div className="w-2 h-2 bg-white/20 rounded-full" />
            </FloatingElement>
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <ScrollReveal direction="up" distance={20} delay={1.5}>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
}
