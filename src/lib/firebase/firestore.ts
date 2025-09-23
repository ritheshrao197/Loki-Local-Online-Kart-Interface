
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
} from 'firebase/firestore';
import { db } from './firebase';
import type { Seller, Product, Order } from '@/lib/types';

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
    const sellerRef = doc(db, 'sellers', sellerId);
    const sellerSnap = await getDoc(sellerRef);

    if (!sellerSnap.exists()) {
        return null;
    }

    return { id: sellerSnap.id, ...sellerSnap.data() } as Seller;
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
export async function getProducts(status?: 'pending' | 'approved' | 'rejected' | 'all'): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const q = status && status !== 'all' ? query(productsCol, where('status', '==', status)) : query(productsCol);
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
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
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
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

    return { id: productSnap.id, ...productSnap.data() } as Product;
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
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, product);
    return { id: docRef.id, ...product };
}

/**
 * Updates an existing product in Firestore.
 * @param productId - The ID of the product to update.
 * @param productData - The partial product data to update.
 */
export async function updateProduct(productId: string, productData: Partial<Product>): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, productData);
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
  const q = query(ordersCol, where('sellerId', '==', sellerId));
  const orderSnapshot = await getDocs(q);
  const orderList = orderSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate as Timestamp,
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
