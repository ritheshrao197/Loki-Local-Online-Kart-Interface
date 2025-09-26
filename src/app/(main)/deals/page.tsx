import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Tag, Star, ShoppingCart } from 'lucide-react';
import { getProducts } from '@/lib/firebase/firestore';
import { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Deals & Offers - Loki Local Kart',
  description: 'Discover amazing deals, discounts, and special offers from local artisans and makers.',
  keywords: 'deals, offers, discounts, sales, local products, savings',
};

async function getDealProducts(): Promise<Product[]> {
  const products = await getProducts('approved');
  // Filter products with discounts or special offers
  return products.filter(product => 
    product.discountPrice || 
    product.isPromoted || 
    product.isFeatured ||
    (product.discountPrice && product.discountPrice < product.price)
  );
}

function DealCard({ product }: { product: Product }) {
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-red-500 text-white">
            {discountPercentage}% OFF
          </Badge>
        </div>
      )}
      
      {product.isPromoted && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.images[0]?.url || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ₹{product.discountPrice}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                ₹{product.price}
              </span>
            )}
          </div>
          
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
            </div>
          )}
        </div>

        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

function DealSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-square w-full" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export default async function DealsPage() {
  const dealProducts = await getDealProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-4">Deals & Offers</h1>
        <p className="text-muted-foreground">
          Discover amazing deals, discounts, and special offers from local artisans and makers.
        </p>
      </div>

      {/* Featured Deals Banner */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Flash Sale - Limited Time!</h2>
              <p className="text-muted-foreground mb-4">
                Get up to 50% off on selected items from local artisans. Don't miss out!
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Ends in 2 days</span>
                </div>
                <Button size="sm">
                  Shop Now
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Tag className="h-16 w-16 text-primary/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Daily Deals</h3>
            <p className="text-sm text-muted-foreground">
              New deals every day from local artisans
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold mb-2">Featured Products</h3>
            <p className="text-sm text-muted-foreground">
              Handpicked products from top local makers
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Limited Time</h3>
            <p className="text-sm text-muted-foreground">
              Exclusive offers with time-sensitive discounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Deals</h2>
          <Badge variant="secondary">
            {dealProducts.length} products on sale
          </Badge>
        </div>

        {dealProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deals available</h3>
              <p className="text-muted-foreground mb-4">
                Check back later for amazing deals from local artisans.
              </p>
              <Button>Browse All Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Never Miss a Deal!</h3>
          <p className="text-muted-foreground mb-4">
            Subscribe to our newsletter and be the first to know about new deals and offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
