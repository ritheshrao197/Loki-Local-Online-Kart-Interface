'use client';

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
} from 'firebase/firestore';
import { db } from './firebase';
import type { Seller, Product } from '@/lib/types';

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
 * @param status - The new status ('approved' or 'rejected').
 */
export async function updateSellerStatus(sellerId: string, status: 'approved' | 'rejected'): Promise<void> {
  const sellerRef = doc(db, 'sellers', sellerId);
  await updateDoc(sellerRef, { status });
}

// ================== Product Functions ==================

/**
 * Fetches all products from the 'products' collection in Firestore.
 */
export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Product;
    });
    return productList;
}
