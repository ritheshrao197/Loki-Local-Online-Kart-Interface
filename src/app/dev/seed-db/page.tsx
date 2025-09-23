
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { mockProducts } from '@/lib/placeholder-data';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SeedDbPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: 'success' | 'error' | 'already_seeded'; message: string } | null>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const productsCollection = collection(db, 'products');
      const existingProducts = await getDocs(productsCollection);

      if (!existingProducts.empty) {
        setResult({
          status: 'already_seeded',
          message: 'Database already contains products. Seeding was skipped.',
        });
        setLoading(false);
        return;
      }
      
      const batch = writeBatch(db);
      mockProducts.forEach((product) => {
        const docRef = collection(db, 'products').doc(product.id);
        const { id, ...productData } = product; // Exclude ID from document data
        batch.set(docRef, productData);
      });
      await batch.commit();
      
      setResult({
        status: 'success',
        message: `Successfully seeded ${mockProducts.length} products.`,
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
            Populate your Firestore 'products' collection with mock data. This is useful for development and testing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Click the button below to add the sample products from the project's mock data file into your Firestore database.
            </p>
            <Button onClick={handleSeed} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                'Seed Products'
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
