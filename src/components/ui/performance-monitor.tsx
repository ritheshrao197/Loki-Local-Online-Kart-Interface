'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  Clock, 
  Memory, 
  Cpu, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

interface PerformanceMetrics {
  timestamp: number;
  fps: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  network: {
    downlink: number;
    effectiveType: string;
    rtt: number;
  };
  renderTime: number;
  loadTime: number;
  errors: number;
}

interface PerformanceMonitorProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function PerformanceMonitor({
  isVisible,
  onClose,
  className = '',
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 1000
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  const collectMetrics = async (): Promise<PerformanceMetrics> => {
    const timestamp = Date.now();
    
    // FPS calculation
    const now = performance.now();
    frameCountRef.current++;
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Memory usage
    const memory = (performance as any).memory || {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    };

    // Network information
    const connection = (navigator as any).connection || {
      downlink: 0,
      effectiveType: 'unknown',
      rtt: 0
    };

    // Render time (simplified)
    const renderTime = performance.now() - timestamp;

    // Load time
    const loadTime = performance.timing ? 
      performance.timing.loadEventEnd - performance.timing.navigationStart : 0;

    // Error count
    const errors = window.performance.getEntriesByType('resource')
      .filter((entry: any) => entry.name.includes('error')).length;

    return {
      timestamp,
      fps: frameCountRef.current,
      memory: {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      },
      network: {
        downlink: connection.downlink,
        effectiveType: connection.effectiveType,
        rtt: connection.rtt
      },
      renderTime,
      loadTime,
      errors
    };
  };

  const startMonitoring = () => {
    setIsCollecting(true);
    
    if (autoRefresh) {
      intervalRef.current = setInterval(async () => {
        const newMetrics = await collectMetrics();
        setMetrics(newMetrics);
        setHistory(prev => [...prev.slice(-99), newMetrics]); // Keep last 100 entries
        
        // Check for performance issues
        checkAlerts(newMetrics);
      }, refreshInterval);
    }
  };

  const stopMonitoring = () => {
    setIsCollecting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const checkAlerts = (metrics: PerformanceMetrics) => {
    const newAlerts: string[] = [];
    
    if (metrics.fps < 30) {
      newAlerts.push(`Low FPS: ${metrics.fps}`);
    }
    
    if (metrics.memory.used > metrics.memory.limit * 0.8) {
      newAlerts.push(`High memory usage: ${Math.round(metrics.memory.used / 1024 / 1024)}MB`);
    }
    
    if (metrics.renderTime > 16) {
      newAlerts.push(`Slow render time: ${metrics.renderTime.toFixed(2)}ms`);
    }
    
    if (metrics.errors > 0) {
      newAlerts.push(`${metrics.errors} resource errors detected`);
    }
    
    setAlerts(newAlerts);
  };

  const exportMetrics = () => {
    const data = {
      metrics,
      history,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <CheckCircle className="w-4 h-4" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  useEffect(() => {
    if (isVisible) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => stopMonitoring();
  }, [isVisible, autoRefresh, refreshInterval]);

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
              <Activity className="w-4 h-4 mr-2" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={isCollecting ? stopMonitoring : startMonitoring}
                className="h-6 w-6"
              >
                <RefreshCw className={cn("w-3 h-3", isCollecting && "animate-spin")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={exportMetrics}
                className="h-6 w-6"
              >
                <Download className="w-3 h-3" />
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
          {metrics ? (
            <>
              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">FPS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "text-sm font-medium",
                    getStatusColor(metrics.fps, { good: 50, warning: 30 })
                  )}>
                    {metrics.fps}
                  </span>
                  {getStatusIcon(metrics.fps, { good: 50, warning: 30 })}
                </div>
              </div>

              {/* Memory */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Memory className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Memory</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {Math.round(metrics.memory.used / 1024 / 1024)}MB
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((metrics.memory.used / metrics.memory.limit) * 100)}%
                  </Badge>
                </div>
              </div>

              {/* Network */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {metrics.network.effectiveType}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {metrics.network.downlink}Mbps
                  </Badge>
                </div>
              </div>

              {/* Render Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Render</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "text-sm font-medium",
                    getStatusColor(metrics.renderTime, { good: 8, warning: 16 })
                  )}>
                    {metrics.renderTime.toFixed(2)}ms
                  </span>
                  {getStatusIcon(metrics.renderTime, { good: 8, warning: 16 })}
                </div>
              </div>

              {/* Alerts */}
              {alerts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Alerts</span>
                  </div>
                  {alerts.map((alert, index) => (
                    <div key={index} className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                      {alert}
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              {showDetails && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    <div>Load Time: {metrics.loadTime}ms</div>
                    <div>Errors: {metrics.errors}</div>
                    <div>RTT: {metrics.network.rtt}ms</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Collecting metrics...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Performance hook
export function usePerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  const toggle = () => setIsVisible(!isVisible);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    metrics,
    toggle,
    show,
    hide
  };
}

// Performance context provider
interface PerformanceContextType {
  metrics: PerformanceMetrics | null;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  addCustomMetric: (name: string, value: number) => void;
}

export const PerformanceContext = React.createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<Record<string, number>>({});

  const startMonitoring = () => {
    setIsMonitoring(true);
    // Start monitoring logic
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    // Stop monitoring logic
  };

  const addCustomMetric = (name: string, value: number) => {
    setCustomMetrics(prev => ({ ...prev, [name]: value }));
  };

  return (
    <PerformanceContext.Provider
      value={{
        metrics,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        addCustomMetric
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

// Performance optimization utilities
export class PerformanceOptimizer {
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static memoize<T extends (...args: any[]) => any>(func: T): T {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  static requestIdleCallback(callback: () => void, timeout = 1000) {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, { timeout });
    } else {
      return setTimeout(callback, 1);
    }
  }

  static measurePerformance(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return end - start;
  }
}
