'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Settings,
  Activity,
  Timer
} from 'lucide-react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitState {
  requests: number;
  resetTime: number;
  remaining: number;
  isLimited: boolean;
}

interface RateLimiterProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  config?: RateLimitConfig;
}

export function RateLimiter({
  isVisible,
  onClose,
  className = '',
  config = {
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  }
}: RateLimiterProps) {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    requests: 0,
    resetTime: Date.now() + config.windowMs,
    remaining: config.maxRequests,
    isLimited: false
  });
  const [recentRequests, setRecentRequests] = useState<number[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateRateLimit = () => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Remove old requests outside the window
    const validRequests = recentRequests.filter(time => time > windowStart);
    setRecentRequests(validRequests);
    
    const requests = validRequests.length;
    const remaining = Math.max(0, config.maxRequests - requests);
    const isLimited = requests >= config.maxRequests;
    
    setRateLimitState({
      requests,
      resetTime: now + config.windowMs,
      remaining,
      isLimited
    });
  };

  const addRequest = () => {
    const now = Date.now();
    setRecentRequests(prev => [...prev, now]);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    intervalRef.current = setInterval(updateRateLimit, 1000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetRateLimit = () => {
    setRecentRequests([]);
    setRateLimitState({
      requests: 0,
      resetTime: Date.now() + config.windowMs,
      remaining: config.maxRequests,
      isLimited: false
    });
  };

  const getTimeUntilReset = () => {
    const now = Date.now();
    const timeLeft = Math.max(0, rateLimitState.resetTime - now);
    return Math.ceil(timeLeft / 1000);
  };

  const getUsagePercentage = () => {
    return (rateLimitState.requests / config.maxRequests) * 100;
  };

  const getStatusColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (rateLimitState.isLimited) return <XCircle className="w-4 h-4 text-red-500" />;
    if (getUsagePercentage() >= 90) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  useEffect(() => {
    if (isVisible && isMonitoring) {
      updateRateLimit();
    }
  }, [isVisible, isMonitoring]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn('fixed bottom-4 right-4 z-50', className)}
    >
      <Card className="w-80 max-h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Rate Limiter
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                className="h-6 w-6"
              >
                <Activity className={cn("w-3 h-3", isMonitoring && "animate-pulse")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetRateLimit}
                className="h-6 w-6"
              >
                <RefreshCw className="w-3 h-3" />
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
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">
                {rateLimitState.isLimited ? 'Rate Limited' : 'Active'}
              </span>
            </div>
            <Badge variant={rateLimitState.isLimited ? "destructive" : "default"}>
              {rateLimitState.requests}/{config.maxRequests}
            </Badge>
          </div>

          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Usage</span>
              <span className={cn("font-medium", getStatusColor())}>
                {Math.round(getUsagePercentage())}%
              </span>
            </div>
            <Progress value={getUsagePercentage()} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{rateLimitState.remaining}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{getTimeUntilReset()}</div>
              <div className="text-xs text-muted-foreground">Seconds</div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-2">
            <div className="text-xs font-medium">Configuration</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Max Requests: {config.maxRequests}</div>
              <div>Window: {config.windowMs / 1000}s</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={addRequest}
              disabled={rateLimitState.isLimited}
              className="flex-1"
            >
              Simulate Request
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetRateLimit}
              className="flex-1"
            >
              Reset
            </Button>
          </div>

          {/* Recent Activity */}
          <div className="space-y-2">
            <div className="text-xs font-medium">Recent Activity</div>
            <div className="h-16 bg-muted rounded p-2 overflow-y-auto">
              {recentRequests.length > 0 ? (
                <div className="space-y-1">
                  {recentRequests.slice(-10).map((time, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {new Date(time).toLocaleTimeString()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center">
                  No recent requests
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Rate limiter hook
export function useRateLimiter(config: RateLimitConfig) {
  const [state, setState] = useState<RateLimitState>({
    requests: 0,
    resetTime: Date.now() + config.windowMs,
    remaining: config.maxRequests,
    isLimited: false
  });
  const requestsRef = useRef<number[]>([]);

  const checkRateLimit = (identifier: string = 'default'): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const key = config.keyGenerator ? config.keyGenerator(identifier) : identifier;
    
    // Remove old requests outside the window
    requestsRef.current = requestsRef.current.filter(time => time > windowStart);
    
    const requests = requestsRef.current.length;
    const isLimited = requests >= config.maxRequests;
    
    if (!isLimited) {
      requestsRef.current.push(now);
    }
    
    setState({
      requests: requestsRef.current.length,
      resetTime: now + config.windowMs,
      remaining: Math.max(0, config.maxRequests - requestsRef.current.length),
      isLimited
    });
    
    return !isLimited;
  };

  const reset = () => {
    requestsRef.current = [];
    setState({
      requests: 0,
      resetTime: Date.now() + config.windowMs,
      remaining: config.maxRequests,
      isLimited: false
    });
  };

  return {
    state,
    checkRateLimit,
    reset
  };
}

// Rate limiter class
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  check(identifier: string = 'default'): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemaining(identifier: string = 'default'): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  getResetTime(identifier: string = 'default'): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length === 0) {
      return now + this.config.windowMs;
    }
    
    return Math.min(...validRequests) + this.config.windowMs;
  }

  reset(identifier: string = 'default') {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    this.requests.delete(key);
  }

  resetAll() {
    this.requests.clear();
  }

  getStats(identifier: string = 'default') {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    return {
      requests: validRequests.length,
      remaining: Math.max(0, this.config.maxRequests - validRequests.length),
      resetTime: this.getResetTime(identifier),
      isLimited: validRequests.length >= this.config.maxRequests
    };
  }
}

// Rate limiter middleware for API routes
export function createRateLimitMiddleware(config: RateLimitConfig) {
  const rateLimiter = new RateLimiter(config);

  return (req: any, res: any, next: any) => {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!rateLimiter.check(identifier)) {
      const stats = rateLimiter.getStats(identifier);
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((stats.resetTime - Date.now()) / 1000)
      });
      return;
    }
    
    next();
  };
}

// Rate limiter context provider
interface RateLimiterContextType {
  rateLimiter: RateLimiter;
  checkRateLimit: (identifier?: string) => boolean;
  getStats: (identifier?: string) => any;
  reset: (identifier?: string) => void;
}

export const RateLimiterContext = React.createContext<RateLimiterContextType | null>(null);

export function RateLimiterProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode;
  config: RateLimitConfig;
}) {
  const rateLimiter = new RateLimiter(config);

  const checkRateLimit = (identifier: string = 'default') => {
    return rateLimiter.check(identifier);
  };

  const getStats = (identifier: string = 'default') => {
    return rateLimiter.getStats(identifier);
  };

  const reset = (identifier: string = 'default') => {
    rateLimiter.reset(identifier);
  };

  return (
    <RateLimiterContext.Provider
      value={{
        rateLimiter,
        checkRateLimit,
        getStats,
        reset
      }}
    >
      {children}
    </RateLimiterContext.Provider>
  );
}

// Rate limiter hook
export function useRateLimiterContext() {
  const context = React.useContext(RateLimiterContext);
  if (!context) {
    throw new Error('useRateLimiterContext must be used within a RateLimiterProvider');
  }
  return context;
}
