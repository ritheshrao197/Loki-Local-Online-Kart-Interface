'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  FileText,
  Network,
  Database
} from 'lucide-react';

interface SecurityIssue {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  recommendation: string;
  category: 'authentication' | 'authorization' | 'data-protection' | 'network' | 'configuration';
  status: 'open' | 'fixed' | 'ignored';
  severity: number;
}

interface SecurityScanResult {
  timestamp: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  securityScore: number;
  issues: SecurityIssue[];
}

interface SecurityScannerProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  autoScan?: boolean;
  scanInterval?: number;
}

export function SecurityScanner({
  isVisible,
  onClose,
  className = '',
  autoScan = false,
  scanInterval = 300000 // 5 minutes
}: SecurityScannerProps) {
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const performSecurityScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    try {
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Simulate scan delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock security scan results
      const mockIssues: SecurityIssue[] = [
        {
          id: '1',
          type: 'critical',
          title: 'Weak Authentication',
          description: 'Application uses weak password policies and lacks multi-factor authentication.',
          recommendation: 'Implement strong password requirements and enable MFA for all users.',
          category: 'authentication',
          status: 'open',
          severity: 9
        },
        {
          id: '2',
          type: 'high',
          title: 'Missing HTTPS',
          description: 'Some endpoints are not properly secured with HTTPS.',
          recommendation: 'Ensure all API endpoints use HTTPS and implement proper SSL/TLS configuration.',
          category: 'network',
          status: 'open',
          severity: 8
        },
        {
          id: '3',
          type: 'medium',
          title: 'Insufficient Input Validation',
          description: 'User inputs are not properly validated, which could lead to injection attacks.',
          recommendation: 'Implement comprehensive input validation and sanitization.',
          category: 'data-protection',
          status: 'open',
          severity: 6
        },
        {
          id: '4',
          type: 'low',
          title: 'Information Disclosure',
          description: 'Error messages reveal sensitive system information.',
          recommendation: 'Implement generic error messages that do not expose system details.',
          category: 'configuration',
          status: 'open',
          severity: 3
        }
      ];

      const result: SecurityScanResult = {
        timestamp: Date.now(),
        totalIssues: mockIssues.length,
        criticalIssues: mockIssues.filter(i => i.type === 'critical').length,
        highIssues: mockIssues.filter(i => i.type === 'high').length,
        mediumIssues: mockIssues.filter(i => i.type === 'medium').length,
        lowIssues: mockIssues.filter(i => i.type === 'low').length,
        securityScore: Math.max(0, 100 - (mockIssues.reduce((sum, issue) => sum + issue.severity, 0) / mockIssues.length) * 10),
        issues: mockIssues
      };

      setScanResult(result);
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const getIssueIcon = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getCategoryIcon = (category: SecurityIssue['category']) => {
    switch (category) {
      case 'authentication':
        return <Key className="w-4 h-4" />;
      case 'authorization':
        return <Shield className="w-4 h-4" />;
      case 'data-protection':
        return <Database className="w-4 h-4" />;
      case 'network':
        return <Network className="w-4 h-4" />;
      case 'configuration':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      case 'info':
        return 'bg-green-500';
    }
  };

  const filteredIssues = scanResult?.issues.filter(issue => 
    selectedCategory === 'all' || issue.category === selectedCategory
  ) || [];

  const categories = [
    { id: 'all', label: 'All Issues', count: scanResult?.totalIssues || 0 },
    { id: 'authentication', label: 'Authentication', count: scanResult?.issues.filter(i => i.category === 'authentication').length || 0 },
    { id: 'authorization', label: 'Authorization', count: scanResult?.issues.filter(i => i.category === 'authorization').length || 0 },
    { id: 'data-protection', label: 'Data Protection', count: scanResult?.issues.filter(i => i.category === 'data-protection').length || 0 },
    { id: 'network', label: 'Network', count: scanResult?.issues.filter(i => i.category === 'network').length || 0 },
    { id: 'configuration', label: 'Configuration', count: scanResult?.issues.filter(i => i.category === 'configuration').length || 0 }
  ];

  useEffect(() => {
    if (autoScan && isVisible) {
      performSecurityScan();
      const interval = setInterval(performSecurityScan, scanInterval);
      return () => clearInterval(interval);
    }
  }, [autoScan, isVisible, scanInterval]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn('fixed bottom-4 left-4 z-50', className)}
    >
      <Card className="w-96 max-h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Security Scanner
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={performSecurityScan}
                disabled={isScanning}
                className="h-6 w-6"
              >
                <RefreshCw className={cn("w-3 h-3", isScanning && "animate-spin")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6"
              >
                <XCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 overflow-y-auto max-h-64">
          {isScanning ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Scanning for security issues...</div>
                <Progress value={scanProgress} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(scanProgress)}% complete
                </div>
              </div>
            </div>
          ) : scanResult ? (
            <>
              {/* Security Score */}
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {Math.round(scanResult.securityScore)}/100
                </div>
                <div className="text-xs text-muted-foreground">Security Score</div>
                <Progress 
                  value={scanResult.securityScore} 
                  className="h-2 mt-2"
                />
              </div>

              {/* Issue Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>{scanResult.criticalIssues} Critical</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>{scanResult.highIssues} High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>{scanResult.mediumIssues} Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{scanResult.lowIssues} Low</span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <div className="text-xs font-medium">Categories</div>
                <div className="flex flex-wrap gap-1">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filteredIssues.map(issue => (
                  <div key={issue.id} className="p-2 bg-muted rounded text-xs">
                    <div className="flex items-start space-x-2">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{issue.title}</div>
                        <div className="text-muted-foreground truncate">
                          {issue.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                          <div className={cn("w-2 h-2 rounded-full", getSeverityColor(issue.type))} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Shield className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click scan to check for security issues
              </p>
              <Button
                size="sm"
                onClick={performSecurityScan}
                className="mt-2"
              >
                Start Scan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Security utilities
export class SecurityUtils {
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;]/g, '') // Remove semicolons
      .trim();
  }

  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static hashPassword(password: string): string {
    // In a real application, use a proper hashing library like bcrypt
    // This is just a placeholder implementation
    return btoa(password + 'salt');
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static checkForXSS(input: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  static checkForSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /('|(\\')|(;)|(\-\-)|(\s+(or|and)\s+)/i,
      /(union|select|insert|update|delete|drop|create|alter)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
}

// Security context provider
interface SecurityContextType {
  isSecure: boolean;
  securityScore: number;
  lastScan: Date | null;
  performScan: () => Promise<void>;
  getSecurityRecommendations: () => string[];
}

export const SecurityContext = React.createContext<SecurityContextType | null>(null);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [isSecure, setIsSecure] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const performScan = async () => {
    // Simulate security scan
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    setSecurityScore(score);
    setIsSecure(score >= 80);
    setLastScan(new Date());
  };

  const getSecurityRecommendations = () => {
    const recommendations = [
      'Enable HTTPS for all endpoints',
      'Implement proper authentication and authorization',
      'Add input validation and sanitization',
      'Use secure headers (CSP, HSTS, etc.)',
      'Regular security audits and penetration testing',
      'Keep dependencies updated',
      'Implement rate limiting',
      'Use secure session management'
    ];
    
    return recommendations;
  };

  return (
    <SecurityContext.Provider
      value={{
        isSecure,
        securityScore,
        lastScan,
        performScan,
        getSecurityRecommendations
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

// Security hook
export function useSecurity() {
  const context = React.useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
