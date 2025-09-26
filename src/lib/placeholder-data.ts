
import type { Product, Seller, Order, Blog } from './types';
import { Timestamp } from 'firebase/firestore';
import { placeholderImages } from './placeholder-images';


export const mockSellers: Seller[] = [
  { id: 'seller_101', name: 'Artisan Fabrics Co.', mobile: '9870123456', pan: 'ABCDE1234F', status: 'approved', commissionRate: 15, location: { address: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 }, storyAvailable: true },
  { id: 'seller_102', name: 'FarmFresh Spices', mobile: '9122987654', pan: 'XYZAB5678D', status: 'approved', commissionRate: 15, location: { address: 'Udupi, Karnataka', lat: 13.3409, lng: 74.7421 }, storyAvailable: true },
  { id: 'seller_103', name: 'GreenEarth', mobile: '9988632100', pan: 'LMNOP9876K', status: 'approved', commissionRate: 12, location: { address: 'Coimbatore, Tamil Nadu', lat: 11.0168, lng: 76.9558 }, storyAvailable: false },
  { id: 'seller_4', name: 'EcoSmile', mobile: '9871234560', pan: 'KJHGF6543T', status: 'pending', commissionRate: 15, location: { address: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 } },
  { id: 'seller_5', name: 'ClayCraft Studio', mobile: '9001122334', pan: 'QWERTY4321P', status: 'pending', commissionRate: 15, location: { address: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 } },
];


export const mockProducts: Product[] = [
    { 
        id: 'prod_101',
        name: 'Handwoven Cotton Scarf',
        seller: { id: 'seller_101', name: 'Artisan Fabrics Co.' },
        category: 'Handicrafts',
        price: 499,
        stock: 50,
        rating: 4.8,
        reviewsCount: 89,
        keywords: 'cotton, scarf, handwoven',
        isFeatured: true,
        isPromoted: false,
        videoUrl: 'https://youtu.be/abc123',
        images: [{ url: placeholderImages.find(p => p.id === 'prod_101')?.url!, hint: placeholderImages.find(p => p.id === 'prod_101')?.hint! }],
        description: 'A soft, beautifully handwoven cotton scarf with a simple, elegant pattern, perfect for all seasons.',
        status: 'approved',
        unitOfMeasure: 'piece',
    },
    { 
        id: 'prod_103',
        name: 'Organic Turmeric Powder',
        seller: { id: 'seller_102', name: 'FarmFresh Spices' },
        category: 'Food',
        price: 250,
        stock: 120,
        rating: 4.5,
        reviewsCount: 120,
        keywords: 'turmeric, organic, spice',
        isFeatured: false,
        isPromoted: true,
        videoUrl: 'https://youtu.be/turmeric1',
        images: [{ url: placeholderImages.find(p => p.id === 'prod_103')?.url!, hint: placeholderImages.find(p => p.id === 'prod_103')?.hint! }],
        description: 'Pure, vibrant organic turmeric powder sourced from local farms, finely ground for culinary use.',
        status: 'approved',
        unitOfMeasure: 'kg',
    },
    { 
        id: 'prod_110',
        name: 'Jute Shopping Bag',
        seller: { id: 'seller_103', name: 'GreenEarth' },
        category: 'Textiles',
        price: 299,
        stock: 70,
        rating: 4.7,
        reviewsCount: 58,
        keywords: 'jute, eco-friendly, bag',
        isFeatured: true,
        isPromoted: false,
        images: [{ url: placeholderImages.find(p => p.id === 'prod_110')?.url!, hint: placeholderImages.find(p => p.id === 'prod_110')?.hint! }],
        description: 'An eco-friendly and durable jute shopping bag, perfect for groceries and daily use, promoting a sustainable lifestyle.',
        status: 'approved',
        unitOfMeasure: 'piece',
    },
    { 
        id: 'prod_115',
        name: 'Bamboo Toothbrush Set',
        seller: { id: 'seller_103', name: 'GreenEarth' },
        category: 'Personal Care',
        price: 399,
        stock: 200,
        rating: 4.6,
        reviewsCount: 95,
        keywords: 'bamboo, biodegradable',
        isFeatured: true,
        isPromoted: true,
        videoUrl: 'https://youtu.be/bamboo15',
        images: [{ url: placeholderImages.find(p => p.id === 'prod_115')?.url!, hint: placeholderImages.find(p => p.id === 'prod_115')?.hint! }],
        description: 'A set of three biodegradable bamboo toothbrushes, a great alternative to plastic for your personal care routine.',
        status: 'approved',
        unitOfMeasure: 'piece',
    },
    { 
        id: 'prod_120',
        name: 'Handmade Ceramic Vase',
        seller: { id: 'seller_5', name: 'ClayCraft Studio' },
        category: 'Home Decor',
        price: 1200,
        stock: 30,
        rating: 4.9,
        reviewsCount: 45,
        keywords: 'ceramic, vase, handmade',
        isFeatured: false,
        isPromoted: false,
        images: [{ url: placeholderImages.find(p => p.id === 'prod_120')?.url!, hint: placeholderImages.find(p => p.id === 'prod_120')?.hint! }],
        description: 'A beautiful handmade ceramic vase, crafted by local artisans with a unique, rustic glaze.',
        status: 'pending',
        unitOfMeasure: 'piece',
    },
     { 
        id: 'prod_131',
        name: 'Traditional Khadi Shirt',
        seller: { id: 'seller_101', name: 'Artisan Fabrics Co.' },
        category: 'Apparel',
        price: 800,
        stock: 60,
        rating: 4.7,
        reviewsCount: 72,
        keywords: 'khadi, shirt, cotton',
        isFeatured: false,
        isPromoted: true,
        images: [{ url: placeholderImages.find(p => p.id === 'prod_131')?.url!, hint: placeholderImages.find(p => p.id === 'prod_131')?.hint! }],
        description: 'A pure cotton, handwoven Khadi shirt that is comfortable, breathable, and stylish.',
        status: 'approved',
        unitOfMeasure: 'piece',
    }
];

