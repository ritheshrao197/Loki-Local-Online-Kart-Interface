'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  onVisibleItemsChange?: (visibleItems: T[]) => void;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll,
  onVisibleItemsChange
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  useEffect(() => {
    onVisibleItemsChange?.(visibleItems);
  }, [visibleItems, onVisibleItemsChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Horizontal virtual list
interface HorizontalVirtualListProps<T> {
  items: T[];
  itemWidth: number;
  containerWidth: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollLeft: number) => void;
}

export function HorizontalVirtualList<T>({
  items,
  itemWidth,
  containerWidth,
  renderItem,
  className = '',
  overscan = 5,
  onScroll
}: HorizontalVirtualListProps<T>) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollLeft / itemWidth);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerWidth / itemWidth) + overscan,
      items.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    };
  }, [scrollLeft, itemWidth, containerWidth, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const totalWidth = items.length * itemWidth;
  const offsetX = visibleRange.start * itemWidth;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollLeft = e.currentTarget.scrollLeft;
    setScrollLeft(newScrollLeft);
    onScroll?.(newScrollLeft);
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-x-auto', className)}
      style={{ width: containerWidth }}
      onScroll={handleScroll}
    >
      <div style={{ width: totalWidth, position: 'relative' }}>
        <div
          style={{
            transform: `translateX(${offsetX}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ width: itemWidth, display: 'inline-block' }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Grid virtual list
interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const columnsPerRow = Math.floor(containerWidth / itemWidth);
  const rows = Math.ceil(items.length / columnsPerRow);

  const visibleRange = useMemo(() => {
    const startRow = Math.floor(scrollTop / itemHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / itemHeight) + overscan,
      rows - 1
    );
    
    const startCol = Math.floor(scrollLeft / itemWidth);
    const endCol = Math.min(
      startCol + Math.ceil(containerWidth / itemWidth) + overscan,
      columnsPerRow - 1
    );
    
    return {
      startRow: Math.max(0, startRow - overscan),
      endRow,
      startCol: Math.max(0, startCol - overscan),
      endCol
    };
  }, [scrollTop, scrollLeft, itemHeight, itemWidth, containerHeight, containerWidth, overscan, rows, columnsPerRow]);

  const visibleItems = useMemo(() => {
    const items: Array<{ item: T; index: number; row: number; col: number }> = [];
    
    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = visibleRange.startCol; col <= visibleRange.endCol; col++) {
        const index = row * columnsPerRow + col;
        if (index < items.length) {
          items.push({
            item: items[index],
            index,
            row,
            col
          });
        }
      }
    }
    
    return items;
  }, [visibleRange, columnsPerRow, items]);

  const totalWidth = columnsPerRow * itemWidth;
  const totalHeight = rows * itemHeight;
  const offsetX = visibleRange.startCol * itemWidth;
  const offsetY = visibleRange.startRow * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    const newScrollLeft = e.currentTarget.scrollLeft;
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);
    onScroll?.(newScrollTop, newScrollLeft);
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ width: containerWidth, height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ width: totalWidth, height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {visibleItems.map(({ item, index, row, col }) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: col * itemWidth,
                top: row * itemHeight,
                width: itemWidth,
                height: itemHeight
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Infinite scroll virtual list
interface InfiniteVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  loadingComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
}

export function InfiniteVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  hasMore = false,
  isLoading = false,
  onLoadMore,
  loadingComponent,
  endComponent
}: InfiniteVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    
    // Check if we need to load more items
    if (hasMore && !isLoading && onLoadMore) {
      const scrollBottom = newScrollTop + containerHeight;
      const threshold = totalHeight - containerHeight * 2;
      
      if (scrollBottom >= threshold) {
        onLoadMore();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          {loadingComponent || (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          )}
        </div>
      )}
      
      {/* End indicator */}
      {!hasMore && items.length > 0 && (
        <div className="flex justify-center py-4">
          {endComponent || (
            <p className="text-muted-foreground text-sm">No more items</p>
          )}
        </div>
      )}
    </div>
  );
}

// Virtual list with search
interface SearchableVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  filterFn?: (item: T, query: string) => boolean;
}

export function SearchableVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterFn
}: SearchableVirtualListProps<T>) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const filteredItems = useMemo(() => {
    if (!localSearchQuery || !filterFn) return items;
    return items.filter(item => filterFn(item, localSearchQuery));
  }, [items, localSearchQuery, filterFn]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    onSearchChange?.(query);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={localSearchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      
      {/* Virtual list */}
      <VirtualList
        items={filteredItems}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={renderItem}
      />
    </div>
  );
}
