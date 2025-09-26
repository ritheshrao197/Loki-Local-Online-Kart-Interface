
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, getDocs, writeBatch, doc, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { mockProducts, mockSellers, mockOrders, mockBlogs } from '@/lib/placeholder-data';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SeedStatus = 'idle' | 'success' | 'error' | 'already_seeded';

export default function SeedDbPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState<{ status: SeedStatus; message: string } | null>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const collectionsToDelete = ['products', 'sellers', 'orders', 'blogs'];
      setStatus('Clearing existing data...');

      for (const col of collectionsToDelete) {
        const collectionRef = collection(db, col);
        const snapshot = await getDocs(collectionRef);
        if (snapshot.empty) continue;
        const deleteBatch = writeBatch(db);
        snapshot.docs.forEach(doc => {
          deleteBatch.delete(doc.ref);
        });
        await deleteBatch.commit();
      }

      setStatus('Existing data cleared.');

      const seedBatch = writeBatch(db);

      setStatus('Preparing sellers...');
      mockSellers.forEach((seller) => {
        const docRef = doc(db, 'sellers', seller.id);
        seedBatch.set(docRef, seller);
      });

      setStatus('Preparing products...');
      mockProducts.forEach((product) => {
        const docRef = doc(db, 'products', product.id);
        const { id, ...productData } = product; // Firestore complains if 'id' is in the data
        seedBatch.set(docRef, productData);
      });

      setStatus('Preparing orders...');
      mockOrders.forEach((order) => {
        const {id, ...orderData} = order;
        const docRef = doc(db, 'orders', id);
        const orderDataWithTimestamp = {
            ...orderData,
            orderDate: Timestamp.fromDate(order.orderDate)
        };
        seedBatch.set(docRef, orderDataWithTimestamp);
      });

      setStatus('Preparing blogs...');
      mockBlogs.forEach((blog) => {
          const {id, ...blogData} = blog;
          const docRef = doc(db, 'blogs', id);
          const blogDataWithTimestamp = {
              ...blogData,
              createdAt: Timestamp.fromDate(new Date(blog.createdAt)),
              updatedAt: Timestamp.fromDate(new Date(blog.createdAt)),
          };
          seedBatch.set(docRef, blogDataWithTimestamp);
      });
      
      setStatus('Committing to database...');
      await seedBatch.commit();
      
      setStatus('Seeding complete!');
      const totalCount = mockProducts.length + mockSellers.length + mockOrders.length + mockBlogs.length;
      setResult({
        status: 'success',
        message: `Successfully cleared and seeded ${totalCount} documents.`,
      });

    } catch (error) {
      console.error("Error seeding database:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setStatus('An error occurred.');
      setResult({
        status: 'error',
        message: errorMessage,
      });
       toast({
        title: 'Seeding Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Seed Firestore Database</CardTitle>
          <CardDescription>
            Populate your Firestore collections with mock data for products, sellers, orders, and blogs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Clicking the button will first <span className="font-bold text-destructive">delete all data</span> in the products, sellers, orders, and blogs collections, then re-populate them with fresh mock data.
            </p>
            <Button onClick={handleSeed} disabled={loading} variant="destructive">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {status}...
                </>
              ) : (
                'Clear and Seed Database'
              )}
            </Button>
            
            {result && (
              <div className="mt-4 text-center p-4 rounded-md w-full bg-secondary">
                {result.status === 'success' && <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />}
                {result.status === 'error' && <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />}
                {result.status === 'already_seeded' && <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />}
                <p className="font-semibold">{result.message}</p>
                 {result.status === 'success' && (
                    <Button asChild variant="default" className="mt-4">
                        <Link href="/">View your populated app</Link>
                    </Button>
                )}
              </div>
            )}
             {loading && !result && (
              <div className="mt-4 text-center p-4 rounded-md w-full bg-secondary/50">
                <p className="text-sm font-medium text-muted-foreground">{status}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardContent>
          <Button asChild variant="link" className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
