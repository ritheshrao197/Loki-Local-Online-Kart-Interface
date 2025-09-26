







import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  Timestamp,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Seller, Product, Order, Blog, HeroSlide, BannerAd } from '@/lib/types';

// ================== Seller Functions ==================

/**
 * Fetches all sellers from the 'sellers' collection in Firestore.
 */
export async function getSellers(): Promise<Seller[]> {
  const sellersCol = collection(db, 'sellers');
  const sellerSnapshot = await getDocs(sellersCol);
  const sellerList = sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Seller));
  return sellerList;
}

/**
 * Fetches a single seller by its ID from Firestore.
 */
export async function getSellerById(sellerId: string): Promise<Seller | null> {
    if (!sellerId) {
        return null;
    }
    try {
        const sellerRef = doc(db, 'sellers', sellerId);
        const sellerSnap = await getDoc(sellerRef);

        if (!sellerSnap.exists()) {
            console.warn(`No seller found with ID: ${sellerId}`);
            return null;
        }

        return { id: sellerSnap.id, ...sellerSnap.data() } as Seller;
    } catch (error) {
        console.error(`Error fetching seller with ID ${sellerId}:`, error);
        return null;
    }
}

/**
 * Adds a new seller to the 'sellers' collection in Firestore.
 * @param seller - The seller data to add.
 */
export async function addSeller(seller: Omit<Seller, 'id'>): Promise<Seller> {
    const sellersCol = collection(db, 'sellers');
    const docRef = await addDoc(sellersCol, seller);
    return { id: docRef.id, ...seller };
}

/**
 * Updates a seller's status in Firestore.
 * @param sellerId - The ID of the seller to update.
 * @param status - The new status ('approved', 'rejected', or 'suspended').
 */
export async function updateSellerStatus(sellerId: string, status: Seller['status']): Promise<void> {
  const sellerRef = doc(db, 'sellers', sellerId);
  await updateDoc(sellerRef, { status });
}

/**
 * Updates a seller's commission rate in Firestore.
 * @param sellerId - The ID of the seller to update.
 * @param commissionRate - The new commission rate.
 */
export async function updateSellerCommission(sellerId: string, commissionRate: number): Promise<void> {
    const sellerRef = doc(db, 'sellers', sellerId);
    await updateDoc(sellerRef, { commissionRate });
}


// ================== Product Functions ==================

/**
 * Fetches products from Firestore, optionally filtering by status.
 * @param status - Optional status to filter products by.
 */
export async function getProducts(status?: Product['status'] | 'all'): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const q = status && status !== 'all' ? query(productsCol, where('status', '==', status)) : query(productsCol);
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Timestamps to ISO strings if they exist
            manufacturingDate: data.manufacturingDate?.toDate ? data.manufacturingDate.toDate().toISOString() : undefined,
            expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate().toISOString() : undefined,
        } as Product;
    });
    return productList;
}

/**
 * Fetches featured products from Firestore.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, where('isFeatured', '==', true), where('status', '==', 'approved'));
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            manufacturingDate: data.manufacturingDate?.toDate ? data.manufacturingDate.toDate().toISOString() : undefined,
            expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate().toISOString() : undefined,
        } as Product;
    });
    return productList;
}

/**
 * Fetches all products for a specific seller.
 * @param sellerId The ID of the seller.
 */
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const q = query(productsCol, where('seller.id', '==', sellerId));
  const productSnapshot = await getDocs(q);
  const productList = productSnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Product))
    .filter(product => product.status !== 'archived');
  return productList;
}


/**
 * Fetches a single product by its ID from Firestore.
 * @param productId The ID of the product to fetch.
 */
export async function getProductById(productId: string): Promise<Product | null> {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }
    const data = productSnap.data();

    return { 
        id: productSnap.id, 
        ...data,
        manufacturingDate: data.manufacturingDate?.toDate ? data.manufacturingDate.toDate().toISOString() : undefined,
        expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate().toISOString() : undefined,
    } as Product;
}


/**
 * Updates a product's status in Firestore.
 * @param productId - The ID of the product to update.
 * @param status - The new status ('approved' or 'rejected').
 */
export async function updateProductStatus(productId: string, status: 'approved' | 'rejected'): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { status });
}

/**
 * Adds a new product to the 'products' collection in Firestore.
 * @param product - The product data to add.
 */
export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const productsCol = collection(db, 'products');
    
    const productData: { [key: string]: any } = { ...product };
    
    if (product.manufacturingDate) {
        productData.manufacturingDate = Timestamp.fromDate(new Date(product.manufacturingDate));
    }
    if (product.expiryDate) {
        productData.expiryDate = Timestamp.fromDate(new Date(product.expiryDate));
    }

    const docRef = await addDoc(productsCol, productData);
    return docRef.id;
}

