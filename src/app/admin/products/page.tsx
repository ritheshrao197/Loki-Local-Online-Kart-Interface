import { ProductModerationCard } from "@/components/admin/ProductModerationCard";
import { mockProducts } from "@/lib/placeholder-data";

export default function AdminProductsPage() {
  const pendingProducts = mockProducts.filter(p => p.status === 'pending');

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Product Moderation</h1>
            <p className="text-muted-foreground">Review and approve products submitted by sellers.</p>
        </div>

        <div className="space-y-6">
            {pendingProducts.length > 0 ? (
                pendingProducts.map(product => (
                    <ProductModerationCard key={product.id} product={product} />
                ))
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">All Clear!</h3>
                    <p className="text-muted-foreground mt-1">There are no pending products to review.</p>
                </div>
            )}
        </div>
    </div>
  )
}
