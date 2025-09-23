
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";

export default function ContentPage() {

    const slides = [
        { id: 1, title: 'Featured Handcrafted Pottery', image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1974&auto=format&fit=crop', active: true },
        { id: 2, title: 'New Arrivals: Summer Apparel', image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop', active: true },
        { id: 3, title: 'Limited Time Offer', image: 'https://images.unsplash.com/photo-1576989462838-83c34089a597?q=80&w=2070&auto=format&fit=crop', active: false },
    ];
    
    const promotions = [
        { id: 1, title: 'Seasonal Discounts', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop', active: true },
        { id: 2, title: 'Meet The Artisans', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop', active: true },
    ];

    const featuredCategories = [
        { name: 'Handicrafts', image: 'https://images.unsplash.com/photo-1596700135890-36c13c7040a7?q=80&w=387&auto=format&fit=crop' },
        { name: 'Food Items', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=774&auto=format&fit=crop' },
    ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Homepage Content</h1>

      {/* Hero Slider Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Hero Slider</CardTitle>
                <CardDescription>Manage the slides on the homepage carousel.</CardDescription>
            </div>
            <Button size="sm"><PlusCircle className="mr-2"/>Add Slide</Button>
          </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>CTA Text</TableHead>
                        <TableHead>CTA Link</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {slides.map(slide => (
                        <TableRow key={slide.id}>
                            <TableCell><Image src={slide.image} alt={slide.title} width={80} height={45} className="rounded-md object-cover aspect-video"/></TableCell>
                            <TableCell><Input defaultValue={slide.title} className="w-48"/></TableCell>
                            <TableCell><Input defaultValue="Shop Now"/></TableCell>
                            <TableCell><Input defaultValue="/products/category/all"/></TableCell>
                            <TableCell><Switch checked={slide.active} /></TableCell>
                            <TableCell><Button variant="ghost" size="icon"><MoreHorizontal/></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Promotions & Banners */}
       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Promotional Banners</CardTitle>
                <CardDescription>Manage promotional cards/banners below the slider.</CardDescription>
            </div>
            <Button size="sm"><PlusCircle className="mr-2"/>Add Banner</Button>
          </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Subtitle</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {promotions.map(promo => (
                        <TableRow key={promo.id}>
                            <TableCell><Image src={promo.image} alt={promo.title} width={100} height={50} className="rounded-md object-cover aspect-video"/></TableCell>
                            <TableCell><Input defaultValue={promo.title} className="w-48"/></TableCell>
                            <TableCell><Input defaultValue="Special offer inside."/></TableCell>
                            <TableCell><Input defaultValue="/promotions/seasonal"/></TableCell>
                            <TableCell><Switch checked={promo.active} /></TableCell>
                            <TableCell><Button variant="ghost" size="icon"><MoreHorizontal/></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

        {/* Featured Categories */}
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Featured Categories</CardTitle>
                        <CardDescription>Select which categories to feature on the homepage.</CardDescription>
                    </div>
                    <Button size="sm">Edit Categories</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredCategories.map((category) => (
                    <div key={category.name} className="group relative">
                        <Image
                            src={category.image}
                            alt={category.name}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover aspect-square"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                            <h3 className="font-headline text-white text-xl font-semibold">{category.name}</h3>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
