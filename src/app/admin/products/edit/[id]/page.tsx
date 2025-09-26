
'use client';

import { Suspense, lazy } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const ProductForm = lazy(() => import('@/components/dashboard/ProductForm').then(mod => ({ default: mod.ProductForm })));

export default function AdminEditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        const fetchedProduct = await getProductById(productId);
        if (!fetchedProduct) {
          notFound();
        } else {
          setProduct(fetchedProduct);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/admin/products`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Product (Admin)</h1>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : product ? (
        <Suspense fallback={<div className="space-y-4"><Skeleton className="h-48 w-full" /></div>}>
          <ProductForm product={product} isAdmin={true} />
        </Suspense>
      ) : null}
    </div>
  );
}
