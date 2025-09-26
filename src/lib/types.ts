

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: {
    url: string;
    hint: string;
  }[];
  category: string;
  subcategory?: string;
  seller: {
    id:string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'draft' | 'archived';
  keywords?: string;
  stock: number;
  unitOfMeasure: 'piece' | 'kg' | 'dozen' | 'litre';
  stockAlert?: number;
  brand?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  expiryDate?: string;
  manufacturingDate?: string;
  isGstRegistered?: boolean;
  certification?: string;
  shippingOptions?: string[];
  estimatedDelivery?: string;
  returnPolicy?: 'none' | '7-day' | '15-day';
  isPromoted?: boolean;
  isFeatured?: boolean;
};

export type Seller = {
  id: string;
  name: string;
  mobile: string;
  pan: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate: number;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
};

export type Order = {
  id: string;
  product: Pick<Product, 'id' | 'name' | 'images' | 'price'>;
  buyer: {
    id: string;
    name: string;
  };
  sellerId: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string | Date;
};

export type Blog = {
  id: string;
  title: string;
  content: string; // HTML content from a rich text editor
  featuredImage?: {
    url: string; // Can be a public URL or a data URI
    hint: string;
  };
  videoUrl?: string; // Can be a public URL or a data URI
  shortVideoUrl?: string; // Can be a public URL or a data URI
  author: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
};

export type BannerAd = {
  id:string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  placement: 'homepage_top' | 'homepage_middle' | 'homepage_bottom';
};
