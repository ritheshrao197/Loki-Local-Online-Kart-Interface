'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  showDetails?: boolean;
  variant?: 'page' | 'card' | 'inline';
  className?: string;
  onReport?: () => void;
}

export function ErrorFallback({
  error,
  resetError,
  showDetails = false,
  variant = 'page',
  className = '',
  onReport
}: ErrorFallbackProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCopy = () => {
    const errorText = `Error: ${error.message}\nStack: ${error.stack}`;
    navigator.clipboard.writeText(errorText);
  };

  const handleDownload = () => {
    const errorText = `Error: ${error.message}\nStack: ${error.stack}`;
    const blob = new Blob([errorText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <div className={cn("text-center space-y-4", className)}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold"
      >
        Something went wrong
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-muted-foreground"
      >
        {error.message || "An unexpected error occurred. Please try again."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button onClick={resetError}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </motion.div>

      {(showDetails || isDetailsOpen) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mt-6 p-4 bg-muted rounded-lg text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <Bug className="w-4 h-4 mr-2" />
              Error Details
            </h3>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 px-3 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="h-8 px-3 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <strong>Error:</strong> {error.message}
            </div>
            {error.stack && (
              <div>
                <strong>Stack Trace:</strong>
                <pre className="mt-1 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {!showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="text-muted-foreground"
          >
            {isDetailsOpen ? 'Hide' : 'Show'} Technical Details
          </Button>
        </motion.div>
      )}

      {onReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onReport}
            className="text-muted-foreground"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </motion.div>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Error</CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {content}
      </div>
    </div>
  );
}

// Specific error fallback components
export function PageErrorFallback({ 
  error, 
  resetError, 
  onReport 
}: { 
  error: Error; 
  resetError: () => void; 
  onReport?: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      resetError={resetError}
      variant="page"
      showDetails={process.env.NODE_ENV === 'development'}
      onReport={onReport}
    />
  );
}

export function CardErrorFallback({ 
  error, 
  resetError, 
  onReport 
}: { 
  error: Error; 
  resetError: () => void; 
  onReport?: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      resetError={resetError}
      variant="card"
      showDetails={process.env.NODE_ENV === 'development'}
      onReport={onReport}
    />
  );
}

export function InlineErrorFallback({ 
  error, 
  resetError, 
  onReport 
}: { 
  error: Error; 
  resetError: () => void; 
  onReport?: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      resetError={resetError}
      variant="inline"
      showDetails={process.env.NODE_ENV === 'development'}
      onReport={onReport}
    />
  );
}

// Error fallback for specific error types
export function NetworkErrorFallback({ 
  onRetry, 
  onOffline 
}: { 
  onRetry: () => void; 
  onOffline?: () => void;
}) {
  const error = new Error('Network connection failed');
  
  return (
    <ErrorFallback
      error={error}
      resetError={onRetry}
      variant="page"
      showDetails={false}
    />
  );
}

export function NotFoundErrorFallback({ 
  onGoHome, 
  onGoBack 
}: { 
  onGoHome: () => void; 
  onGoBack?: () => void;
}) {
  const error = new Error('Page not found');
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button onClick={onGoHome}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              Go Back
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export function PermissionErrorFallback({ 
  onLogin, 
  onSignUp 
}: { 
  onLogin: () => void; 
  onSignUp?: () => void;
}) {
  const error = new Error('Access denied');
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold"
        >
          Access Denied
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground"
        >
          You don't have permission to access this resource. Please log in or sign up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button onClick={onLogin}>
            Log In
          </Button>
          {onSignUp && (
            <Button variant="outline" onClick={onSignUp}>
              Sign Up
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
