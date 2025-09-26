'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  persistent?: boolean;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function ToastComponent({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!toast.persistent && toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, toast.persistent, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "bg-card border border-l-4 shadow-lg rounded-lg p-4 max-w-sm w-full",
            getBorderColor()
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {toast.description}
                </p>
              )}
              
              {toast.action && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toast.action.onClick}
                    className="h-8 px-3 text-xs"
                  >
                    {toast.action.label}
                  </Button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onRemove(toast.id), 300);
              }}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({ 
  toasts, 
  onRemove, 
  position = 'top-right' 
}: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={cn(
      "fixed z-50 space-y-2 pointer-events-none",
      positionClasses[position]
    )}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// Toast hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'success',
      title,
      description,
      ...options
    });
  };

  const error = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      title,
      description,
      duration: 0, // Error toasts don't auto-dismiss
      ...options
    });
  };

  const warning = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'warning',
      title,
      description,
      ...options
    });
  };

  const info = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'info',
      title,
      description,
      ...options
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  };
}

// Specific error toast components
export function NetworkErrorToast({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">
            Network Error
          </h4>
          <p className="mt-1 text-sm text-red-600">
            Unable to connect to the server. Please check your internet connection.
          </p>
          {onRetry && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="h-8 px-3 text-xs border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ValidationErrorToast({ 
  errors, 
  onViewDetails 
}: { 
  errors: string[]; 
  onViewDetails?: () => void;
}) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-800">
            Validation Error
          </h4>
          <p className="mt-1 text-sm text-yellow-600">
            Please fix the following errors:
          </p>
          <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
            {errors.slice(0, 3).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {errors.length > 3 && (
              <li>...and {errors.length - 3} more</li>
            )}
          </ul>
          {onViewDetails && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onViewDetails}
                className="h-8 px-3 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServerErrorToast({ 
  error, 
  onReport 
}: { 
  error?: string; 
  onReport?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">
            Server Error
          </h4>
          <p className="mt-1 text-sm text-red-600">
            {error || "An unexpected error occurred on our servers. Please try again later."}
          </p>
          {onReport && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onReport}
                className="h-8 px-3 text-xs border-red-300 text-red-700 hover:bg-red-50"
              >
                Report Issue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
