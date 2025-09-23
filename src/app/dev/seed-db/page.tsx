
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, getDocs, writeBatch, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { mockProducts, mockSellers, mockOrders } from '@/lib/placeholder-data';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SeedStatus = 'idle' | 'success' | 'error' | 'already_seeded';

export default function SeedDbPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: SeedStatus; message: string } | null>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const productsCollection = collection(db, 'products');
      const sellersCollection = collection(db, 'sellers');
      const ordersCollection = collection(db, 'orders');
      
      const existingProducts = await getDocs(productsCollection);
      const existingSellers = await getDocs(sellersCollection);

      if (!existingProducts.empty || !existingSellers.empty) {
        setResult({
          status: 'already_seeded',
          message: 'Database already contains data. Seeding was skipped.',
        });
        setLoading(false);
        return;
      }
      
      const batch = writeBatch(db);

      // Seed Sellers
      mockSellers.forEach((seller) => {
        const docRef = doc(db, 'sellers', seller.id);
        batch.set(docRef, seller);
      });

      // Seed Products
      mockProducts.forEach((product) => {
        const docRef = doc(db, 'products', product.id);
        batch.set(docRef, product);
      });

      await batch.commit();

      // Seed Orders separately as they don't have a predefined ID
      for (const order of mockOrders) {
        await addDoc(ordersCollection, order);
      }
      
      const totalCount = mockProducts.length + mockSellers.length + mockOrders.length;
      setResult({
        status: 'success',
        message: `Successfully seeded ${totalCount} documents across products, sellers, and orders.`,
      });

    } catch (error) {
      console.error("Error seeding database:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
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
            Populate your Firestore collections with mock data for products, sellers, and orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Click the button below to add sample data to your Firestore database. This action will only run if the products or sellers collections are empty.
            </p>
            <Button onClick={handleSeed} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                'Seed Database'
              )}
            </Button>
            {result && (
              <div className="mt-4 text-center p-4 rounded-md w-full bg-secondary">
                {result.status === 'success' && <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />}
                {result.status === 'error' && <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />}
                {result.status === 'already_seeded' && <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />}
                <p className="font-semibold">{result.message}</p>
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
