
import type { Product, Seller, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Timestamp } from 'firebase/firestore';

const sellers: Omit<Seller, 'status' | 'pan' | 'mobile' | 'commissionRate'>[] = [
  { id: 'seller_1', name: 'Artisan Crafts Co.' },
  { id: 'seller_2', name: 'Local Weavers Inc.' },
  { id: 'seller_3', name: 'Spice Route Goods' },
  { id: 'seller_4', name: 'Woodworkers Guild' },
];

const productDetails = [
  { name: 'Ceramic Vase', price: 450, category: 'Home Decor', keywords: 'handmade, pottery, decor, vase', stock: 15, unit: 'piece' as const },
  { name: 'Woven Cotton Scarf', price: 800, category: 'Apparel', keywords: 'textile, cotton, handmade, fashion', stock: 30, unit: 'piece' as const },
  { name: 'Aromatic Spice Set', price: 650, category: 'Food & Groceries', keywords: 'spices, organic, local, cooking', stock: 50, unit: 'kg' as const },
  { name: 'Carved Wooden Elephant', price: 1200, category: 'Home Decor', keywords: 'woodwork, craft, statue, decor', stock: 10, unit: 'piece' as const },
  { name: 'Artisan Leather Sandals', price: 1500, category: 'Footwear', keywords: 'leather, handmade, footwear, sandals', stock: 25, unit: 'piece' as const },
  { name: 'Rural Landscape Painting', price: 3500, category: 'Art', keywords: 'painting, art, decor, landscape', stock: 5, unit: 'piece' as const },
  { name: 'Traditional Brass Lamp', price: 950, category: 'Home Decor', keywords: 'brass, lamp, traditional, decor', stock: 20, unit: 'piece' as const },
  { name: 'Organic Handmade Soaps', price: 300, category: 'Bath & Body', keywords: 'soap, organic, handmade, natural', stock: 100, unit: 'piece' as const },
  { name: 'Eco-Friendly Jute Bag', price: 250, category: 'Accessories', keywords: 'jute, bag, eco-friendly, shopping', stock: 150, unit: 'piece' as const },
  { name: 'Homemade Mango Pickle', price: 200, category: 'Food & Groceries', keywords: 'pickle, homemade, food, mango', stock: 80, unit: 'kg' as const },
  { name: 'Earthen Clay Pot', price: 550, category: 'Kitchenware', keywords: 'clay, pot, cooking, kitchen', stock: 40, unit: 'piece' as const },
  { name: 'Silver Jhumka Earrings', price: 2200, category: 'Jewelry', keywords: 'silver, jewelry, earrings, traditional', stock: 18, unit: 'piece' as const },
  { name: 'Hand-painted Wooden Box', price: 750, category: 'Home Decor', keywords: 'wood, box, hand-painted, storage', stock: 22, unit: 'piece' as const },
  { name: 'Block-printed Cotton Kurta', price: 1100, category: 'Apparel', keywords: 'cotton, kurta, apparel, block-print', stock: 60, unit: 'piece' as const },
  { name: 'Sun-dried Turmeric Powder', price: 150, category: 'Food & Groceries', keywords: 'turmeric, spice, organic, powder', stock: 200, unit: 'kg' as const },
  { name: 'Terracotta Wind Chimes', price: 400, category: 'Home Decor', keywords: 'terracotta, wind-chime, decor, garden', stock: 35, unit: 'piece' as const },
  { name: 'Hand-woven Silk Sari', price: 4500, category: 'Apparel', keywords: 'silk, sari, traditional, ethnic', stock: 12, unit: 'piece' as const },
  { name: 'Spiced Honey Infusion', price: 350, category: 'Food & Groceries', keywords: 'honey, infusion, organic, spice', stock: 45, unit: 'litre' as const },
  { name: 'Brass Pooja Thali Set', price: 1800, category: 'Home Decor', keywords: 'brass, pooja, thali, religious', stock: 30, unit: 'piece' as const },
  { name: 'Madhubani Art Coasters', price: 600, category: 'Art', keywords: 'madhubani, art, coasters, painting', stock: 50, unit: 'dozen' as const },
];

