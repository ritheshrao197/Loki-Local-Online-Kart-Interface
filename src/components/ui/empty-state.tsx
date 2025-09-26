'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';
import { 
  Package, 
  ShoppingCart, 
  Search, 
  Heart, 
  Users, 
  FileText, 
  Image, 
  Star,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'card';
}

const iconMap = {
  products: Package,
  cart: ShoppingCart,
  search: Search,
  favorites: Heart,
  users: Users,
  orders: FileText,
  images: Image,
  reviews: Star,
  add: Plus,
  filter: Filter,
  refresh: RefreshCw,
};

export function EmptyState({
  icon,
  title = "No items found",
  description = "There are no items to display at the moment.",
  primaryAction,
  secondaryAction,
  className = '',
  size = 'md',
  variant = 'default'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24'
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className={cn("text-center", sizeClasses[size], className)}>
      <ScrollReveal direction="up" distance={20} delay={0.2}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className={cn(
            "mx-auto rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground",
            size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-20 h-20' : 'w-24 h-24'
          )}>
            {icon && (
              <div className={cn(iconSizeClasses[size])}>
                {icon}
              </div>
            )}
          </div>
        </motion.div>
      </ScrollReveal>

      <ScrollReveal direction="up" distance={20} delay={0.4}>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn("font-semibold mb-2", titleSizeClasses[size])}
        >
          {title}
        </motion.h3>
      </ScrollReveal>

      <ScrollReveal direction="up" distance={20} delay={0.6}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground mb-8 max-w-md mx-auto"
        >
          {description}
        </motion.p>
      </ScrollReveal>

      {(primaryAction || secondaryAction) && (
        <ScrollReveal direction="up" distance={20} delay={0.8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {primaryAction && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {primaryAction.href ? (
                  <Button asChild>
                    <Link href={primaryAction.href}>
                      {primaryAction.label}
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={primaryAction.onClick}>
                    {primaryAction.label}
                  </Button>
                )}
              </motion.div>
            )}
            
            {secondaryAction && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {secondaryAction.href ? (
                  <Button variant="outline" asChild>
                    <Link href={secondaryAction.href}>
                      {secondaryAction.label}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" onClick={secondaryAction.onClick}>
                    {secondaryAction.label}
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </ScrollReveal>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <div className="bg-card rounded-lg border p-8">
        {content}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="py-8">
        {content}
      </div>
    );
  }

  return content;
}

// Predefined empty states
export function EmptyProducts({ 
  onAddProduct, 
  onBrowseProducts,
  className = '' 
}: { 
  onAddProduct?: () => void;
  onBrowseProducts?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Package className="w-full h-full" />}
      title="No products found"
      description="Start by adding your first product or browse existing products in the marketplace."
      primaryAction={onAddProduct ? {
        label: "Add Product",
        onClick: onAddProduct
      } : {
        label: "Add Product",
        href: "/dashboard/products/new"
      }}
      secondaryAction={onBrowseProducts ? {
        label: "Browse Products",
        onClick: onBrowseProducts
      } : {
        label: "Browse Products",
        href: "/products"
      }}
      className={className}
    />
  );
}

export function EmptyCart({ 
  onStartShopping,
  className = '' 
}: { 
  onStartShopping?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-full h-full" />}
      title="Your cart is empty"
      description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
      primaryAction={onStartShopping ? {
        label: "Start Shopping",
        onClick: onStartShopping
      } : {
        label: "Start Shopping",
        href: "/"
      }}
      className={className}
    />
  );
}

export function EmptySearch({ 
  searchTerm,
  onClearSearch,
  onBrowseAll,
  className = '' 
}: { 
  searchTerm?: string;
  onClearSearch?: () => void;
  onBrowseAll?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title={`No results for "${searchTerm}"`}
      description="Try adjusting your search terms or browse all products to find what you're looking for."
      primaryAction={onClearSearch ? {
        label: "Clear Search",
        onClick: onClearSearch
      } : undefined}
      secondaryAction={onBrowseAll ? {
        label: "Browse All",
        onClick: onBrowseAll
      } : {
        label: "Browse All",
        href: "/products"
      }}
      className={className}
    />
  );
}

export function EmptyFavorites({ 
  onBrowseProducts,
  className = '' 
}: { 
  onBrowseProducts?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Heart className="w-full h-full" />}
      title="No favorites yet"
      description="Products you like will appear here. Start browsing to add some favorites!"
      primaryAction={onBrowseProducts ? {
        label: "Browse Products",
        onClick: onBrowseProducts
      } : {
        label: "Browse Products",
        href: "/products"
      }}
      className={className}
    />
  );
}

export function EmptyOrders({ 
  onStartShopping,
  className = '' 
}: { 
  onStartShopping?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FileText className="w-full h-full" />}
      title="No orders yet"
      description="Your order history will appear here once you make your first purchase."
      primaryAction={onStartShopping ? {
        label: "Start Shopping",
        onClick: onStartShopping
      } : {
        label: "Start Shopping",
        href: "/"
      }}
      className={className}
    />
  );
}

export function EmptyReviews({ 
  onWriteReview,
  className = '' 
}: { 
  onWriteReview?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Star className="w-full h-full" />}
      title="No reviews yet"
      description="Be the first to share your experience with this product."
      primaryAction={onWriteReview ? {
        label: "Write Review",
        onClick: onWriteReview
      } : undefined}
      className={className}
    />
  );
}

export function EmptyUsers({ 
  onInviteUsers,
  className = '' 
}: { 
  onInviteUsers?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Users className="w-full h-full" />}
      title="No users found"
      description="No users match your current filters. Try adjusting your search criteria."
      primaryAction={onInviteUsers ? {
        label: "Invite Users",
        onClick: onInviteUsers
      } : undefined}
      className={className}
    />
  );
}

export function EmptyImages({ 
  onUploadImages,
  className = '' 
}: { 
  onUploadImages?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Image className="w-full h-full" />}
      title="No images uploaded"
      description="Upload images to showcase your products and attract more customers."
      primaryAction={onUploadImages ? {
        label: "Upload Images",
        onClick: onUploadImages
      } : undefined}
      className={className}
    />
  );
}
