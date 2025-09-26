
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getSellerById, getProductsBySeller, getBlogsBySeller } from '@/lib/firebase/firestore';
import type { Seller, Product, Blog } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Newspaper, Package } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { format } from 'date-fns';
import Link from 'next/link';

interface MakerPageProps {
  params: { id: string };
}

async function getSellerData(id: string): Promise<{ seller: Seller; products: Product[]; stories: Blog[] } | null> {
  try {
    const [seller, products, stories] = await Promise.all([
      getSellerById(id),
      getProductsBySeller(id),
      getBlogsBySeller(id),
    ]);

    if (!seller || seller.status !== 'approved') {
      return null;
    }
    
    const approvedProducts = products.filter(p => p.status === 'approved');
    const approvedStories = stories.filter(s => s.status === 'approved');

    return { seller, products: approvedProducts, stories: approvedStories };
  } catch (error) {
    console.error("Failed to fetch seller data:", error);
    return null;
  }
}

export default async function MakerPage({ params }: MakerPageProps) {
  const { id } = params;
  const data = await getSellerData(id);

  if (!data) {
    notFound();
  }

  const { seller, products, stories } = data;

  return (
    <div className="container py-12">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <Avatar className="h-28 w-28 text-4xl border-2">
            <AvatarImage src={`https://picsum.photos/seed/${seller.id}/200`} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold font-headline">{seller.name}</h1>
            {seller.location && (
              <p className="mt-2 text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <MapPin className="h-4 w-4" />
                {seller.location.address}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <main className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              Products by {seller.name}
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  This seller has not listed any products yet.
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-primary" />
                Stories from the Maker
            </h2>
             {stories.length > 0 ? (
                <div className="space-y-6">
                    {stories.map(story => <StoryPreviewCard key={story.id} story={story} />)}
                </div>
            ) : (
                 <Card>
                    <CardContent className="p-12 text-center text-muted-foreground">
                        No stories from this seller yet. Check back soon!
                    </CardContent>
                </Card>
            )}
          </section>

        </main>
        <aside className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>About {seller.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* This would come from a seller bio field */}
                    <p className="text-muted-foreground text-sm">
                        {seller.name} is a passionate artisan from {seller.location?.address.split(',')[1] || 'their local community'}, specializing in crafting unique, high-quality goods. With a commitment to traditional techniques and sustainable practices, every piece tells a story of dedication and skill. Support local by exploring their collection.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                       For inquiries, please use the "Chat with Seller" feature on any of their product pages.
                    </p>
                </CardContent>
            </Card>
        </aside>
      </div>
    </div>
  );
}


function StoryPreviewCard({story}: {story: Blog}) {
    return (
        <Card className="flex flex-col md:flex-row group">
            <Link href={`/blogs/${story.id}`} className="block md:w-1/3">
                 {story.featuredImage ? (
                    <div className="relative aspect-video md:aspect-square w-full h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-r-none">
                        <Image
                        src={story.featuredImage.url}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={story.featuredImage.hint}
                        />
                    </div>
                ) : (
                    <div className="aspect-video md:aspect-square w-full bg-secondary rounded-t-lg md:rounded-l-lg md:rounded-r-none" />
                )}
            </Link>
            <div className="flex-1 flex flex-col p-4">
                 <CardTitle className="leading-snug group-hover:text-primary mb-2">
                    <Link href={`/blogs/${story.id}`}>{story.title}</Link>
                </CardTitle>
                 <p className="text-sm text-muted-foreground line-clamp-3 flex-grow" dangerouslySetInnerHTML={{ __html: story.content.replace(/<[^>]+>/g, '') }} />
                 <time dateTime={story.createdAt} className="text-xs text-muted-foreground mt-4">{format(new Date(story.createdAt), 'MMMM d, yyyy')}</time>
            </div>
        </Card>
    )
}
