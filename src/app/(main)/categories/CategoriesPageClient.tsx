'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/firebase/firestore';
import { Product } from '@/lib/types';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  icon: any;
  color: string;
  subcategories: string[];
  featured: boolean;
}

// Generate categories from Firestore products
const generateCategoriesFromProducts = (products: Product[]): Category[] => {
  const categoryMap = new Map<string, {
    name: string;
    products: Product[];
    subcategories: Set<string>;
  }>();

  // Group products by category
  products.forEach(product => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, {
        name: product.category,
        products: [],
        subcategories: new Set()
      });
    }
    
    const category = categoryMap.get(product.category)!;
    category.products.push(product);
    
    if (product.subcategory) {
      category.subcategories.add(product.subcategory);
    }
  });

  // Convert to Category array with icons and colors
  const categoryIcons: Record<string, any> = {
    'Tech Essentials': Smartphone,
    'Bags & Wallets': ShoppingBag,
    'Work Essentials': Laptop,
    'Audio & Music': Headphones,
    'Wearables': Watch,
    'Photography': Camera,
    'Gaming': Gamepad2,
    'Gifting': Gift,
  };

  const categoryColors: Record<string, string> = {
    'Tech Essentials': 'bg-blue-500',
    'Bags & Wallets': 'bg-green-500',
    'Work Essentials': 'bg-purple-500',
    'Audio & Music': 'bg-red-500',
    'Wearables': 'bg-yellow-500',
    'Photography': 'bg-indigo-500',
    'Gaming': 'bg-pink-500',
    'Gifting': 'bg-orange-500',
  };

  return Array.from(categoryMap.entries()).map(([id, data]) => ({
    id: id.toLowerCase().replace(/\s+/g, '-'),
    name: data.name,
    description: `Discover ${data.name.toLowerCase()} for your needs`,
    image: data.products[0]?.images[0]?.url || 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&h=400&fit=crop',
    productCount: data.products.length,
    icon: categoryIcons[data.name] || Package,
    color: categoryColors[data.name] || 'bg-gray-500',
    subcategories: Array.from(data.subcategories),
    featured: data.products.length > 20
  }));
};

export function CategoriesPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products and generate categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const products = await getProducts('approved');
        const generatedCategories = generateCategoriesFromProducts(products);
        setCategories(generatedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCategories = categories.filter(category => category.featured);
  const regularCategories = categories.filter(category => !category.featured);

  const CategoryCard = ({ category }: { category: Category }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products?category=${category.name}`}>
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white overflow-hidden h-full">
          <div className="relative">
            <Image
              src={category.image}
              alt={category.name}
              width={600}
              height={400}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute top-4 left-4">
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-gray-900">
                {category.productCount} items
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {category.description}
            </p>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((subcategory) => (
                  <Badge key={subcategory} variant="outline" className="text-xs">
                    {subcategory}
                  </Badge>
                ))}
                {category.subcategories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{category.subcategories.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-orange-500 group-hover:text-orange-600 transition-colors">
              <span className="text-sm font-medium">Shop Now</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/home" className="hover:text-orange-500">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Categories</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated collection of premium products across different categories
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
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

        {/* Featured Categories */}
        {!searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">Most Popular</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Categories */}
        <div>
          {!searchQuery && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
              <span className="text-sm text-gray-600">
                {filteredCategories.length} categories
              </span>
            </div>
          )}
          
          {filteredCategories.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No categories found</h3>
                <p>Try adjusting your search terms</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
            <p className="text-lg mb-6 opacity-90">
              Browse our complete product catalog or get in touch with our team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/products">
                  View All Products
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-500" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
