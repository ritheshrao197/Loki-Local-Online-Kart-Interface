
import type { Product, Seller, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Timestamp } from 'firebase/firestore';


export const mockSellers: Seller[] = [
  { id: 'seller_1', name: 'Artisan Fabrics Co.', mobile: '9876543210', pan: 'ABCDE1234F', status: 'approved', commissionRate: 15, location: { address: '123 Weavers Lane, Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 } },
  { id: 'seller_2', name: 'FarmFresh Spices', mobile: '9123456789', pan: 'XYZAB5678D', status: 'approved', commissionRate: 15, location: { address: '45 Spice Market, Kochi, Kerala', lat: 9.9312, lng: 76.2673 } },
  { id: 'seller_3', name: 'GreenEarth Products', mobile: '9988776655', pan: 'LMNOP9876K', status: 'approved', commissionRate: 12, location: { address: '78 Organic Avenue, Pune, Maharashtra', lat: 18.5204, lng: 73.8567 } },
  { id: 'seller_4', name: 'EcoSmile', mobile: '9871234560', pan: 'KJHGF6543T', status: 'pending', commissionRate: 15, location: { address: '90 Green Way, Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 } },
  { id: 'seller_5', name: 'ClayCraft Studio', mobile: '9001122334', pan: 'QWERTY4321P', status: 'pending', commissionRate: 15, location: { address: '21 Pottery Road, Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 } },
  { id: 'seller_6', name: 'Nature\'s Essence', mobile: '9112233445', pan: 'ASDFGH6789Z', status: 'rejected', commissionRate: 15, location: { address: '34 Herbal Garden, Dehradun, Uttarakhand', lat: 30.3165, lng: 78.0322 } },
  { id: 'seller_7', name: 'Urban Leatherworks', mobile: '9233445566', pan: 'ZXCVBN0987R', status: 'approved', commissionRate: 15, location: { address: '56 Leather Complex, Kanpur, Uttar Pradesh', lat: 26.4499, lng: 80.3319 } },
  { id: 'seller_8', name: 'Khadi Creations', mobile: '9874321655', pan: 'HJKLPO7654Y', status: 'approved', commissionRate: 15, location: { address: '89 Freedom Marg, Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714 } },
  { id: 'seller_9', name: 'HoneyBee Farms', mobile: '9456781234', pan: 'PLMNQX4321J', status: 'suspended', commissionRate: 15, location: { address: '10 Apiary Hills, Coorg, Karnataka', lat: 12.3375, lng: 75.8069 } },
  { id: 'seller_10', name: 'EarthTone Creations', mobile: '9876501234', pan: 'UYTRE6543W', status: 'approved', commissionRate: 15, location: { address: '65 Earthy Lane, Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126 } },
];


const productDetails = [
  { name: 'Handwoven Cotton Scarf', price: 499, category: 'Handicrafts', keywords: 'scarf, cotton, handwoven', stock: 50, unit: 'piece' as const, sellerId: 'seller_1', isPromoted: true, isFeatured: false },
  { name: 'Organic Turmeric Powder', price: 250, category: 'Food & Groceries', keywords: 'turmeric, powder, organic', stock: 120, unit: 'kg' as const, sellerId: 'seller_2', isPromoted: false, isFeatured: false },
  { name: 'Jute Shopping Bag', price: 299, category: 'Accessories', keywords: 'jute, bag, eco-friendly', stock: 70, unit: 'piece' as const, sellerId: 'seller_3', isPromoted: true, isFeatured: true },
  { name: 'Bamboo Toothbrush Set', price: 399, category: 'Personal Care', keywords: 'bamboo, toothbrush, biodegradable', stock: 200, unit: 'piece' as const, sellerId: 'seller_4', isPromoted: false, isFeatured: false },
  { name: 'Handmade Ceramic Vase', price: 1200, category: 'Home Decor', keywords: 'ceramic, vase, handmade', stock: 30, unit: 'piece' as const, sellerId: 'seller_5', isPromoted: false, isFeatured: false },
  { name: 'Herbal Hair Oil', price: 350, category: 'Bath & Body', keywords: 'hair oil, herbal, natural', stock: 90, unit: 'piece' as const, sellerId: 'seller_6', isPromoted: false, isFeatured: false },
  { name: 'Leather Wallet', price: 899, category: 'Accessories', keywords: 'leather, wallet, handcrafted', stock: 40, unit: 'piece' as const, sellerId: 'seller_7', isPromoted: false, isFeatured: false },
  { name: 'Traditional Khadi Shirt', price: 800, category: 'Apparel', keywords: 'khadi, shirt, cotton', stock: 60, unit: 'piece' as const, sellerId: 'seller_8', isPromoted: false, isFeatured: true },
  { name: 'Local Honey Jar (500g)', price: 450, category: 'Food & Groceries', keywords: 'honey, organic, raw', stock: 75, unit: 'piece' as const, sellerId: 'seller_9', isPromoted: false, isFeatured: false },
  { name: 'Terracotta Planters', price: 600, category: 'Home Decor', keywords: 'terracotta, planters, eco-friendly', stock: 50, unit: 'piece' as const, sellerId: 'seller_10', isPromoted: false, isFeatured: false },
];


export const mockProducts: Product[] = PlaceHolderImages.map((img, index) => {
  const detail = productDetails[index % productDetails.length];
  const sellerInfo = mockSellers.find(s => s.id === detail.sellerId)!;

  let status: Product['status'] = 'approved';
  if (index < 2) {
    status = 'pending';
  } else if (index === 2 || index === 3) {
    status = 'rejected';
  }

  const discountPriceRaw = index % 3 === 0 ? detail.price * 0.8 : undefined;

  return {
    id: img.id,
    name: detail.name,
    description: img.description,
    price: detail.price,
    discountPrice: discountPriceRaw ? Math.floor(discountPriceRaw) : null,
    images: [{ url: img.imageUrl, hint: img.imageHint }],
    category: detail.category,
    keywords: detail.keywords,
    seller: { id: sellerInfo.id, name: sellerInfo.name },
    status: status,
    stock: detail.stock,
    unitOfMeasure: detail.unit,
    isPromoted: detail.isPromoted,
    isFeatured: detail.isFeatured,
  } as Product;
});

const simplifiedProducts = mockProducts.map(p => ({ id: p.id, name: p.name, images: p.images, price: p.price }));

const rawOrders: Omit<Order, 'id' | 'orderDate'>[] = [
  {
    product: simplifiedProducts[0],
    buyer: { id: 'buyer_1', name: 'Anjali Sharma' },
    sellerId: 'seller_1',
    quantity: 1,
    total: 499,
    status: 'delivered',
  },
  {
    product: simplifiedProducts[4],
    buyer: { id: 'buyer_2', name: 'Rohan Mehta' },
    sellerId: 'seller_5',
    quantity: 1,
    total: 1200,
    status: 'shipped',
  },
  {
    product: simplifiedProducts[8],
    buyer: { id: 'buyer_3', name: 'Priya Singh' },
    sellerId: 'seller_9',
    quantity: 2,
    total: 900,
    status: 'confirmed',
  },
  {
    product: simplifiedProducts[6],
    buyer: { id: 'buyer_1', name: 'Anjali Sharma' },
    sellerId: 'seller_7',
    quantity: 1,
    total: 899,
    status: 'pending',
  },
    {
    product: simplifiedProducts[1],
    buyer: { id: 'buyer_4', name: 'Vikram Reddy' },
    sellerId: 'seller_2',
    quantity: 2,
    total: 500,
    status: 'pending',
  },
];

export const mockOrders: (Omit<Order, 'id'> & { orderDate: Date })[] = [];

rawOrders.forEach((order, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (rawOrders.length - index) * 2);
    mockOrders.push({ ...order, orderDate: date });
});
