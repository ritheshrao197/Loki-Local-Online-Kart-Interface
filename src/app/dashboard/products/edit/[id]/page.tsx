
'use client';

import { ProductForm } from "@/components/dashboard/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
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

  if (!sellerId) {
    return null; // Or a loading/error state
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/dashboard/${sellerId}/products`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : product ? (
        <ProductForm product={product} />
      ) : null}
    </div>
  );
}
