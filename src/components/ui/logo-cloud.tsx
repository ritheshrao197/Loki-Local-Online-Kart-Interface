'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';

interface Logo {
  name: string;
  logo: string;
  url?: string;
}

interface LogoCloudProps {
  logos: Logo[];
  title?: string;
  subtitle?: string;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export function LogoCloud({ 
  logos, 
  title, 
  subtitle, 
  className = '',
  speed = 1,
  direction = 'left',
  pauseOnHover = true
}: LogoCloudProps) {
  const duplicatedLogos = [...logos, ...logos]; // Duplicate for seamless loop

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

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8 items-center"
              animate={{
                x: direction === 'left' ? [0, -50 * logos.length] : [0, 50 * logos.length],
              }}
              transition={{
                duration: 20 / speed,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: `${logos.length * 200}px` }}
            >
              {duplicatedLogos.map((logo, index) => (
                <LogoItem key={index} logo={logo} />
              ))}
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface LogoItemProps {
  logo: Logo;
}

function LogoItem({ logo }: LogoItemProps) {
  const content = (
    <div className="flex items-center justify-center w-48 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
      <img
        src={logo.logo}
        alt={logo.name}
        className="max-h-12 max-w-32 object-contain"
      />
    </div>
  );

  if (logo.url) {
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

interface LogoGridProps {
  logos: Logo[];
  title?: string;
  subtitle?: string;
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function LogoGrid({ 
  logos, 
  title, 
  subtitle, 
  className = '',
  columns = 5
}: LogoGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
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

        <div className={cn("grid grid-cols-2 gap-8 items-center", gridCols[columns])}>
          {logos.map((logo, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              distance={30} 
              delay={index * 0.1}
            >
              <LogoItem logo={logo} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
