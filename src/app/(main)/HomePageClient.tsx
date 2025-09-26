'use client';

import { Suspense } from 'react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Camera, 
  Gamepad2,
  ShoppingBag,
  Gift,
  Star,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Dynamically import components with optimized loading
const ProductGrid = dynamic(() => import('@/components/products/ProductGrid').then(mod => mod.ProductGrid), {
  loading: () => <ProductGridSkeleton />,
  ssr: true
});

export function HomePageClient() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner - DailyObjects Style */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-medium mb-4">
                New Arrivals
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Tech Essentials
                <br />
                <span className="text-orange-400">Redefined</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover premium tech accessories and lifestyle products designed for the modern world
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-medium"
                asChild
              >
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-medium"
                asChild
              >
                <Link href="/categories">
                  Explore Categories
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Navigation - DailyObjects Style */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/categories/tech" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <Smartphone className="h-5 w-5" />
                <span className="font-medium">Tech</span>
              </Link>
              <Link href="/categories/bags" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">Bags & Wallets</span>
              </Link>
              <Link href="/categories/work" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <Laptop className="h-5 w-5" />
                <span className="font-medium">Work Essentials</span>
              </Link>
              <Link href="/categories/gifting" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <Gift className="h-5 w-5" />
                <span className="font-medium">Gifting</span>
              </Link>
              <Link href="/categories/collections" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <Star className="h-5 w-5" />
                <span className="font-medium">Collections</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid - DailyObjects Style */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Tech Essentials', icon: Smartphone, href: '/categories/tech', color: 'bg-blue-500' },
              { name: 'Bags & Wallets', icon: ShoppingBag, href: '/categories/bags', color: 'bg-green-500' },
              { name: 'Work Essentials', icon: Laptop, href: '/categories/work', color: 'bg-purple-500' },
              { name: 'Audio & Music', icon: Headphones, href: '/categories/audio', color: 'bg-red-500' },
              { name: 'Wearables', icon: Watch, href: '/categories/wearables', color: 'bg-yellow-500' },
              { name: 'Photography', icon: Camera, href: '/categories/photography', color: 'bg-indigo-500' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - DailyObjects Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked products that our customers love</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: '1',
                name: 'Premium Leather Wallet',
                price: 2999,
                originalPrice: 3999,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
                rating: 4.8,
                reviews: 124,
                badge: 'Best Seller'
              },
              {
                id: '2',
                name: 'Wireless Headphones',
                price: 8999,
                originalPrice: 12999,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                rating: 4.9,
                reviews: 89,
                badge: 'New'
              },
              {
                id: '3',
                name: 'Smart Watch Series 5',
                price: 24999,
                originalPrice: 29999,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                rating: 4.7,
                reviews: 156,
                badge: 'Limited'
              },
              {
                id: '4',
                name: 'Laptop Sleeve',
                price: 1999,
                originalPrice: 2499,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
                rating: 4.6,
                reviews: 78,
                badge: 'Sale'
              }
            ].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white overflow-hidden">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                      {product.badge}
                    </Badge>
                    <Button
                      size="sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators - DailyObjects Style */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Premium Quality</h3>
              <p className="text-sm text-gray-600">Curated products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup - DailyObjects Style */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const ProductGridSkeleton = () => (
  <div className="space-y-8">
    <div className="flex gap-4">
      <Skeleton className="h-10 w-[180px] rounded-full" />
      <Skeleton className="h-10 w-[180px] rounded-full" />
      <Skeleton className="h-10 flex-1 rounded-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4 rounded-full" />
          <Skeleton className="h-5 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);