/**
 * Updates an existing product in Firestore.
 * @param productId - The ID of the product to update.
 * @param productData - The partial product data to update.
 */
export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> {
  const productRef = doc(db, 'products', productId);
  
  const dataToUpdate: { [key: string]: any } = { ...productData };

  if (productData.manufacturingDate) {
    dataToUpdate.manufacturingDate = Timestamp.fromDate(new Date(productData.manufacturingDate));
  }
  if (productData.expiryDate) {
    dataToUpdate.expiryDate = Timestamp.fromDate(new Date(productData.expiryDate));
  }

  await updateDoc(productRef, dataToUpdate);
}

/**
 * Deletes a product from Firestore.
 * @param productId - The ID of the product to delete.
 */
export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
}


// ================== Order Functions ==================

/**
 * Fetches all orders for a specific seller.
 * @param sellerId The ID of the seller whose orders to fetch.
 */
export async function getOrdersBySeller(sellerId: string): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, where('seller.id', '==', sellerId));
  const orderSnapshot = await getDocs(q);
  const orderList = orderSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        orderDate: (data.orderDate as Timestamp).toDate().toISOString(),
    } as Order
  });
  return orderList;
}

/**
 * Updates an order's status in Firestore.
 * @param orderId - The ID of the order to update.
 * @param status - The new status.
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
}

// ================== Blog Functions ==================

const blogToClient = (doc: any): Blog => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Blog;
};


export async function getBlogs(status?: Blog['status'] | 'all'): Promise<Blog[]> {
  const blogsCol = collection(db, 'blogs');
  const q = status && status !== 'all' ? query(blogsCol, where('status', '==', status)) : query(blogsCol);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(blogToClient);
}

export async function getBlogById(blogId: string): Promise<Blog | null> {
  const blogRef = doc(db, 'blogs', blogId);
  const snap = await getDoc(blogRef);
  return snap.exists() ? blogToClient(snap) : null;
}

export async function getBlogsBySeller(sellerId: string): Promise<Blog[]> {
  const q = query(collection(db, 'blogs'), where('author.id', '==', sellerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(blogToClient);
}

export async function addBlog(blogData: Partial<Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<string> {
  const blogWithTimestamps = {
    ...blogData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'blogs'), blogWithTimestamps);
  return docRef.id;
}

export async function updateBlog(blogId: string, blogData: Partial<Omit<Blog, 'id'>>): Promise<void> {
  const blogRef = doc(db, 'blogs', blogId);
  await updateDoc(blogRef, {
    ...blogData,
    status: 'pending', // Reset status on update
    updatedAt: serverTimestamp(),
  });
}

export async function updateBlogStatus(blogId: string, status: Blog['status']): Promise<void> {
  const blogRef = doc(db, 'blogs', blogId);
  await updateDoc(blogRef, { status });
}

export async function deleteBlog(blogId: string): Promise<void> {
  await deleteDoc(doc(db, 'blogs', blogId));
}

// ================== Hero Slider Functions ==================

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const slidesCol = collection(db, 'heroSlides');
  const q = query(slidesCol, where('isActive', '==', true));
  const snapshot = await getDocs(q);
  const slides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
  slides.sort((a, b) => a.order - b.order);
  return slides;
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const slidesCol = collection(db, 'heroSlides');
  const q = query(slidesCol);
  const snapshot = await getDocs(q);
  const slides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
  slides.sort((a,b) => a.order - b.order);
  return slides;
}

export async function addHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'heroSlides'), slide);
  return docRef.id;
}

export async function updateHeroSlide(slideId: string, slideData: Partial<Omit<HeroSlide, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'heroSlides', slideId), slideData);
}

export async function deleteHeroSlide(slideId: string): Promise<void> {
  await deleteDoc(doc(db, 'heroSlides', slideId));
}

// ================== Banner Ad Functions ==================

export async function getBannerAds(placement?: BannerAd['placement']): Promise<BannerAd[]> {
  const adsCol = collection(db, 'bannerAds');
  const q = placement 
    ? query(adsCol, where('isActive', '==', true), where('placement', '==', placement))
    : query(adsCol, where('isActive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BannerAd));
}

export async function getAllBannerAds(): Promise<BannerAd[]> {
  const adsCol = collection(db, 'bannerAds');
  const snapshot = await getDocs(query(adsCol));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BannerAd));
}

export async function addBannerAd(ad: Omit<BannerAd, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'bannerAds'), ad);
  return docRef.id;
}

export async function updateBannerAd(adId: string, adData: Partial<Omit<BannerAd, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'bannerAds', adId), adData);
}

export async function deleteBannerAd(adId: string): Promise<void> {
  await deleteDoc(doc(db, 'bannerAds', adId));
}
