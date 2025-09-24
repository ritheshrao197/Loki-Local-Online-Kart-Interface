
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SlidersHorizontal, Star, UploadCloud } from "lucide-react";

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Homepage Content Management</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Homepage Content</CardTitle>
            <CardDescription>Control the content that appears on your store's homepage to highlight campaigns, featured products, and promotions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
                <SlidersHorizontal className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg">Hero Sliders</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-3">Manage the main carousel images on the homepage. To feature a product in the slider, go to the product's edit page and enable the "Feature on Homepage" option.</p>
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Go to Products</Link>
                    </Button>
                </div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Star className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg">Featured & Promoted Products</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-3">Highlight specific products. Use the "Promote Product" toggle on the product edit page to mark items for special visibility.</p>
                     <Button variant="outline" asChild>
                        <Link href="/admin/products">Go to Products</Link>
                    </Button>
                </div>
            </div>
             <div className="flex items-start gap-4 p-4 border rounded-lg bg-secondary/50">
                <UploadCloud className="h-8 w-8 text-muted-foreground mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg">Homepage Banner Ads</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-3">Functionality to upload and manage banner advertisements for monetization or announcements is coming soon.</p>
                    <Button variant="secondary" disabled>Manage Banners (Soon)</Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