export const mockOrders: (Omit<Order, 'id'> & { id: string, orderDate: Date })[] = [
    {
        id: 'order_001',
        buyer: { id: 'buyer_01', name: 'Rahul Sharma' },
        sellerId: 'seller_101',
        product: { id: 'prod_101', name: 'Handwoven Cotton Scarf', images: [{ url: placeholderImages.find(p => p.id === 'prod_101')?.url!, hint: placeholderImages.find(p => p.id === 'prod_101')?.hint! }], price: 499 },
        quantity: 2,
        total: 998,
        status: 'delivered',
        orderDate: new Date('2025-09-20'),
        paymentMethod: 'UPI',
        deliveryAddress: 'Delhi, Model Town',
    },
    {
        id: 'order_002',
        buyer: { id: 'buyer_02', name: 'Priya Mehta' },
        sellerId: 'seller_102',
        product: { id: 'prod_103', name: 'Organic Turmeric Powder', images: [{ url: placeholderImages.find(p => p.id === 'prod_103')?.url!, hint: placeholderImages.find(p => p.id === 'prod_103')?.hint! }], price: 250 },
        quantity: 1,
        total: 250,
        status: 'pending',
        orderDate: new Date('2025-09-24'),
        paymentMethod: 'COD',
        deliveryAddress: 'Mumbai, Bandra West',
    },
    {
        id: 'order_003',
        buyer: { id: 'buyer_03', name: 'Anil Kumar' },
        sellerId: 'seller_103',
        product: { id: 'prod_110', name: 'Jute Shopping Bag', images: [{ url: placeholderImages.find(p => p.id === 'prod_110')?.url!, hint: placeholderImages.find(p => p.id === 'prod_110')?.hint! }], price: 299 },
        quantity: 1,
        total: 698, // This is incorrect, should be 299 for 1, or 2 products
        status: 'confirmed',
        orderDate: new Date('2025-09-23'),
        paymentMethod: 'Wallet',
        deliveryAddress: 'Bangalore, Koramangala',
    }
];

export const mockBlogs: (Omit<Blog, 'id' | 'createdAt' | 'updatedAt'> & { id: string, createdAt: string })[] = [
    {
        id: 'blog_1',
        title: 'The Art of Handwoven Cotton',
        content: '“We handcraft cotton scarves from natural dyes...”',
        author: { id: 'seller_101', name: 'Artisan Fabrics Co.' },
        status: 'approved',
        createdAt: new Date('2025-09-15').toISOString(),
        imagesCount: 5,
        videosCount: 1,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1561053154-12051c5b880c?q=80&w=870&auto=format&fit=crop',
          hint: 'weaving loom'
        }
    },
    {
        id: 'blog_2',
        title: 'From Farm to Your Kitchen',
        content: '“FarmFresh spices are sourced directly from organic farms...”',
        author: { id: 'seller_102', name: 'FarmFresh Spices' },
        status: 'approved',
        createdAt: new Date('2025-09-18').toISOString(),
        imagesCount: 4,
        videosCount: 2,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=870&auto=format&fit=crop',
          hint: 'spice market'
        }
    },
];
