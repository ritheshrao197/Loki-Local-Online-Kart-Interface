import { getProducts } from '@/lib/firebase/firestore';
import { ProductGridClient } from './ProductGridClient';

export async function ProductGrid() {
    const products = await getProducts('approved');
    return <ProductGridClient initialProducts={products} />;
}
