
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById, getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/types';
import { ProductDetails } from '@/components/products/ProductDetails';
import { ProductDetailSkeleton } from '@/components/products/ProductDetailSkeleton';

interface ProductPageProps {
  params: { id: string };
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const fetchedProduct = await getProductById(id);
    if (!fetchedProduct || fetchedProduct.status !== 'approved') {
      return null;
    }
    return fetchedProduct;
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return null;
  }
}

async function fetchRelatedProducts(category: string, productId: string): Promise<Product[]> {
  try {
    const allApprovedProducts = await getProducts('approved');
    return allApprovedProducts
      .filter((p) => p.category === category && p.id !== productId)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProduct(params.id);

  if (!product) {
    return {
      title: 'Product not found',
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.images[0].url],
    },
  };
}


export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = params;
  const product = await fetchProduct(id as string);

  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product.category, product.id);

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}
