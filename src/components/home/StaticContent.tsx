import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase/firestore';

// This is a server component that can use ISR
export const revalidate = 3600; // Revalidate once per hour

// Fetch data at build time
async function getStaticProducts() {
  const products = await getProducts('approved');
  return products.slice(0, 4); // Return only first 4 products for static content
}

export async function StaticContent() {
  const staticProducts = await getStaticProducts();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {staticProducts.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-muted-foreground">{product.category}</p>
          <p className="font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      ))}
    </div>
  );
}