export const mockProducts: Product[] = PlaceHolderImages.map((img, index) => {
  const detail = productDetails[index % productDetails.length];
  const sellerInfo = sellers[index % sellers.length];
  let status: Product['status'] = 'approved';
  if (index < 2) {
    status = 'pending';
  } else if (index === 2 || index === 3) {
      status = 'rejected';
  }
  
  return {
    id: img.id,
    name: detail.name,
    description: img.description,
    price: detail.price,
    images: [{ url: img.imageUrl, hint: img.imageHint }],
    category: detail.category,
    keywords: detail.keywords,
    seller: sellerInfo,
    status: status,
    stock: detail.stock,
    unitOfMeasure: detail.unit,
  };
});

export const mockSellers: Seller[] = [
  { id: 'seller_1', name: 'Artisan Crafts Co.', mobile: '9876543210', pan: 'ABCDE1234F', status: 'approved', commissionRate: 15 },
  { id: 'seller_2', name: 'Local Weavers Inc.', mobile: '9876543211', pan: 'ABCDE1235G', status: 'approved', commissionRate: 12 },
  { id: 'seller_3', name: 'Spice Route Goods', mobile: '9876543212', pan: 'ABCDE1236H', status: 'pending', commissionRate: 15 },
  { id: 'seller_4', name: 'Woodworkers Guild', mobile: '9876543213', pan: 'ABCDE1237I', status: 'pending', commissionRate: 15 },
  { id: 'seller_5', name: 'Clay Pot Studio', mobile: '9876543214', pan: 'ABCDE1238J', status: 'rejected', commissionRate: 15 },
  { id: 'seller_6', name: 'Metal Wonders', mobile: '9876543215', pan: 'ABCDE1239K', status: 'suspended', commissionRate: 15 },
];

const simplifiedProducts = mockProducts.map(p => ({ id: p.id, name: p.name, images: p.images, price: p.price }));

const rawOrders: Omit<Order, 'id' | 'orderDate'>[] = [
  {
    product: simplifiedProducts[4], // Artisan Leather Sandals
    buyer: { id: 'buyer_1', name: 'Anjali Sharma' },
    sellerId: 'seller_1',
    quantity: 1,
    total: 1500,
    status: 'delivered',
  },
  {
    product: simplifiedProducts[6], // Traditional Brass Lamp
    buyer: { id: 'buyer_2', name: 'Rohan Mehta' },
    sellerId: 'seller_3',
    quantity: 1,
    total: 950,
    status: 'dispatched',
  },
  {
    product: simplifiedProducts[1], // Woven Cotton Scarf
    buyer: { id: 'buyer_3', name: 'Priya Singh' },
    sellerId: 'seller_2',
    quantity: 2,
    total: 1600,
    status: 'confirmed',
  },
  {
    product: simplifiedProducts[11], // Silver Jhumka Earrings
    buyer: { id: 'buyer_1', name: 'Anjali Sharma' },
    sellerId: 'seller_2',
    quantity: 1,
    total: 2200,
    status: 'pending',
  },
    {
    product: simplifiedProducts[0], // Ceramic Vase
    buyer: { id: 'buyer_4', name: 'Vikram Reddy' },
    sellerId: 'seller_1',
    quantity: 1,
    total: 450,
    status: 'pending',
  },
  {
    product: simplifiedProducts[8], // Eco-Friendly Jute Bag
    buyer: { id: 'buyer_5', name: 'Sneha Patil' },
    sellerId: 'seller_2',
    quantity: 3,
    total: 750,
    status: 'delivered',
  },
  {
    product: simplifiedProducts[9], // Homemade Mango Pickle
    buyer: { id: 'buyer_2', name: 'Rohan Mehta' },
    sellerId: 'seller_2',
    quantity: 2,
    total: 400,
    status: 'pending',
  },
];

export const mockOrders: (Omit<Order, 'id' | 'orderDate'> & { orderDate: Date })[] = rawOrders.map((order, index) => {
    // Distribute order dates over the last month
    const date = new Date();
    date.setDate(date.getDate() - (rawOrders.length - index) * 2);
    return { ...order, orderDate: date };
});
