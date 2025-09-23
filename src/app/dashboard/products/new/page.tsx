
'use client';

import { ProductForm } from "@/components/dashboard/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function NewProductPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;

  if (!sellerId) {
    return null; // Or a loading indicator
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
            <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
        </div>
        <ProductForm />
    </div>
  )
}
