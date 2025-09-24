

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, UploadCloud } from "lucide-react";
import { HeroSliderManager } from "@/components/admin/HeroSliderManager";
import { BannerAdsManager } from "@/components/admin/BannerAdsManager";
import { LogoManager } from "@/components/admin/LogoManager";

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Homepage Content Management</h1>
      <div className="grid gap-8">
        <LogoManager />
        <HeroSliderManager />
        <BannerAdsManager />
        <Card>
          <CardHeader>
            <CardTitle>Other Homepage Sections</CardTitle>
            <CardDescription>Manage other content that appears on your store's homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Star className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg">Featured & Promoted Products</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-3">To feature or promote a product, go to the product's edit page and use the toggles in the "Marketing" section.</p>
                     <Button variant="outline" asChild>
                        <Link href="/admin/products">Go to Products</Link>
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
