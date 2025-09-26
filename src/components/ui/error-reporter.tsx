'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { 
  Bug, 
  Send, 
  X, 
  CheckCircle, 
  AlertTriangle,
  User,
  Mail,
  MessageSquare,
  Tag,
  Upload,
  Trash2
} from 'lucide-react';

interface ErrorReport {
  id: string;
  timestamp: Date;
  error: Error;
  userAgent: string;
  url: string;
  userId?: string;
  userEmail?: string;
  description?: string;
  stepsToReproduce?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'bug' | 'feature-request' | 'performance' | 'ui-ux' | 'other';
  attachments?: File[];
  status: 'pending' | 'submitted' | 'failed';
}

interface ErrorReporterProps {
  error: Error;
  onClose: () => void;
  onSubmit?: (report: ErrorReport) => Promise<void>;
  className?: string;
}

export function ErrorReporter({ 
  error, 
  onClose, 
  onSubmit,
  className = '' 
}: ErrorReporterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    description: '',
    stepsToReproduce: '',
    severity: 'medium' as const,
    category: 'bug' as const,
    includeSystemInfo: true,
    includeUserAgent: true,
    includeUrl: true
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const report: ErrorReport = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        error,
        userAgent: formData.includeUserAgent ? navigator.userAgent : '',
        url: formData.includeUrl ? window.location.href : '',
        userEmail: formData.userEmail || undefined,
        description: formData.description || undefined,
        stepsToReproduce: formData.stepsToReproduce || undefined,
        severity: formData.severity,
        category: formData.category,
        attachments: attachments.length > 0 ? attachments : undefined,
        status: 'submitted'
      };

      if (onSubmit) {
        await onSubmit(report);
      } else {
        // Default submission - log to console in development
        console.log('Error Report:', report);
        
        // In production, you would send to your error reporting service
        // await sendErrorReport(report);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit error report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn("max-w-md mx-auto", className)}
      >
        <Card>
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-xl font-bold mb-2"
            >
              Report Submitted
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-muted-foreground mb-6"
            >
              Thank you for reporting this error. Our team will review it and work on a fix.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("max-w-2xl mx-auto", className)}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bug className="w-5 h-5 mr-2" />
              Report Error
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Error Summary
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Message:</strong> {error.message}
              </p>
              {error.stack && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                Your Information
              </h3>
              
              <div>
                <Label htmlFor="userEmail">Email (optional)</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                />
              </div>
            </div>

            {/* Error Details */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Error Details
              </h3>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you were doing when the error occurred..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                <Textarea
                  id="stepsToReproduce"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                  value={formData.stepsToReproduce}
                  onChange={(e) => setFormData(prev => ({ ...prev, stepsToReproduce: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Classification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor issue</SelectItem>
                      <SelectItem value="medium">Medium - Moderate issue</SelectItem>
                      <SelectItem value="high">High - Significant issue</SelectItem>
                      <SelectItem value="critical">Critical - Blocks functionality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature-request">Feature Request</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="ui-ux">UI/UX</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Attachments
              </h3>
              
              <div>
                <Label htmlFor="attachments">Screenshots or Files</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.log"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload screenshots, logs, or other files that might help us understand the issue.
                </p>
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                        className="h-6 w-6"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="font-medium">System Information</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSystemInfo"
                    checked={formData.includeSystemInfo}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, includeSystemInfo: !!checked }))
                    }
                  />
                  <Label htmlFor="includeSystemInfo" className="text-sm">
                    Include system information (browser, OS, etc.)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeUserAgent"
                    checked={formData.includeUserAgent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, includeUserAgent: !!checked }))
                    }
                  />
                  <Label htmlFor="includeUserAgent" className="text-sm">
                    Include user agent string
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeUrl"
                    checked={formData.includeUrl}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, includeUrl: !!checked }))
                    }
                  />
                  <Label htmlFor="includeUrl" className="text-sm">
                    Include current page URL
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Hook for error reporting
export function useErrorReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentError, setCurrentError] = useState<Error | null>(null);

  const reportError = (error: Error) => {
    setCurrentError(error);
    setIsOpen(true);
  };

  const closeReporter = () => {
    setIsOpen(false);
    setCurrentError(null);
  };

  const submitReport = async (report: ErrorReport) => {
    // Default implementation - log to console
    console.log('Error Report Submitted:', report);
    
    // In production, you would send to your error reporting service
    // Examples:
    // - Sentry: Sentry.captureException(error, { extra: report });
    // - LogRocket: LogRocket.captureException(error);
    // - Custom API: await fetch('/api/error-reports', { method: 'POST', body: JSON.stringify(report) });
  };

  return {
    isOpen,
    currentError,
    reportError,
    closeReporter,
    submitReport
  };
}

// Error reporting service integration
export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private reports: ErrorReport[] = [];

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  async submitReport(report: ErrorReport): Promise<void> {
    try {
      // Store locally for now
      this.reports.push(report);
      
      // In production, send to your error reporting service
      if (process.env.NODE_ENV === 'production') {
        // await this.sendToService(report);
      }
      
      console.log('Error report submitted:', report);
    } catch (error) {
      console.error('Failed to submit error report:', error);
      throw error;
    }
  }

  private async sendToService(report: ErrorReport): Promise<void> {
    // Example implementation for sending to an API
    const response = await fetch('/api/error-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...report,
        timestamp: report.timestamp.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit error report: ${response.statusText}`);
    }
  }

  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  clearReports(): void {
    this.reports = [];
  }
}
