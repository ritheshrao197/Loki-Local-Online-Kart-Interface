'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X,
  Heart,
  Share2,
  Truck,
  Shield,
  CreditCard,
  ArrowRight,
  Package,
  Star
} from 'lucide-react';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  seller: {
    id: string;
    name: string;
  };
  category: string;
  inStock: boolean;
  maxQuantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

interface ShoppingCartProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  onCheckout?: (items: CartItem[]) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onMoveToWishlist?: (item: CartItem) => void;
}

export function ShoppingCart({
  isVisible,
  onClose,
  className = '',
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist
}: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  // Mock cart items - in real app, this would come from context/state management
  useEffect(() => {
    const mockItems: CartItem[] = [
      {
        id: '1',
        name: 'Handcrafted Wooden Bowl',
        price: 1299,
        originalPrice: 1599,
        quantity: 2,
        image: 'https://picsum.photos/seed/bowl/200/200',
        seller: { id: 'seller1', name: 'Artisan Crafts Co.' },
        category: 'Home & Garden',
        inStock: true,
        maxQuantity: 10,
        weight: 0.5
      },
      {
        id: '2',
        name: 'Organic Cotton Tote Bag',
        price: 599,
        quantity: 1,
        image: 'https://picsum.photos/seed/tote/200/200',
        seller: { id: 'seller2', name: 'EcoFriendly Store' },
        category: 'Fashion',
        inStock: true,
        maxQuantity: 5
      }
    ];
    setCartItems(mockItems);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
        : item
    ));
    
    onUpdateQuantity?.(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    onRemoveItem?.(itemId);
  };

  const handleMoveToWishlist = (item: CartItem) => {
    handleRemoveItem(item.id);
    onMoveToWishlist?.(item);
  };

  const handleApplyCoupon = () => {
    // Mock coupon validation
    const validCoupons = {
      'SAVE10': { discount: 10, type: 'percentage' as const },
      'FLAT100': { discount: 100, type: 'fixed' as const }
    };
    
    const coupon = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      onCheckout?.(cartItems);
      setIsLoading(false);
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className={cn('fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg z-50', className)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <Badge variant="secondary">{cartItems.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some items to get started
              </p>
              <Button onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex space-x-3 p-3 border rounded-lg"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.seller.name}</p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-semibold text-sm">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveToWishlist(item)}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Coupon Code */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
              >
                Apply
              </Button>
            </div>
            
            {appliedCoupon && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-green-800">
                    Coupon {appliedCoupon.code} applied
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppliedCoupon(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-3 h-3" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-3 h-3" />
                <span>Easy Returns</span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
            
            <Button variant="outline" className="w-full" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Cart context provider
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const CartContext = React.createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setItems(prev => {
      const existingItem = prev.find(i => i.name === newItem.name && i.seller.id === newItem.seller.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === existingItem.id 
            ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.maxQuantity) }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Cart hook
export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Cart item component
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
}

export function CartItemComponent({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onMoveToWishlist 
}: CartItemProps) {
  return (
    <div className="flex space-x-3 p-3 border rounded-lg">
      <div className="relative w-16 h-16 rounded-md overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground">{item.seller.name}</p>
        
        <div className="flex items-center space-x-2 mt-1">
          <span className="font-semibold text-sm">₹{item.price.toLocaleString()}</span>
          {item.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{item.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <span className="text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.maxQuantity}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <div className="text-right">
          <div className="font-semibold text-sm">
            ₹{(item.price * item.quantity).toLocaleString()}
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMoveToWishlist(item)}
          >
            <Heart className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
