import type { Product, Seller, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';

const sellers: Omit<Seller, 'status' | 'pan' | 'mobile'>[] = [
  { id: 'seller_1', name: 'Artisan Crafts Co.' },
  { id: 'seller_2', name: 'Local Weavers Inc.' },
  { id: 'seller_3', name: 'Spice Route Goods' },
  { id: 'seller_4', name: 'Woodworkers Guild' },
];

const productDetails = [
  { name: 'Ceramic Vase', price: 450, category: 'Home Decor', keywords: 'handmade, pottery, decor, vase' },
  { name: 'Woven Cotton Scarf', price: 800, category: 'Apparel', keywords: 'textile, cotton, handmade, fashion' },
  { name: 'Aromatic Spice Set', price: 650, category: 'Food & Groceries', keywords: 'spices, organic, local, cooking' },
  { name: 'Carved Wooden Elephant', price: 1200, category: 'Home Decor', keywords: 'woodwork, craft, statue, decor' },
  { name: 'Artisan Leather Sandals', price: 1500, category: 'Footwear', keywords: 'leather, handmade, footwear, sandals' },
  { name: 'Rural Landscape Painting', price: 3500, category: 'Art', keywords: 'painting, art, decor, landscape' },
  { name: 'Traditional Brass Lamp', price: 950, category: 'Home Decor', keywords: 'brass, lamp, traditional, decor' },
  { name: 'Organic Handmade Soaps', price: 300, category: 'Bath & Body', keywords: 'soap, organic, handmade, natural' },
  { name: 'Eco-Friendly Jute Bag', price: 250, category: 'Accessories', keywords: 'jute, bag, eco-friendly, shopping' },
  { name: 'Homemade Mango Pickle', price: 200, category: 'Food & Groceries', keywords: 'pickle, homemade, food, mango' },
  { name: 'Earthen Clay Pot', price: 550, category: 'Kitchenware', keywords: 'clay, pot, cooking, kitchen' },
  { name: 'Silver Jhumka Earrings', price: 2200, category: 'Jewelry', keywords: 'silver, jewelry, earrings, traditional' },
];

export const mockProducts: Product[] = PlaceHolderImages.map((img, index) => {
  const detail = productDetails[index % productDetails.length];
  return {
    id: img.id,
    name: detail.name,
    description: img.description,
    price: detail.price,
    images: [{ url: img.imageUrl, hint: img.imageHint }],
    category: detail.category,
    keywords: detail.keywords,
    seller: sellers[index % sellers.length],
    status: index < 4 ? 'pending' : 'approved',
  };
});

export const mockSellers: Seller[] = [
  { id: 'seller_1', name: 'Artisan Crafts Co.', mobile: '9876543210', pan: 'ABCDE1234F', status: 'approved', commissionRate: 15 },
  { id: 'seller_2', name: 'Local Weavers Inc.', mobile: '9876543211', pan: 'ABCDE1235G', status: 'approved', commissionRate: 12 },
  { id: 'seller_3', name: 'Spice Route Goods', mobile: '9876543212', pan: 'ABCDE1236H', status: 'pending' },
  { id: 'seller_4', name: 'Woodworkers Guild', mobile: '9876543213', pan: 'ABCDE1237I', status: 'pending' },
  { id: 'seller_5', name: 'Clay Pot Studio', mobile: '9876543214', pan: 'ABCDE1238J', status: 'rejected' },
];

export const mockOrders: Order[] = [
  {
    id: 'order_101',
    product: mockProducts[0],
    buyer: { id: 'buyer_1', name: 'Anjali Sharma' },
    quantity: 1,
    total: 450,
    status: 'delivered',
    orderDate: '2023-10-15',
  },
  {
    id: 'order_102',
    product: mockProducts[2],
    buyer: { id: 'buyer_2', name: 'Rohan Mehta' },
    quantity: 2,
    total: 1300,
    status: 'dispatched',
    orderDate: '2023-10-28',
  },
  {
    id: 'order_103',
    product: mockProducts[4],
    buyer: { id: 'buyer_3', name: 'Priya Singh' },
    quantity: 1,
    total: 1500,
    status: 'confirmed',
    orderDate: '2023-11-01',
  },
  {
    id: 'order_104',
    product: mockProducts[1],
    buyer: { id: 'buyer_1', name: 'Anjali Sharma' },
    quantity: 1,
    total: 800,
    status: 'pending',
    orderDate: '2023-11-02',
  },
];
