'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Info, 
  X,
  RefreshCw,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import { useState } from 'react';

interface ErrorAlertProps {
  type?: 'error' | 'warning' | 'success' | 'info';
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'outline';
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  showIcon?: boolean;
}

export function ErrorAlert({
  type = 'error',
  title,
  description,
  variant = 'default',
  dismissible = false,
  onDismiss,
  action,
  className = '',
  showIcon = true
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return {
          container: 'border-red-200 bg-red-50 text-red-800',
          icon: 'text-red-500',
          title: 'text-red-800',
          description: 'text-red-600',
          action: 'border-red-300 text-red-700 hover:bg-red-100'
        };
      case 'outline':
        return {
          container: 'border-2 bg-transparent',
          icon: type === 'error' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : type === 'success' ? 'text-green-500' : 'text-blue-500',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          action: 'border-border text-foreground hover:bg-muted'
        };
      default:
        return {
          container: type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 
                    type === 'warning' ? 'border-yellow-200 bg-yellow-50 text-yellow-800' :
                    type === 'success' ? 'border-green-200 bg-green-50 text-green-800' :
                    'border-blue-200 bg-blue-50 text-blue-800',
          icon: type === 'error' ? 'text-red-500' : 
                type === 'warning' ? 'text-yellow-500' : 
                type === 'success' ? 'text-green-500' : 
                'text-blue-500',
          title: type === 'error' ? 'text-red-800' : 
                 type === 'warning' ? 'text-yellow-800' : 
                 type === 'success' ? 'text-green-800' : 
                 'text-blue-800',
          description: type === 'error' ? 'text-red-600' : 
                      type === 'warning' ? 'text-yellow-600' : 
                      type === 'success' ? 'text-green-600' : 
                      'text-blue-600',
          action: type === 'error' ? 'border-red-300 text-red-700 hover:bg-red-100' :
                  type === 'warning' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100' :
                  type === 'success' ? 'border-green-300 text-green-700 hover:bg-green-100' :
                  'border-blue-300 text-blue-700 hover:bg-blue-100'
        };
    }
  };

  const variantClasses = getVariantClasses();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-lg border p-4",
        variantClasses.container,
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {getIcon() && (
          <div className={cn("flex-shrink-0", variantClasses.icon)}>
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-medium", variantClasses.title)}>
            {title}
          </h4>
          {description && (
            <p className={cn("mt-1 text-sm", variantClasses.description)}>
              {description}
            </p>
          )}
          
          {action && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={action.onClick}
                className={cn("h-8 px-3 text-xs", variantClasses.action)}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-shrink-0 hover:opacity-70 transition-opacity",
              variantClasses.icon
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Specific error alert components
interface NetworkErrorAlertProps {
  onRetry?: () => void;
  onOffline?: () => void;
  className?: string;
}

export function NetworkErrorAlert({ 
  onRetry, 
  onOffline, 
  className = '' 
}: NetworkErrorAlertProps) {
  return (
    <ErrorAlert
      type="error"
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      action={onRetry ? {
        label: "Retry Connection",
        onClick: onRetry
      } : undefined}
      className={className}
    />
  );
}

interface ValidationErrorAlertProps {
  errors: string[];
  onViewDetails?: () => void;
  className?: string;
}

export function ValidationErrorAlert({ 
  errors, 
  onViewDetails, 
  className = '' 
}: ValidationErrorAlertProps) {
  return (
    <ErrorAlert
      type="warning"
      title="Validation Error"
      description={`Please fix the following ${errors.length} error${errors.length > 1 ? 's' : ''}:`}
      action={onViewDetails ? {
        label: "View Details",
        onClick: onViewDetails
      } : undefined}
      className={className}
    >
      <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
        {errors.slice(0, 3).map((error, index) => (
          <li key={index}>{error}</li>
        ))}
        {errors.length > 3 && (
          <li>...and {errors.length - 3} more</li>
        )}
      </ul>
    </ErrorAlert>
  );
}

interface ServerErrorAlertProps {
  error?: string;
  onReport?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function ServerErrorAlert({ 
  error, 
  onReport, 
  onRetry, 
  className = '' 
}: ServerErrorAlertProps) {
  return (
    <ErrorAlert
      type="error"
      title="Server Error"
      description={error || "An unexpected error occurred on our servers. Our team has been notified."}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : onReport ? {
        label: "Report Issue",
        onClick: onReport
      } : undefined}
      className={className}
    />
  );
}

interface PermissionErrorAlertProps {
  requiredPermission?: string;
  onRequestAccess?: () => void;
  className?: string;
}

export function PermissionErrorAlert({ 
  requiredPermission, 
  onRequestAccess, 
  className = '' 
}: PermissionErrorAlertProps) {
  return (
    <ErrorAlert
      type="warning"
      title="Access Denied"
      description={requiredPermission 
        ? `You need ${requiredPermission} permission to access this resource.`
        : "You don't have permission to access this resource."
      }
      action={onRequestAccess ? {
        label: "Request Access",
        onClick: onRequestAccess
      } : undefined}
      className={className}
    />
  );
}

interface RateLimitErrorAlertProps {
  retryAfter?: number;
  onRetry?: () => void;
  className?: string;
}

export function RateLimitErrorAlert({ 
  retryAfter, 
  onRetry, 
  className = '' 
}: RateLimitErrorAlertProps) {
  return (
    <ErrorAlert
      type="warning"
      title="Rate Limit Exceeded"
      description={retryAfter 
        ? `Too many requests. Please wait ${retryAfter} seconds before trying again.`
        : "Too many requests. Please wait a moment before trying again."
      }
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
      className={className}
    />
  );
}

interface MaintenanceAlertProps {
  estimatedDuration?: string;
  onViewStatus?: () => void;
  className?: string;
}

export function MaintenanceAlert({ 
  estimatedDuration, 
  onViewStatus, 
  className = '' 
}: MaintenanceAlertProps) {
  return (
    <ErrorAlert
      type="info"
      title="Scheduled Maintenance"
      description={estimatedDuration 
        ? `We're currently performing scheduled maintenance. Estimated completion: ${estimatedDuration}.`
        : "We're currently performing scheduled maintenance. We'll be back online shortly."
      }
      action={onViewStatus ? {
        label: "View Status",
        onClick: onViewStatus
      } : undefined}
      className={className}
    />
  );
}

interface ErrorDetailsAlertProps {
  error: Error;
  onCopy?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function ErrorDetailsAlert({ 
  error, 
  onCopy, 
  onDownload, 
  className = '' 
}: ErrorDetailsAlertProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = () => {
    const errorText = `Error: ${error.message}\nStack: ${error.stack}`;
    navigator.clipboard.writeText(errorText);
    onCopy?.();
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
    onDownload?.();
  };

  return (
    <ErrorAlert
      type="error"
      title="Technical Error"
      description="An unexpected error occurred. You can view technical details below."
      action={{
        label: showDetails ? "Hide Details" : "Show Details",
        onClick: () => setShowDetails(!showDetails)
      }}
      className={className}
    >
      {showDetails && (
        <div className="mt-4 space-y-3">
          <div className="bg-background/50 rounded p-3 text-sm">
            <div className="font-medium mb-2">Error Details:</div>
            <div className="text-muted-foreground mb-2">
              <strong>Message:</strong> {error.message}
            </div>
            {error.stack && (
              <div className="text-muted-foreground">
                <strong>Stack Trace:</strong>
                <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
          
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
      )}
    </ErrorAlert>
  );
}
