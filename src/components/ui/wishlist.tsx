'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Star,
  MapPin,
  Share2,
  MessageCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  seller: {
    id: string;
    name: string;
  };
  category: string;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  addedAt: Date;
  notes?: string;
}

interface WishlistProps {
  items: WishlistItem[];
  onRemoveItem?: (itemId: string) => void;
  onAddToCart?: (item: WishlistItem) => void;
  onViewProduct?: (productId: string) => void;
  onShareItem?: (item: WishlistItem) => void;
  onContactSeller?: (sellerId: string) => void;
  className?: string;
}

export function Wishlist({
  items,
  onRemoveItem,
  onAddToCart,
  onViewProduct,
  onShareItem,
  onContactSeller,
  className = ''
}: WishlistProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);

  const categories = Array.from(new Set(items.map(item => item.category)));

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)));
    }
  };

  const handleBulkAddToCart = () => {
    const selectedItemsList = filteredAndSortedItems.filter(item => selectedItems.has(item.id));
    selectedItemsList.forEach(item => onAddToCart?.(item));
    setSelectedItems(new Set());
    setIsBulkMode(false);
  };

  const handleBulkRemove = () => {
    selectedItems.forEach(itemId => onRemoveItem?.(itemId));
    setSelectedItems(new Set());
    setIsBulkMode(false);
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span>My Wishlist</span>
          </h2>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {items.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant={isBulkMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsBulkMode(!isBulkMode);
                setSelectedItems(new Set());
              }}
            >
              {isBulkMode ? 'Cancel' : 'Bulk Actions'}
            </Button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      {items.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search wishlist items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <SortAsc className={cn("w-4 h-4", sortOrder === 'desc' && 'rotate-180')} />
              </Button>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {isBulkMode && selectedItems.size > 0 && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedItems.size === filteredAndSortedItems.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkRemove}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      {filteredAndSortedItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {items.length === 0 ? 'Your wishlist is empty' : 'No items found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {items.length === 0 
                ? 'Start adding products you love to your wishlist.' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {items.length === 0 && (
              <Button onClick={() => window.location.href = '/'}>
                Start Shopping
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        )}>
          {filteredAndSortedItems.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              isSelected={selectedItems.has(item.id)}
              isBulkMode={isBulkMode}
              onSelect={() => handleSelectItem(item.id)}
              onRemove={() => onRemoveItem?.(item.id)}
              onAddToCart={() => onAddToCart?.(item)}
              onViewProduct={() => onViewProduct?.(item.productId)}
              onShare={() => onShareItem?.(item)}
              onContactSeller={() => onContactSeller?.(item.seller.id)}
              getDiscountPercentage={getDiscountPercentage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Wishlist Item Card Component
interface WishlistItemCardProps {
  item: WishlistItem;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  isBulkMode: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onAddToCart: () => void;
  onViewProduct: () => void;
  onShare: () => void;
  onContactSeller: () => void;
  getDiscountPercentage: (original: number, current: number) => number;
}

function WishlistItemCard({
  item,
  viewMode,
  isSelected,
  isBulkMode,
  onSelect,
  onRemove,
  onAddToCart,
  onViewProduct,
  onShare,
  onContactSeller,
  getDiscountPercentage
}: WishlistItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Selection Checkbox */}
              {isBulkMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onSelect}
                  className="w-4 h-4 text-primary"
                />
              )}

              {/* Product Image */}
              <div className="relative w-20 h-20 rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.originalPrice && item.originalPrice > item.price && (
                  <Badge className="absolute top-1 left-1 text-xs">
                    -{getDiscountPercentage(item.originalPrice, item.price)}%
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground">by {item.seller.name}</p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {item.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{item.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({item.reviewsCount})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={item.inStock ? 'default' : 'destructive'} className="text-xs">
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Added {item.addedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewProduct}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddToCart}
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        {/* Selection Checkbox */}
        {isBulkMode && (
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-4 h-4 text-primary"
            />
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {item.originalPrice && item.originalPrice > item.price && (
            <Badge className="absolute top-2 right-2">
              -{getDiscountPercentage(item.originalPrice, item.price)}%
            </Badge>
          )}

          {/* Stock Status */}
          <Badge 
            variant={item.inStock ? 'default' : 'destructive'} 
            className="absolute bottom-2 left-2"
          >
            {item.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>

          {/* Hover Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2"
              >
                <Button
                  size="sm"
                  onClick={onViewProduct}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={onAddToCart}
                  disabled={!item.inStock}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={onShare}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
            <p className="text-xs text-muted-foreground">by {item.seller.name}</p>
            
            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold">₹{item.price.toLocaleString()}</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{item.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{item.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({item.reviewsCount})
                </span>
              </div>
            )}

            {/* Added Date */}
            <p className="text-xs text-muted-foreground">
              Added {item.addedAt.toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onContactSeller}
              className="text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Contact
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Wishlist Context and Hook
interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

export const WishlistContext = React.createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addItem = (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date()
    };
    
    setItems(prev => {
      // Check if item already exists
      const exists = prev.some(existingItem => existingItem.productId === item.productId);
      if (exists) return prev;
      return [...prev, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const getWishlistCount = () => {
    return items.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        getWishlistCount
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
