'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showSearch?: boolean;
  showHelp?: boolean;
  className?: string;
  backgroundImage?: string;
}

export function NotFoundPage({
  title = "404",
  subtitle = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showSearch = true,
  showHelp = true,
  className = '',
  backgroundImage
}: NotFoundPageProps) {
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
            <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">
              {title}
            </div>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            {subtitle}
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.6}>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        </ScrollReveal>

        {/* Action Buttons */}
        <ScrollReveal direction="up" distance={30} delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="px-8">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 border-white/30 text-white hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </ScrollReveal>

        {/* Search */}
        {showSearch && (
          <ScrollReveal direction="up" distance={30} delay={1.0}>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search for something..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Help */}
        {showHelp && (
          <ScrollReveal direction="up" distance={30} delay={1.2}>
            <div className="text-center">
              <p className="text-white/60 mb-4">Need help?</p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/contact">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/faq">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface ErrorPageProps {
  title?: string;
  subtitle?: string;
  description?: string;
  errorCode?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorPage({
  title = "Something went wrong",
  subtitle = "We encountered an error",
  description = "Please try again or contact support if the problem persists.",
  errorCode,
  className = '',
  onRetry
}: ErrorPageProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center px-4", className)}>
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-12 h-12 text-destructive" />
            </div>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.6}>
          <h2 className="text-xl text-muted-foreground mb-4">
            {subtitle}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.8}>
          <p className="text-muted-foreground mb-8">
            {description}
          </p>
        </ScrollReveal>

        {errorCode && (
          <ScrollReveal direction="up" distance={30} delay={1.0}>
            <div className="bg-muted rounded-lg p-4 mb-8">
              <p className="text-sm font-mono text-muted-foreground">
                Error Code: {errorCode}
              </p>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal direction="up" distance={30} delay={1.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onRetry && (
              <Button onClick={onRetry} size="lg">
                Try Again
              </Button>
            )}
            
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
