'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  X
} from 'lucide-react';

interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  size: number;
  hits: number;
  lastAccessed: number;
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  oldestEntry: number;
  newestEntry: number;
}

interface CacheManagerProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  maxSize?: number;
  maxAge?: number;
}

export function CacheManager({
  isVisible,
  onClose,
  className = '',
  maxSize = 50 * 1024 * 1024, // 50MB
  maxAge = 24 * 60 * 60 * 1000 // 24 hours
}: CacheManagerProps) {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [stats, setStats] = useState<CacheStats>({
    totalEntries: 0,
    totalSize: 0,
    hitRate: 0,
    missRate: 0,
    oldestEntry: 0,
    newestEntry: 0
  });
  const [isClearing, setIsClearing] = useState(false);

  const calculateStats = useCallback(() => {
    const entries = Array.from(cache.values());
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    const totalRequests = totalHits + entries.length; // Simplified
    const hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;
    const missRate = 100 - hitRate;
    
    const timestamps = entries.map(entry => entry.timestamp);
    const oldestEntry = timestamps.length > 0 ? Math.min(...timestamps) : 0;
    const newestEntry = timestamps.length > 0 ? Math.max(...timestamps) : 0;

    setStats({
      totalEntries: entries.length,
      totalSize,
      hitRate,
      missRate,
      oldestEntry,
      newestEntry
    });
  }, [cache]);

  const addToCache = useCallback((key: string, value: any) => {
    const serialized = JSON.stringify(value);
    const size = new Blob([serialized]).size;
    
    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      size,
      hits: 0,
      lastAccessed: Date.now()
    };

    setCache(prev => {
      const newCache = new Map(prev);
      newCache.set(key, entry);
      return newCache;
    });
  }, []);

  const getFromCache = useCallback((key: string) => {
    const entry = cache.get(key);
    if (!entry) return null;

    // Check if entry is expired
    if (Date.now() - entry.timestamp > maxAge) {
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      return null;
    }

    // Update hit count and last accessed
    setCache(prev => {
      const newCache = new Map(prev);
      const updatedEntry = { ...entry, hits: entry.hits + 1, lastAccessed: Date.now() };
      newCache.set(key, updatedEntry);
      return newCache;
    });

    return entry.value;
  }, [cache, maxAge]);

  const removeFromCache = useCallback((key: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  const clearCache = useCallback(async () => {
    setIsClearing(true);
    
    // Simulate clearing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCache(new Map());
    setIsClearing(false);
  }, []);

  const clearExpired = useCallback(() => {
    const now = Date.now();
    setCache(prev => {
      const newCache = new Map();
      prev.forEach((entry, key) => {
        if (now - entry.timestamp <= maxAge) {
          newCache.set(key, entry);
        }
      });
      return newCache;
    });
  }, [maxAge]);

  const exportCache = useCallback(() => {
    const data = {
      entries: Array.from(cache.entries()),
      stats,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cache-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cache, stats]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

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
              <Database className="w-4 h-4 mr-2" />
              Cache Manager
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 overflow-y-auto max-h-64">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <div className="text-xs text-muted-foreground">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatBytes(stats.totalSize)}</div>
              <div className="text-xs text-muted-foreground">Size</div>
            </div>
          </div>

          {/* Hit Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Hit Rate</span>
              <span className="text-sm font-medium">{stats.hitRate.toFixed(1)}%</span>
            </div>
            <Progress value={stats.hitRate} className="h-2" />
          </div>

          {/* Cache Entries */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Entries</span>
              <Badge variant="outline" className="text-xs">
                {stats.totalEntries}
              </Badge>
            </div>
            
            <div className="max-h-32 overflow-y-auto space-y-1">
              {Array.from(cache.entries()).map(([key, entry]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{key}</div>
                    <div className="text-muted-foreground">
                      {formatBytes(entry.size)} • {entry.hits} hits
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCache(key)}
                    className="h-6 w-6"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearExpired}
              className="flex-1"
            >
              <Clock className="w-3 h-3 mr-1" />
              Clear Expired
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCache}
              className="flex-1"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={clearCache}
            disabled={isClearing}
            className="w-full"
          >
            {isClearing ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3 mr-1" />
                Clear All Cache
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Cache hook
export function useCache() {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());

  const set = useCallback((key: string, value: any, ttl?: number) => {
    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      size: new Blob([JSON.stringify(value)]).size,
      hits: 0,
      lastAccessed: Date.now()
    };

    setCache(prev => {
      const newCache = new Map(prev);
      newCache.set(key, entry);
      return newCache;
    });

    if (ttl) {
      setTimeout(() => {
        setCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(key);
          return newCache;
        });
      }, ttl);
    }
  }, []);

  const get = useCallback((key: string) => {
    const entry = cache.get(key);
    if (!entry) return null;

    // Update hit count and last accessed
    setCache(prev => {
      const newCache = new Map(prev);
      const updatedEntry = { ...entry, hits: entry.hits + 1, lastAccessed: Date.now() };
      newCache.set(key, updatedEntry);
      return newCache;
    });

    return entry.value;
  }, [cache]);

  const remove = useCallback((key: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  const clear = useCallback(() => {
    setCache(new Map());
  }, []);

  const has = useCallback((key: string) => {
    return cache.has(key);
  }, [cache]);

  const size = useCallback(() => {
    return cache.size;
  }, [cache]);

  return {
    set,
    get,
    remove,
    clear,
    has,
    size,
    cache
  };
}

// Cache context provider
interface CacheContextType {
  cache: Map<string, CacheEntry>;
  set: (key: string, value: any, ttl?: number) => void;
  get: (key: string) => any;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  size: () => number;
}

export const CacheContext = React.createContext<CacheContextType | null>(null);

export function CacheProvider({ children }: { children: React.ReactNode }) {
  const cache = useCache();

  return (
    <CacheContext.Provider value={cache}>
      {children}
    </CacheContext.Provider>
  );
}

// Cache utilities
export class CacheUtils {
  static createLRUCache(maxSize: number) {
    const cache = new Map();
    
    return {
      get(key: string) {
        if (cache.has(key)) {
          const value = cache.get(key);
          cache.delete(key);
          cache.set(key, value);
          return value;
        }
        return null;
      },
      
      set(key: string, value: any) {
        if (cache.has(key)) {
          cache.delete(key);
        } else if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(key, value);
      },
      
      clear() {
        cache.clear();
      },
      
      size() {
        return cache.size;
      }
    };
  }

  static createTTLCache(ttl: number) {
    const cache = new Map();
    
    return {
      get(key: string) {
        const entry = cache.get(key);
        if (!entry) return null;
        
        if (Date.now() - entry.timestamp > ttl) {
          cache.delete(key);
          return null;
        }
        
        return entry.value;
      },
      
      set(key: string, value: any) {
        cache.set(key, {
          value,
          timestamp: Date.now()
        });
      },
      
      clear() {
        cache.clear();
      },
      
      size() {
        return cache.size;
      }
    };
  }

  static createPersistentCache(storageKey: string) {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    };

    const saveToStorage = (data: any) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    };

    const cache = loadFromStorage();

    return {
      get(key: string) {
        return cache[key] || null;
      },
      
      set(key: string, value: any) {
        cache[key] = value;
        saveToStorage(cache);
      },
      
      remove(key: string) {
        delete cache[key];
        saveToStorage(cache);
      },
      
      clear() {
        Object.keys(cache).forEach(key => delete cache[key]);
        saveToStorage(cache);
      },
      
      size() {
        return Object.keys(cache).length;
      }
    };
  }
}
