export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: {
    url: string;
    hint: string;
  }[];
  category: string;
  seller: {
    id:string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  keywords?: string;
};

export type Seller = {
  id: string;
  name: string;
  mobile: string;
  pan: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate?: number;
};

export type Order = {
  id: string;
  product: Pick<Product, 'id' | 'name' | 'images'>;
  buyer: {
    id: string;
    name: string;
  };
  sellerId: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  orderDate: string; // Should be ISO string
};
