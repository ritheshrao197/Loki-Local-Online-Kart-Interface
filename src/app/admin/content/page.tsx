
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function ContentPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Homepage Content</h1>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start gap-4">
             <Info className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <CardTitle className="text-blue-900">Content is Now Dynamic</CardTitle>
              <CardDescription className="text-blue-700">
                The homepage content (Hero Slider, Featured Categories, and Promotions) is now automatically populated from your product data in Firestore.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-blue-800">
            <li>The <span className="font-semibold">Hero Slider</span> displays the first few products from your approved list.</li>
            <li>The <span className="font-semibold">Featured Categories</span> are generated from the unique categories of your approved products.</li>
            <li>The <span className="font-semibold">Promotional Banners</span> now highlight your most premium products based on price.</li>
          </ul>
           <p className="mt-4 text-sm text-blue-800">
            To change what appears on the homepage, you can add, remove, or edit products in the <a href="/admin/products" className="underline font-semibold">Products</a> section.
           </p>
        </CardContent>
      </Card>

    </div>
  );
}
