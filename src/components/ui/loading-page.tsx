'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showSpinner?: boolean;
  variant?: 'default' | 'minimal' | 'fullscreen';
}

export function LoadingPage({
  title = "Loading...",
  subtitle = "Please wait while we load your content",
  className = '',
  showSpinner = true,
  variant = 'default'
}: LoadingPageProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center">
          {showSpinner && (
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          )}
          <p className="text-muted-foreground">{title}</p>
        </div>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={cn("fixed inset-0 bg-background flex items-center justify-center z-50", className)}>
        <div className="text-center">
          {showSpinner && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
            </motion.div>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center", className)}>
      <div className="text-center">
        {showSpinner && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
          </motion.div>
        )}
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mb-4"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-md mx-auto"
        >
          {subtitle}
        </motion.p>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Loading...", 
  className = '' 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}
    >
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
  showSpinner?: boolean;
}

export function LoadingCard({
  title = "Loading...",
  description = "Please wait while we process your request",
  className = '',
  showSpinner = true
}: LoadingCardProps) {
  return (
    <div className={cn("bg-card rounded-lg p-8 text-center border", className)}>
      {showSpinner && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        </motion.div>
      )}
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg font-semibold mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-muted-foreground"
      >
        {description}
      </motion.p>
    </div>
  );
}
