

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
  status: 'pending' | 'approved' | 'rejected' | 'draft';
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
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  orderDate: string | Date;
};

export type Blog = {
  id: string;
  title: string;
  content: string; // HTML content from a rich text editor
  featuredImage?: {
    url: string;
    hint: string;
  };
  author: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
};
