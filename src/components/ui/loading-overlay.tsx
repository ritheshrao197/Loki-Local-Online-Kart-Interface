'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  type?: 'loading' | 'success' | 'error' | 'warning';
  progress?: number;
  showProgress?: boolean;
  className?: string;
  backdrop?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingOverlay({
  isVisible,
  message = "Loading...",
  type = 'loading',
  progress,
  showProgress = false,
  className = '',
  backdrop = true,
  size = 'md'
}: LoadingOverlayProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={cn("text-green-500", iconSizeClasses[size])} />;
      case 'error':
        return <XCircle className={cn("text-red-500", iconSizeClasses[size])} />;
      case 'warning':
        return <AlertTriangle className={cn("text-yellow-500", iconSizeClasses[size])} />;
      default:
        return <Loader2 className={cn("text-primary animate-spin", iconSizeClasses[size])} />;
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            backdrop && "bg-background/80 backdrop-blur-sm",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-card rounded-lg p-8 shadow-lg border max-w-sm w-full mx-4"
          >
            <div className="text-center space-y-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={cn(
                  "mx-auto rounded-full bg-muted/50 flex items-center justify-center",
                  sizeClasses[size]
                )}
              >
                {getIcon()}
              </motion.div>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={cn("text-sm font-medium", getMessageColor())}
              >
                {message}
              </motion.p>

              {/* Progress Bar */}
              {showProgress && progress !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progress)}%
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

export function FullScreenLoader({
  isVisible,
  message = "Loading...",
  progress,
  showProgress = false,
  className = ''
}: FullScreenLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background",
            className
          )}
        >
          {/* Logo or Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">L</span>
            </div>
          </motion.div>

          {/* Spinner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-6"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-lg font-medium mb-4"
          >
            {message}
          </motion.p>

          {/* Progress Bar */}
          {showProgress && progress !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="w-64 space-y-2"
            >
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}%
              </p>
            </motion.div>
          )}

          {/* Loading Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="flex space-x-1 mt-6"
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
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface InlineLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoader({
  message = "Loading...",
  size = 'md',
  className = ''
}: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

interface ButtonLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function ButtonLoader({
  isLoading,
  children,
  loadingText = "Loading...",
  className = ''
}: ButtonLoaderProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md"
        >
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{loadingText}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface PageLoaderProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

export function PageLoader({
  isVisible,
  message = "Loading page...",
  progress,
  showProgress = false,
  className = ''
}: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b",
            className
          )}
        >
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{message}</span>
              {showProgress && progress !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
          
          {showProgress && progress !== undefined && (
            <div className="w-full bg-muted h-1">
              <motion.div
                className="bg-primary h-1"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
