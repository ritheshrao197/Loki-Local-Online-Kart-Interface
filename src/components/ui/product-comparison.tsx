'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  X, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Star, 
  MapPin, 
  Truck, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Share2,
  MessageCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    location: string;
  };
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  shippingOptions: {
    standard: { price: number; days: string };
    express: { price: number; days: string };
  };
  returnPolicy: string;
  warranty: string;
}

interface ProductComparisonProps {
  products: Product[];
  maxProducts?: number;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewProduct?: (productId: string) => void;
  onRemoveProduct?: (productId: string) => void;
  onShareComparison?: (productIds: string[]) => void;
  className?: string;
}

export function ProductComparison({
  products,
  maxProducts = 4,
  onAddToCart,
  onAddToWishlist,
  onViewProduct,
  onRemoveProduct,
  onShareComparison,
  className = ''
}: ProductComparisonProps) {
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get all unique specifications from all products
  const allSpecs = Array.from(
    new Set(
      currentProducts.flatMap(product => Object.keys(product.specifications))
    )
  );

  // Get all unique features from all products
  const allFeatures = Array.from(
    new Set(
      currentProducts.flatMap(product => product.features)
    )
  );

  const handleRemoveProduct = (productId: string) => {
    setCurrentProducts(prev => prev.filter(p => p.id !== productId));
    onRemoveProduct?.(productId);
  };

  const handleAddProduct = () => {
    // This would typically open a product selection modal
    // For now, we'll just show a placeholder
    console.log('Add product to comparison');
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getBestValue = () => {
    if (currentProducts.length === 0) return null;
    
    return currentProducts.reduce((best, current) => {
      const currentValue = current.rating * (current.reviewsCount || 1) / current.price;
      const bestValue = best.rating * (best.reviewsCount || 1) / best.price;
      return currentValue > bestValue ? current : best;
    });
  };

  const bestValue = getBestValue();

  if (currentProducts.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products to compare</h3>
          <p className="text-muted-foreground mb-4">
            Add products to start comparing their features and specifications.
          </p>
          <Button onClick={handleAddProduct}>
            Add Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Product Comparison</h2>
          <p className="text-muted-foreground">
            Compare {currentProducts.length} of {maxProducts} products
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
          
          {currentProducts.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShareComparison?.(currentProducts.map(p => p.id))}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Best Value Highlight */}
      {bestValue && currentProducts.length > 1 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Best Value:</span>
              <span className="text-green-700">{bestValue.name}</span>
              <Badge className="bg-green-600">Recommended</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'table' ? (
        <ComparisonTableView
          products={currentProducts}
          allSpecs={allSpecs}
          allFeatures={allFeatures}
          onRemoveProduct={handleRemoveProduct}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onViewProduct={onViewProduct}
          getDiscountPercentage={getDiscountPercentage}
        />
      ) : (
        <ComparisonCardsView
          products={currentProducts}
          onRemoveProduct={handleRemoveProduct}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onViewProduct={onViewProduct}
          getDiscountPercentage={getDiscountPercentage}
        />
      )}

      {/* Add More Products */}
      {currentProducts.length < maxProducts && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Button
              variant="outline"
              onClick={handleAddProduct}
              className="w-full h-32 flex flex-col items-center justify-center space-y-2"
            >
              <Plus className="w-8 h-8" />
              <span>Add Product to Compare</span>
              <span className="text-sm text-muted-foreground">
                {maxProducts - currentProducts.length} more products can be added
              </span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Table View Component
interface ComparisonTableViewProps {
  products: Product[];
  allSpecs: string[];
  allFeatures: string[];
  onRemoveProduct: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewProduct?: (productId: string) => void;
  getDiscountPercentage: (original: number, current: number) => number;
}

function ComparisonTableView({
  products,
  allSpecs,
  allFeatures,
  onRemoveProduct,
  onAddToCart,
  onAddToWishlist,
  onViewProduct,
  getDiscountPercentage
}: ComparisonTableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Features</th>
            {products.map((product) => (
              <th key={product.id} className="text-center p-4 min-w-[200px]">
                <div className="space-y-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => onRemoveProduct(product.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="relative w-16 h-16 mx-auto rounded-md overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewsCount})
                    </span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Price Row */}
          <tr className="border-b">
            <td className="p-4 font-medium">Price</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <div className="space-y-1">
                  <div className="font-semibold">₹{product.price.toLocaleString()}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge variant="destructive" className="text-xs">
                      -{getDiscountPercentage(product.originalPrice, product.price)}% OFF
                    </Badge>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Brand Row */}
          <tr className="border-b">
            <td className="p-4 font-medium">Brand</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                {product.brand || 'N/A'}
              </td>
            ))}
          </tr>

          {/* Seller Row */}
          <tr className="border-b">
            <td className="p-4 font-medium">Seller</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <div className="space-y-1">
                  <div className="font-medium">{product.seller.name}</div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.seller.rating}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{product.seller.location}</span>
                  </div>
                </div>
              </td>
            ))}
          </tr>

          {/* Stock Status Row */}
          <tr className="border-b">
            <td className="p-4 font-medium">Availability</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </td>
            ))}
          </tr>

          {/* Specifications */}
          {allSpecs.map((spec) => (
            <tr key={spec} className="border-b">
              <td className="p-4 font-medium">{spec}</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.specifications[spec] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}

          {/* Features */}
          {allFeatures.map((feature) => (
            <tr key={feature} className="border-b">
              <td className="p-4 font-medium">{feature}</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.features.includes(feature) ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}

          {/* Shipping Options */}
          <tr className="border-b">
            <td className="p-4 font-medium">Standard Shipping</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <div className="space-y-1">
                  <div className="font-medium">₹{product.shippingOptions.standard.price}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.shippingOptions.standard.days}
                  </div>
                </div>
              </td>
            ))}
          </tr>

          <tr className="border-b">
            <td className="p-4 font-medium">Express Shipping</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <div className="space-y-1">
                  <div className="font-medium">₹{product.shippingOptions.express.price}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.shippingOptions.express.days}
                  </div>
                </div>
              </td>
            ))}
          </tr>

          {/* Return Policy */}
          <tr className="border-b">
            <td className="p-4 font-medium">Return Policy</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center text-sm">
                {product.returnPolicy}
              </td>
            ))}
          </tr>

          {/* Warranty */}
          <tr className="border-b">
            <td className="p-4 font-medium">Warranty</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center text-sm">
                {product.warranty}
              </td>
            ))}
          </tr>

          {/* Actions Row */}
          <tr>
            <td className="p-4 font-medium">Actions</td>
            {products.map((product) => (
              <td key={product.id} className="p-4">
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    onClick={() => onViewProduct?.(product.id)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToCart?.(product)}
                    disabled={!product.inStock}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToWishlist?.(product)}
                    className="w-full"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Cards View Component
interface ComparisonCardsViewProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewProduct?: (productId: string) => void;
  getDiscountPercentage: (original: number, current: number) => number;
}

function ComparisonCardsView({
  products,
  onRemoveProduct,
  onAddToCart,
  onAddToWishlist,
  onViewProduct,
  getDiscountPercentage
}: ComparisonCardsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => onRemoveProduct(product.id)}
              >
                <X className="w-3 h-3" />
              </Button>
              
              <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge className="absolute top-2 left-2">
                    -{getDiscountPercentage(product.originalPrice, product.price)}% OFF
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium line-clamp-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground">by {product.seller.name}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewsCount})
                  </span>
                </div>
                
                <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Key Features</h4>
                <div className="space-y-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{product.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Shipping</h4>
                <div className="text-xs space-y-1">
                  <div>Standard: ₹{product.shippingOptions.standard.price} ({product.shippingOptions.standard.days})</div>
                  <div>Express: ₹{product.shippingOptions.express.price} ({product.shippingOptions.express.days})</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  onClick={() => onViewProduct?.(product.id)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToCart?.(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToWishlist?.(product)}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
