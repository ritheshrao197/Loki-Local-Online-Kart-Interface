
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById, getProducts, getSellerById } from '@/lib/firebase/firestore';
import type { Product, Seller } from '@/lib/types';
import { ProductDetails } from '@/components/products/ProductDetails';
import { ProductDetailSkeleton } from '@/components/products/ProductDetailSkeleton';

interface ProductPageProps {
  params: { id: string };
}

async function fetchProductData(id: string): Promise<{product: Product, seller: Seller} | null> {
  try {
    const fetchedProduct = await getProductById(id);
    if (!fetchedProduct || fetchedProduct.status !== 'approved') {
      return null;
    }
    const fetchedSeller = await getSellerById(fetchedProduct.sellerId);
    if (!fetchedSeller) {
        return null;
    }

    return { product: fetchedProduct, seller: fetchedSeller };
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
  const { id } = await params;
  const data = await fetchProductData(id);

  if (!data) {
    return {
      title: 'Product not found',
    };
  }

  const { product } = data;

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
  const { id } = await params;
  const data = await fetchProductData(id as string);

  if (!data) {
    notFound();
  }
  const { product, seller } = data;

  const relatedProducts = await fetchRelatedProducts(product.category, product.id);

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetails product={product} seller={seller} relatedProducts={relatedProducts} />
    </Suspense>
  );
}
