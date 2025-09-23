import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const categories = [
  { name: 'Handicrafts', image: 'https://images.unsplash.com/photo-1596700135890-36c13c7040a7?q=80&w=387&auto=format&fit=crop', link: '#', hint: 'handicrafts' },
  { name: 'Food Items', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=774&auto=format&fit=crop', link: '#', hint: 'food items' },
  { name: 'Textiles', image: 'https://images.unsplash.com/photo-1519709405106-96a17b5a8f5c?q=80&w=870&auto=format&fit=crop', link: '#', hint: 'textiles' },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1534349762237-7a2c91355474?q=80&w=870&auto=format&fit=crop', link: '#', hint: 'home decor' },
];

export function FeaturedCategories() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold font-headline mb-6">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link href={category.link} key={category.name} className="group">
            <Card className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={category.hint}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="font-headline text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
