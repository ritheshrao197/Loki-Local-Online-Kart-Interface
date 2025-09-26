'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';
import { CheckCircle, ArrowRight, Home, Download } from 'lucide-react';
import Link from 'next/link';

interface SuccessPageProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  showDownload?: boolean;
  downloadUrl?: string;
  className?: string;
  backgroundImage?: string;
}

export function SuccessPage({
  title = "Success!",
  subtitle = "Your request has been completed",
  description = "Thank you for your submission. We'll process your request and get back to you soon.",
  primaryAction,
  secondaryAction,
  showDownload = false,
  downloadUrl,
  className = '',
  backgroundImage
}: SuccessPageProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center relative overflow-hidden", className)}>
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.6}>
          <h2 className="text-xl md:text-2xl text-white/80 mb-4">
            {subtitle}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.8}>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal direction="up" distance={30} delay={1.0}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {primaryAction && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {primaryAction.href ? (
                  <Button asChild size="lg" className="px-8">
                    <Link href={primaryAction.href}>
                      {primaryAction.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    onClick={primaryAction.onClick}
                    size="lg" 
                    className="px-8"
                  >
                    {primaryAction.label}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </motion.div>
            )}
            
            {secondaryAction && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {secondaryAction.href ? (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 border-white/30 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href={secondaryAction.href}>
                      {secondaryAction.label}
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 border-white/30 text-white hover:bg-white/10"
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </ScrollReveal>

        {/* Download */}
        {showDownload && downloadUrl && (
          <ScrollReveal direction="up" distance={30} delay={1.2}>
            <div className="mb-8">
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <a href={downloadUrl} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </a>
              </Button>
            </div>
          </ScrollReveal>
        )}

        {/* Home Link */}
        <ScrollReveal direction="up" distance={30} delay={1.4}>
          <div className="text-center">
            <p className="text-white/60 mb-4">Or return to</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-500/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface SuccessCardProps {
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
  className?: string;
}

export function SuccessCard({
  title = "Success!",
  description = "Your request has been completed successfully.",
  primaryAction,
  secondaryAction,
  className = ''
}: SuccessCardProps) {
  return (
    <div className={cn("bg-card rounded-lg p-8 text-center border shadow-sm", className)}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold mb-4"
      >
        {title}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-muted-foreground mb-8"
      >
        {description}
      </motion.p>

      {(primaryAction || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {primaryAction && (
            <Button onClick={primaryAction.onClick} size="lg">
              {primaryAction.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              variant="outline" 
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
