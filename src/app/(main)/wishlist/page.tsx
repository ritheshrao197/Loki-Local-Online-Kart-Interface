'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Search, ShoppingCart, Trash2, Share2, Grid, List } from 'lucide-react';
import { Product } from '@/lib/types';

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
  notes?: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading wishlist items
    const loadWishlist = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from your backend/API
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const filteredItems = wishlistItems.filter(item =>
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'oldest':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      case 'price-low':
        return (a.product.discountPrice || a.product.price) - (b.product.discountPrice || b.product.price);
      case 'price-high':
        return (b.product.discountPrice || b.product.price) - (a.product.discountPrice || a.product.price);
      case 'name':
        return a.product.name.localeCompare(b.product.name);
      default:
        return 0;
    }
  });

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedItems);
    localStorage.setItem('wishlist', JSON.stringify(updatedItems));
  };

  const handleAddToCart = (product: Product) => {
    // In a real app, this would add to cart
    console.log('Adding to cart:', product);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === sortedItems.length
        ? []
        : sortedItems.map(item => item.id)
    );
  };

  const handleBulkAddToCart = () => {
    const selectedProducts = sortedItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.product);
    
    selectedProducts.forEach(product => handleAddToCart(product));
    setSelectedItems([]);
  };

  const handleBulkRemove = () => {
    const updatedItems = wishlistItems.filter(item => !selectedItems.includes(item.id));
    setWishlistItems(updatedItems);
    localStorage.setItem('wishlist', JSON.stringify(updatedItems));
    setSelectedItems([]);
  };

  const WishlistSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-square w-full rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-4">My Wishlist</h1>
          <p className="text-muted-foreground">
            Save your favorite products for later.
          </p>
        </div>
        <WishlistSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-4">My Wishlist</h1>
        <p className="text-muted-foreground">
          Save your favorite products for later. {wishlistItems.length} items saved.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start adding products you love to your wishlist.
            </p>
            <Button>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedItems.length} item(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBulkAddToCart}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkRemove}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {sortedItems.length} of {wishlistItems.length} items
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedItems.length === sortedItems.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {sortedItems.map((item) => (
              <Card key={item.id} className="relative group">
                {viewMode === 'grid' && (
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-primary"
                    />
                  </div>
                )}
                
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddToCart(item.product)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <ProductCard product={item.product} />
                
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                    <Button size="sm" variant="ghost">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedItems.length === 0 && searchQuery && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms.
                </p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
